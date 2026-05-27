/**
 * Outscraper Google Maps Scraper → Truck schema mapper.
 *
 * Reads the consolidated `data/outscraper-merged.json` (produced by
 * scripts/merge-outscraper.mjs from the raw xlsx exports) and applies
 * filtering + field mapping to produce clean Truck[] records.
 *
 * Filtering rules:
 *   - Drop CLOSED_PERMANENTLY and CLOSED_TEMPORARILY
 *   - Drop chains via lib/chain-blocklist.ts
 *   - Drop non-food-truck categories (manufacturers, festivals, breweries, …)
 *
 * Field mapping:
 *   - photo  → photos[0]  (real Google CDN URL; NO Unsplash fallback)
 *   - rating/reviews → real values, never fabricated
 *   - working_hours JSON → Hours
 *   - category + subtypes + name → Cuisine[] (via keyword matching)
 *   - verified=true → featured=true
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { STATE_BY_NAME, STATE_BY_ABBR } from './states';
import { slugify } from './slug';
import { isChainRestaurant } from './chain-blocklist';
import type { Truck, Cuisine, Hours } from './types';

/** Outscraper categories we never want — they're not food trucks. */
const DROP_CATEGORIES = new Set<string>([
  'Manufacturer',
  'Trailer manufacturer',
  'Food producer',
  'Festival',
  'Brewery',
  'attractions',
  'bars',
  'Event venue',
  "Farmers' market",
  'Truck stop',
  'Bakery',
  'Food and beverage consultant',
  'Shared-use commercial kitchen',
  'cafes',
  'coffee shops',
  'Catering food and drink supplier', // ambiguous — usually B2B
]);

/** Lowercased haystack matcher → Cuisine[]. Order = priority. */
const CUISINE_PATTERNS: Array<[RegExp, Cuisine[]]> = [
  [/\btaco|taqueria\b/, ['Tacos', 'Mexican']],
  [/\bmexican\b/, ['Mexican']],
  [/\btex[ -]?mex\b/, ['Tex-Mex']],
  [/\bbbq|barbecue|barbeque\b/, ['BBQ']],
  [/\bburger|hamburger\b/, ['Burgers', 'American']],
  [/\bhot ?dog\b/, ['American']],
  [/\bpizza|pizzeria\b/, ['Pizza', 'Italian']],
  [/\bitalian\b/, ['Italian']],
  [/\bsoul ?food\b/, ['Soul Food']],
  [/\bvegan|plant[ -]?based\b/, ['Vegan']],
  [/\bice ?cream|gelato|sorbet|frozen yogurt\b/, ['Desserts']],
  [/\bdessert|donut|doughnut|pastry|cupcake|cookie|cake\b/, ['Desserts']],
  [/\bcoffee|espresso|cafe\b/, ['Coffee']],
  [/\bbreakfast|brunch|pancake\b/, ['Breakfast']],
  [/\bsandwich|sub|deli\b/, ['Sandwiches']],
  [/\bthai\b/, ['Thai', 'Asian']],
  [/\bchinese\b/, ['Chinese', 'Asian']],
  [/\bkorean\b/, ['Korean', 'Asian']],
  [/\bjapanese|sushi|ramen|yakitori\b/, ['Japanese', 'Asian']],
  [/\bvietnamese|pho|banh ?mi\b/, ['Vietnamese', 'Asian']],
  [/\bindian|biryani|tandoor|curry\b/, ['Indian']],
  [/\bmediterranean|gyro|falafel|shawarma\b/, ['Mediterranean']],
  [/\bhalal\b/, ['Halal']],
  [/\bseafood|lobster|crab|shrimp|fish\b/, ['Seafood']],
  [/\bcaribbean|jamaican|puerto rican\b/, ['Caribbean']],
  [/\bcajun|creole\b/, ['Cajun']],
  [/\bhawaiian|poke|loco moco\b/, ['American']], // Hawaiian not in vocab; bucket as American
  [/\basian\b/, ['Asian']],
];

function deriveCuisine(row: OutscraperRow): Cuisine[] {
  const haystack = [row.category, row.subtypes, row.type, row.name]
    .filter((v): v is string => typeof v === 'string' && v.length > 0)
    .join(' ')
    .toLowerCase();
  const out: Cuisine[] = [];
  for (const [re, cuisines] of CUISINE_PATTERNS) {
    if (re.test(haystack)) {
      for (const c of cuisines) {
        if (!out.includes(c)) out.push(c);
        if (out.length >= 3) break;
      }
    }
    if (out.length >= 3) break;
  }
  if (out.length === 0) out.push('American');
  return out;
}

function parseHoursJson(raw: unknown): Hours | undefined {
  if (typeof raw !== 'string' || !raw || raw === 'None') return undefined;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== 'object') return undefined;
  const dayMap: Record<string, keyof Hours> = {
    Monday: 'mon',
    Tuesday: 'tue',
    Wednesday: 'wed',
    Thursday: 'thu',
    Friday: 'fri',
    Saturday: 'sat',
    Sunday: 'sun',
  };
  const out: Hours = {};
  for (const [day, slots] of Object.entries(parsed as Record<string, unknown>)) {
    const key = dayMap[day];
    if (!key) continue;
    let value: string | undefined;
    if (Array.isArray(slots)) {
      value = slots.map((s) => String(s).trim()).filter(Boolean).join(', ');
    } else if (typeof slots === 'string') {
      value = slots.trim();
    }
    if (value) out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function resolveState(raw: unknown): { name: string; slug: string; abbr: string } | undefined {
  if (typeof raw !== 'string' || !raw) return undefined;
  const r = raw.trim();
  const byName = STATE_BY_NAME[r.toLowerCase()];
  if (byName) return { name: byName.name, slug: byName.slug, abbr: byName.abbr };
  const byAbbr = STATE_BY_ABBR[r.toUpperCase()];
  if (byAbbr) return { name: byAbbr.name, slug: byAbbr.slug, abbr: byAbbr.abbr };
  return undefined;
}

/** Strict-ish shape of an Outscraper Google Maps result row. */
interface OutscraperRow {
  name?: string;
  category?: string;
  subtypes?: string;
  type?: string;
  phone?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  state_code?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviews?: number;
  photo?: string;
  website?: string;
  working_hours?: string;
  business_status?: string;
  place_id?: string;
  verified?: boolean | string;
  [key: string]: unknown;
}

export interface ImportStats {
  raw: number;
  kept: number;
  droppedClosed: number;
  droppedChain: number;
  droppedCategory: number;
  droppedNoState: number;
  droppedNoName: number;
  droppedDuplicate: number;
}

/**
 * Reads `data/outscraper-merged.json` (relative to project root) and returns
 * cleaned Truck records. Returns null if the source file doesn't exist.
 */
export function importOutscraperTrucks(dataDir: string): { trucks: Truck[]; stats: ImportStats } | null {
  const path = join(dataDir, 'outscraper-merged.json');
  if (!existsSync(path)) return null;

  const rows = JSON.parse(readFileSync(path, 'utf8')) as OutscraperRow[];
  const stats: ImportStats = {
    raw: rows.length,
    kept: 0,
    droppedClosed: 0,
    droppedChain: 0,
    droppedCategory: 0,
    droppedNoState: 0,
    droppedNoName: 0,
    droppedDuplicate: 0,
  };
  const seenSlugs = new Set<string>();
  const seenPlaceIds = new Set<string>();
  const trucks: Truck[] = [];

  for (const r of rows) {
    // Status filter
    const status = String(r.business_status ?? '');
    if (status === 'CLOSED_PERMANENTLY' || status === 'CLOSED_TEMPORARILY') {
      stats.droppedClosed++;
      continue;
    }

    // Name + chain filter
    const name = typeof r.name === 'string' ? r.name.trim() : '';
    if (!name) {
      stats.droppedNoName++;
      continue;
    }
    if (isChainRestaurant(name)) {
      stats.droppedChain++;
      continue;
    }

    // Category filter
    const cat = String(r.category ?? '');
    const sub = String(r.subtypes ?? '');
    if (DROP_CATEGORIES.has(cat) || DROP_CATEGORIES.has(sub)) {
      stats.droppedCategory++;
      continue;
    }

    // State
    const state = resolveState(r.state_code ?? r.state);
    if (!state) {
      stats.droppedNoState++;
      continue;
    }

    // Dedup by place_id (defensive — the merge script already deduped, but never trust)
    const placeId = typeof r.place_id === 'string' ? r.place_id : '';
    if (placeId) {
      if (seenPlaceIds.has(placeId)) {
        stats.droppedDuplicate++;
        continue;
      }
      seenPlaceIds.add(placeId);
    }

    const city = String(r.city ?? '').trim() || 'Other Locations';
    const baseSlug = slugify(`${name}-${city}`);
    let slug = baseSlug;
    let n = 2;
    while (seenSlugs.has(slug)) slug = `${baseSlug}-${n++}`;
    seenSlugs.add(slug);

    const photos: string[] = [];
    if (typeof r.photo === 'string' && r.photo.startsWith('http')) {
      photos.push(r.photo);
    }

    const phone =
      typeof r.phone === 'string' && r.phone.trim() && r.phone !== 'None'
        ? r.phone.trim()
        : undefined;
    const website =
      typeof r.website === 'string' && r.website.startsWith('http') ? r.website : undefined;
    const address =
      typeof r.address === 'string' && r.address.trim()
        ? r.address.trim()
        : `${city}, ${state.abbr}`;
    const lat = typeof r.latitude === 'number' && Number.isFinite(r.latitude) ? r.latitude : undefined;
    const lng = typeof r.longitude === 'number' && Number.isFinite(r.longitude) ? r.longitude : undefined;
    const rating =
      typeof r.rating === 'number' && Number.isFinite(r.rating) && r.rating > 0 ? r.rating : 0;
    const reviewCount =
      typeof r.reviews === 'number' && Number.isFinite(r.reviews) ? r.reviews : 0;
    const verified = r.verified === true || r.verified === 'TRUE' || r.verified === 'True';

    trucks.push({
      slug,
      name,
      state: state.name,
      stateSlug: state.slug,
      city,
      citySlug: slugify(city),
      address,
      lat,
      lng,
      phone,
      website,
      cuisine: deriveCuisine(r),
      rating,
      reviewCount,
      hours: parseHoursJson(r.working_hours),
      photos,
      placeId: placeId || undefined,
      featured: verified,
      priceLevel: undefined,
      description: undefined,
    });
    stats.kept++;
  }

  return { trucks, stats };
}
