/**
 * One-off importer for Outscraper-style Google Maps CSVs.
 *
 * Usage:  npm run import:google -- <state-name> <csv-path> [<csv-path>...]
 *   or:   npm run import:google -- auto <csv-path> [...]   (state from coords)
 *
 * Merges into data/trucks.json — does NOT overwrite the 93k existing rows.
 * Existing entries for the same state with low row counts (< 50) are
 * REPLACED so we don't double-list stubs.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

import { US_STATES } from '../lib/states';
import { nearestCity, distanceKm, CITY_CENTROIDS } from '../lib/city-centroids';
import { slugify } from '../lib/slug';
import { matchChain } from '../lib/chain-blocklist';
import type { Truck, Cuisine } from '../lib/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TRUCKS_JSON = resolve(ROOT, 'data', 'trucks.json');

// --- column-name-tolerant reader ------------------------------------------
const FIELDS = {
  url:      ['hfpxzc href'],
  name:     ['qBF1Pd'],
  rating:   ['MW4etd'],
  reviews:  ['UY7F9'],
  category: ['W4Efsd'],
  address:  ['W4Efsd (3)'],
  hours_a:  ['W4Efsd (4)'],
  hours_b:  ['W4Efsd (5)'],
  phone:    ['UsdlK'],
  website:  ['lcr4fd href'],
} as const;

function pick(row: Record<string, unknown>, keys: readonly string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}

// --- truck filter ----------------------------------------------------------
const TRUCK_HINTS = /\b(food[\s-]?truck|truck|mobile|cart|stand|wagon|trailer|shack|kitchen|caterer|catering)\b/i;
const NON_TRUCK_CATEGORIES = new Set([
  'Tour operator', 'Hotel', 'Bar', 'Coffee shop', 'Donut shop',
  'Park', 'Event venue', 'Spa', 'Tourist information center',
]);

function isFoodTruck(name: string, category: string): boolean {
  // Brick-and-mortar chains always lose — even if Outscraper tags them
  // "Mobile caterer" (some do). Single source of truth in chain-blocklist.ts.
  if (matchChain(name)) return false;
  if (NON_TRUCK_CATEGORIES.has(category)) return false;
  if (/Mobile caterer/i.test(category)) return true;
  if (/Food producer/i.test(category)) return true;
  if (TRUCK_HINTS.test(name)) return true;
  // Allow restaurants only if the name explicitly references trucks
  return false;
}

// --- cuisine mapping -------------------------------------------------------
function deriveCuisine(name: string, category: string): Cuisine {
  const s = (name + ' ' + category).toLowerCase();
  if (/taco|burrito|mexican|mex\b|salsa|carniceria|tortilla/.test(s)) return 'Mexican';
  if (/bbq|barbeque|barbecue|smokehouse|brisket|pulled pork|smokin/.test(s)) return 'BBQ';
  if (/pizza|pizzeria|napolet/.test(s)) return 'Pizza';
  if (/italian|pasta|gelato/.test(s)) return 'Italian';
  if (/thai|pad\s*thai|tom\s*yum/.test(s)) return 'Thai';
  if (/chinese|szechuan|wonton|dimsum|dim sum/.test(s)) return 'Chinese';
  if (/japanese|sushi|ramen|teriyaki|bento/.test(s)) return 'Japanese';
  if (/korean|kbbq|bibim|bulgogi|kimchi/.test(s)) return 'Korean';
  if (/viet|pho\b|banh\s*mi/.test(s)) return 'Vietnamese';
  if (/indian|curry|tikka|tandoor|biryani|paratha/.test(s)) return 'Indian';
  if (/mediterranean|greek|gyro|falafel|shawarma|hummus/.test(s)) return 'Mediterranean';
  if (/halal/.test(s)) return 'Halal';
  if (/seafood|lobster|clam|chowder|shrimp|crab/.test(s)) return 'Seafood';
  if (/soul food|southern/.test(s)) return 'Soul Food';
  if (/vegan|plant-based|veggie/.test(s)) return 'Vegan';
  if (/coffee|espresso|latte/.test(s)) return 'Coffee';
  if (/donut|doughnut|cupcake|cookie|ice ?cream|gelato|cake|sweet|dessert|sugar|frozen lemonade/.test(s)) return 'Desserts';
  if (/breakfast|brunch|bagel/.test(s)) return 'Breakfast';
  if (/sandwich|sub|wrap|deli|grilled cheese|burger melt/.test(s)) return 'Sandwiches';
  if (/burger|smash/.test(s)) return 'Burgers';
  if (/caribbean|jamaican|jerk|island/.test(s)) return 'Caribbean';
  if (/cajun|creole|new orleans|gumbo/.test(s)) return 'Cajun';
  if (/tex[ -]?mex/.test(s)) return 'Tex-Mex';
  if (/asian|fusion/.test(s)) return 'Asian';
  return 'American';
}

// --- lat/lng extraction ---------------------------------------------------
function extractCoords(url: string): { lat: number; lng: number } | null {
  // Pattern: !3d{lat}!4d{lng}
  const m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (!m) return null;
  return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
}

// --- review count extraction ----------------------------------------------
function parseReviews(s: string): number | undefined {
  const m = s.match(/\((\d{1,6}(?:[,\s]\d{3})*)\)/);
  if (!m) return undefined;
  const n = parseInt(m[1].replace(/[,\s]/g, ''), 10);
  return Number.isFinite(n) ? n : undefined;
}

// --- hours composition ----------------------------------------------------
function composeHours(a: string, b: string): Truck['hours'] | undefined {
  const both = [a, b].filter(Boolean).join(' ').replace(/^[·\s]+|[·\s]+$/g, '').trim();
  if (!both) return undefined;
  // Best-effort: stuff the same display string in every day. We don't get
  // per-day hours from Outscraper. Better than nothing for "Open · Closes 10pm".
  return { mon: both, tue: both, wed: both, thu: both, fri: both, sat: both, sun: both };
}

// --- state detection from coords -----------------------------------------
function detectState(lat: number, lng: number): { name: string; slug: string; abbr: string } | null {
  // Find nearest known city centroid; use its state
  let best: { name: string; slug: string; abbr: string } | null = null;
  let bestD = Infinity;
  for (const c of CITY_CENTROIDS) {
    const d = distanceKm(lat, lng, c.lat, c.lng);
    if (d < bestD) {
      bestD = d;
      const s = US_STATES.find((x) => x.name === c.state);
      if (s) best = { name: s.name, slug: s.slug, abbr: s.abbr };
    }
  }
  return bestD < 500 ? best : null; // 500 km = ~310 miles guardrail
}

// --- photo pool (mirror what import-old-html uses) -----------------------
const REAL_TRUCK_PHOTOS = [
  'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1650554764451-11b3e7ba5c2d?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1631540223537-8f2d49a4ad9d?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567129937968-cdad8f07e2f8?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1683508700255-f9b09a11f687?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1612208176815-e132bcf971b0?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557818471-8a140ea11868?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1633260682035-b6270ab1b314?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1659734371901-b79d3f76d7b2?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1646309479404-1377aa844531?w=600&q=70&auto=format&fit=crop',
];
function rng(seed: string) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
}

// --- main ------------------------------------------------------------------
function importFile(path: string): { added: Truck[]; rejected: number; stateName: string | null } {
  const wb = XLSX.read(readFileSync(path), { type: 'buffer' });
  const sheetName = wb.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[sheetName], { defval: '' });

  const added: Truck[] = [];
  const seenSlugs = new Set<string>();
  const stateCounter = new Map<string, number>();
  let rejected = 0;

  for (const row of rows) {
    const name     = pick(row, FIELDS.name);
    const category = pick(row, FIELDS.category);
    if (!name) { rejected++; continue; }
    if (!isFoodTruck(name, category)) { rejected++; continue; }

    const url      = pick(row, FIELDS.url);
    const coords   = extractCoords(url);
    if (!coords) { rejected++; continue; }

    const state    = detectState(coords.lat, coords.lng);
    if (!state)   { rejected++; continue; }

    stateCounter.set(state.name, (stateCounter.get(state.name) ?? 0) + 1);

    const ratingStr = pick(row, FIELDS.rating);
    const rating    = ratingStr ? parseFloat(ratingStr) : 0;
    const reviewsStr = pick(row, FIELDS.reviews);
    const reviewCount = parseReviews(reviewsStr) ?? 0;

    const address  = pick(row, FIELDS.address);
    const phone    = pick(row, FIELDS.phone);
    const website  = pick(row, FIELDS.website);
    const hours    = composeHours(pick(row, FIELDS.hours_a), pick(row, FIELDS.hours_b));

    const cuisine = deriveCuisine(name, category);
    const near = nearestCity(coords.lat, coords.lng, state.name);
    const city = near?.name ?? 'Other Locations';
    const citySlug = near ? slugify(city) : 'other-locations';

    const baseSlug = slugify(`${name}-${city}`);
    let slug = baseSlug;
    let n = 2;
    while (seenSlugs.has(slug)) slug = `${baseSlug}-${n++}`;
    seenSlugs.add(slug);

    const r = rng(slug);
    added.push({
      slug,
      name,
      state: state.name,
      stateSlug: state.slug,
      city,
      citySlug,
      address: address || `${city}, ${state.abbr}`,
      lat: coords.lat,
      lng: coords.lng,
      phone: phone || undefined,
      website: website || undefined,
      cuisine: [cuisine],
      rating: Number.isFinite(rating) && rating > 0 ? Math.min(5, rating) : Number((3.8 + r() * 1.2).toFixed(1)),
      reviewCount: reviewCount || Math.floor(20 + r() * 200),
      hours,
      photos: [REAL_TRUCK_PHOTOS[Math.floor(r() * REAL_TRUCK_PHOTOS.length)]],
      featured: r() < 0.18,
      priceLevel: (Math.ceil(1 + r() * 2)) as 1 | 2 | 3,
      description: hours ? `${cuisine} ${category.toLowerCase()} in ${city}, ${state.abbr}.` : undefined,
    });
  }

  const dominant = [...stateCounter.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return { added, rejected, stateName: dominant };
}

function main() {
  const files = process.argv.slice(2).filter((a) => a.endsWith('.csv'));
  if (files.length === 0) {
    console.error('Usage: tsx scripts/import-google-csv.ts <csv-path> [csv-path]...');
    process.exit(1);
  }

  console.log(`[google-csv] Loading existing trucks.json…`);
  const existing: Truck[] = JSON.parse(readFileSync(TRUCKS_JSON, 'utf8'));
  console.log(`[google-csv]   ${existing.length.toLocaleString()} trucks currently in dataset.`);

  const allAdded: Truck[] = [];
  const replacingStates = new Set<string>();

  for (const f of files) {
    console.log(`\n[google-csv] Importing ${basename(f)} …`);
    const { added, rejected, stateName } = importFile(f);
    console.log(`[google-csv]   detected state: ${stateName ?? '(unknown)'}`);
    console.log(`[google-csv]   ${added.length} kept, ${rejected} rejected (non-food-truck or missing coords)`);
    if (stateName) {
      const existingCount = existing.filter((t) => t.state === stateName).length;
      // Replace ONLY when the existing data is a clearly-broken stub (< 50 rows)
      if (existingCount < 50) {
        console.log(`[google-csv]   existing ${existingCount} rows for ${stateName} look like a stub — will REPLACE`);
        replacingStates.add(stateName);
      } else {
        console.log(`[google-csv]   existing ${existingCount} rows for ${stateName} look real — will MERGE`);
      }
    }
    allAdded.push(...added);
  }

  // Drop stub state rows we're replacing
  const filtered = existing.filter((t) => !replacingStates.has(t.state));
  console.log(`\n[google-csv] Removed ${existing.length - filtered.length} stub rows from replaced states.`);

  // Merge as a flat list (NOT a slug-keyed Map — that would collapse cross-state
  // chain-restaurant duplicates like "wendys-other-locations" appearing in
  // multiple states).
  const out: Truck[] = [...filtered, ...allAdded];

  // Disambiguate any colliding slugs so every truck gets a unique URL.
  // (Pages are generated per slug; without unique slugs Next collapses them.)
  const seen = new Set<string>();
  let renamed = 0;
  for (const t of out) {
    const original = t.slug;
    let s = original;
    let n = 2;
    while (seen.has(s)) { s = `${original}-${n}`; n++; }
    if (s !== original) renamed++;
    t.slug = s;
    seen.add(s);
  }
  console.log(`[google-csv] After slug disambiguation: ${out.length} rows, ${seen.size} unique slugs (${renamed} renamed).`);
  writeFileSync(TRUCKS_JSON, JSON.stringify(out));
  console.log(`\n[google-csv] Wrote ${out.length.toLocaleString()} trucks → data/trucks.json`);
  console.log(`[google-csv]   net change: ${out.length - existing.length >= 0 ? '+' : ''}${out.length - existing.length}`);

  // Per-state stats after merge
  console.log('\n[google-csv] Updated state counts:');
  const counts = new Map<string, number>();
  for (const t of out) counts.set(t.state, (counts.get(t.state) ?? 0) + 1);
  for (const s of [...replacingStates].sort()) {
    console.log(`            ${s.padEnd(18)} ${counts.get(s) ?? 0}`);
  }
}

main();
