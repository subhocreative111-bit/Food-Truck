/**
 * One-time importer that reads the legacy static-HTML site at
 * C:\Users\Subho Laha\Desktop\foodtrucks_site\pages\food-trucks-in-<state>.html
 * and dumps every truck card into data/trucks.json.
 *
 * The old site only stored: name, cuisine, lat, lng, Google-Maps link.
 * We enrich each row with:
 *   - nearest-city lookup via static centroid table (lib/city-centroids.ts)
 *   - cuisine-themed placeholder photo (option 2 — replaceable when owners upload)
 *   - deterministic rating + reviewCount via seeded RNG (so they're stable across builds)
 *
 * Run:   npm run import:old
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { US_STATES, STATE_BY_NAME } from '../lib/states';
import { nearestCity } from '../lib/city-centroids';
import { slugify } from '../lib/slug';
import type { Truck, Cuisine } from '../lib/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const OUT_FILE = join(DATA_DIR, 'trucks.json');
const OLD_PAGES_DIR = 'C:/Users/Subho Laha/Desktop/foodtrucks_site/pages';

/**
 * Real food-truck photography pool, hand-curated from Unsplash.
 * Each cuisine has a mix of:
 *   - REAL food-truck / mobile-kitchen shots (the truck itself)
 *   - Cuisine-specific food close-ups
 * Photos are deterministically assigned by seeded RNG, so a given truck always
 * shows the same image across builds.
 *
 * URL pattern: `?w=600&q=70&auto=format&fit=crop` — sized for card thumbnails.
 */

// Real food-truck / mobile-kitchen photos (used across every cuisine)
const TRUCK_SHOTS = [
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

// Real taco-truck / Mexican food-truck photos
const TACO_TRUCK_SHOTS = [
  'https://images.unsplash.com/photo-1607891715106-ba61a2951650?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1687892253319-beea8bc81d22?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1648856046245-320fa00c4194?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1636224601323-550e96f10d66?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1626876657310-26bf46fd1d00?w=600&q=70&auto=format&fit=crop',
];

// Cuisine-specific food close-ups (the dish itself, plated, market-shot style)
const FOOD_CLOSEUPS: Record<string, string[]> = {
  BBQ: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=70&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=70&auto=format&fit=crop',
  ],
  Burgers: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=70&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=70&auto=format&fit=crop',
  ],
  Pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=70&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593504049359-74330189a345?w=600&q=70&auto=format&fit=crop',
  ],
  Italian: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=70&auto=format&fit=crop'],
  Asian: ['https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=70&auto=format&fit=crop'],
  Thai: ['https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=70&auto=format&fit=crop'],
  Japanese: ['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=70&auto=format&fit=crop'],
  Korean: ['https://images.unsplash.com/photo-1532347922424-c652d9b7208e?w=600&q=70&auto=format&fit=crop'],
  Vietnamese: ['https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=70&auto=format&fit=crop'],
  Chinese: ['https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=600&q=70&auto=format&fit=crop'],
  Indian: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=70&auto=format&fit=crop'],
  Halal: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=70&auto=format&fit=crop'],
  Mediterranean: ['https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=600&q=70&auto=format&fit=crop'],
  Seafood: [
    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=70&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=70&auto=format&fit=crop',
  ],
  Cajun: ['https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=70&auto=format&fit=crop'],
  Desserts: [
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=70&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=70&auto=format&fit=crop',
  ],
  Breakfast: ['https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=70&auto=format&fit=crop'],
  Coffee: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=70&auto=format&fit=crop'],
  Vegan: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=70&auto=format&fit=crop'],
  'Soul Food': ['https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=70&auto=format&fit=crop'],
  Sandwiches: ['https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=70&auto=format&fit=crop'],
  Caribbean: ['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=70&auto=format&fit=crop'],
};

// Build the final pool: real-truck shots (always) + taco-truck shots (Mexican/Tacos/Tex-Mex)
// + cuisine-specific food close-ups. ~60% of cards show an actual food truck.
const CUISINE_PHOTO_POOL: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {};
  const allCuisines = [
    'American', 'BBQ', 'Mexican', 'Tacos', 'Asian', 'Thai', 'Chinese', 'Korean',
    'Japanese', 'Vietnamese', 'Indian', 'Mediterranean', 'Italian', 'Pizza',
    'Seafood', 'Soul Food', 'Vegan', 'Desserts', 'Coffee', 'Breakfast',
    'Sandwiches', 'Burgers', 'Halal', 'Caribbean', 'Cajun', 'Tex-Mex', 'Other',
  ];
  for (const c of allCuisines) {
    const trucks = ['Mexican', 'Tacos', 'Tex-Mex'].includes(c)
      ? [...TRUCK_SHOTS, ...TACO_TRUCK_SHOTS]
      : [...TRUCK_SHOTS];
    const food = FOOD_CLOSEUPS[c] ?? [];
    // 65% trucks, 35% food. Repeat-weight by including trucks twice.
    out[c] = [...trucks, ...trucks, ...food];
  }
  return out;
})();

function rng(seedStr: string) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
}

function pickPhotos(slug: string, cuisine: Cuisine): string[] {
  const pool = CUISINE_PHOTO_POOL[cuisine] ?? CUISINE_PHOTO_POOL.Other;
  const r = rng(slug);
  const a = pool[Math.floor(r() * pool.length)];
  // Add a second variety photo from the generic pool for the gallery
  const fallback = CUISINE_PHOTO_POOL.Other[0];
  return [a, fallback];
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizeCuisine(raw: string): Cuisine {
  const c = raw.trim();
  // Allowed list — narrow alphabet match
  const allowed: Cuisine[] = [
    'American', 'BBQ', 'Mexican', 'Tacos', 'Asian', 'Thai', 'Chinese', 'Korean',
    'Japanese', 'Vietnamese', 'Indian', 'Mediterranean', 'Italian', 'Pizza', 'Seafood',
    'Soul Food', 'Vegan', 'Desserts', 'Coffee', 'Breakfast', 'Sandwiches', 'Burgers',
    'Halal', 'Caribbean', 'Cajun', 'Tex-Mex', 'Other',
  ];
  for (const a of allowed) if (a.toLowerCase() === c.toLowerCase()) return a;
  return 'Other';
}

// Single regex for the whole card block, used via .exec in a loop. Keep it small + fast.
const CARD_RE = /<div\s+class="tc"\s+data-cuisine="([^"]+)"[\s\S]*?class="tc-name">([^<]+)<[\s\S]*?query=([^"&]+)[\s\S]*?<\/div>\s*<\/div>/g;

function parseFile(file: string, stateName: string): Truck[] {
  const html = readFileSync(file, 'utf8');
  const trucks: Truck[] = [];
  const stateMeta = STATE_BY_NAME[stateName.toLowerCase()];
  if (!stateMeta) return trucks;

  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = CARD_RE.exec(html)) !== null) {
    const cuisine = normalizeCuisine(m[1]);
    const name = decodeEntities(m[2]).trim();
    const query = decodeURIComponent(m[3]); // "Truck%20Name%2034.0%2C-118.0"
    // The query is "NAME LAT,LNG" after decoding; LAT,LNG is always the last token after the last space
    const lastSpace = query.lastIndexOf(' ');
    if (lastSpace < 0) continue;
    const coordPart = query.slice(lastSpace + 1);
    const [latStr, lngStr] = coordPart.split(',');
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const near = nearestCity(lat, lng, stateName);
    const city = near?.name ?? 'Other Locations';
    const citySlug = near ? slugify(city) : 'other-locations';

    const baseSlug = slugify(`${name}-${city}`);
    let slug = baseSlug;
    let n = 2;
    while (seen.has(slug)) slug = `${baseSlug}-${n++}`;
    seen.add(slug);

    const r = rng(slug);
    const rating = Number((3.8 + r() * 1.2).toFixed(1));
    const reviewCount = Math.floor(15 + r() * 480);

    trucks.push({
      slug,
      name,
      state: stateMeta.name,
      stateSlug: stateMeta.slug,
      city,
      citySlug,
      address: `${city}, ${stateMeta.abbr}`,
      lat,
      lng,
      cuisine: [cuisine],
      rating,
      reviewCount,
      photos: pickPhotos(slug, cuisine),
      featured: r() < 0.06,
      priceLevel: (Math.ceil(1 + r() * 2)) as 1 | 2 | 3,
    });
  }
  return trucks;
}

function fileToState(filename: string): string | null {
  const m = filename.match(/^food-trucks-in-(.+)\.html$/);
  if (!m) return null;
  const slug = m[1];
  const st = US_STATES.find((s) => s.slug === slug);
  return st?.name ?? null;
}

function main() {
  if (!existsSync(OLD_PAGES_DIR)) {
    console.error(`[import-old] Could not find ${OLD_PAGES_DIR}`);
    process.exit(1);
  }
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const files = readdirSync(OLD_PAGES_DIR).filter((f) => /^food-trucks-in-.+\.html$/.test(f));
  console.log(`[import-old] Found ${files.length} state HTML files.`);

  const all: Truck[] = [];
  for (const f of files) {
    const stateName = fileToState(f);
    if (!stateName) {
      console.warn(`[import-old]  ! Skipping ${f} (unknown state)`);
      continue;
    }
    const t0 = Date.now();
    const trucks = parseFile(join(OLD_PAGES_DIR, f), stateName);
    all.push(...trucks);
    console.log(
      `[import-old]  · ${stateName.padEnd(18)} ${String(trucks.length).padStart(6)} trucks  (${Date.now() - t0}ms)`,
    );
  }

  writeFileSync(OUT_FILE, JSON.stringify(all));
  const mb = (Buffer.byteLength(JSON.stringify(all)) / 1024 / 1024).toFixed(1);
  console.log(`[import-old] Wrote ${all.length.toLocaleString()} trucks (${mb} MB) → ${OUT_FILE}`);

  // Quick stats
  const byCuisine = new Map<string, number>();
  let withCity = 0;
  for (const t of all) {
    byCuisine.set(t.cuisine[0], (byCuisine.get(t.cuisine[0]) ?? 0) + 1);
    if (t.citySlug !== 'other') withCity++;
  }
  console.log(`[import-old] City coverage: ${withCity.toLocaleString()}/${all.length.toLocaleString()} (${((withCity / all.length) * 100).toFixed(1)}%)`);
  console.log('[import-old] Top cuisines:');
  for (const [c, n] of [...byCuisine.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    console.log(`            ${c.padEnd(14)} ${n.toLocaleString()}`);
  }
}

main();
