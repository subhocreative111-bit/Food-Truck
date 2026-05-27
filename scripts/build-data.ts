/**
 * Build /data/trucks.json from any .xlsx files in /data/.
 * Falls back to a generated seed (covering all 50 states) when no Excel files exist,
 * so the site is buildable from a clean clone.
 *
 * Excel sheet columns expected (case-insensitive, any subset):
 *   name | title | business_name
 *   state | state_name
 *   city
 *   address | full_address
 *   phone
 *   website | site
 *   rating
 *   reviews | review_count | reviews_count
 *   lat | latitude
 *   lng | lon | longitude
 *   cuisine | category | categories | type
 *   hours | working_hours
 *   photos | photo | image | images | thumbnail
 *   place_id | google_place_id
 *   featured
 *   price_level
 *   description
 */
import * as XLSX from 'xlsx';
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { US_STATES, STATE_BY_NAME, STATE_BY_ABBR } from '../lib/states';
import { slugify } from '../lib/slug';
import { importOutscraperTrucks } from '../lib/outscraper-import';
import type { Truck, Cuisine, Hours } from '../lib/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const OUT_FILE = join(DATA_DIR, 'trucks.json');

const CUISINE_VOCAB: Cuisine[] = [
  'American', 'BBQ', 'Mexican', 'Tacos', 'Asian', 'Thai', 'Chinese', 'Korean',
  'Japanese', 'Vietnamese', 'Indian', 'Mediterranean', 'Italian', 'Pizza', 'Seafood',
  'Soul Food', 'Vegan', 'Desserts', 'Coffee', 'Breakfast', 'Sandwiches', 'Burgers',
  'Halal', 'Caribbean', 'Cajun', 'Tex-Mex',
];

const PHOTO_POOL = [
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=70&auto=format&fit=crop',
];

function pickKey(row: Record<string, unknown>, ...keys: string[]): string | undefined {
  const lower: Record<string, string> = {};
  for (const k of Object.keys(row)) lower[k.toLowerCase().trim()] = k;
  for (const k of keys) {
    const realKey = lower[k.toLowerCase()];
    if (realKey != null) {
      const v = row[realKey];
      if (v == null) continue;
      const s = String(v).trim();
      if (s.length > 0) return s;
    }
  }
  return undefined;
}

function pickNumber(row: Record<string, unknown>, ...keys: string[]): number | undefined {
  const v = pickKey(row, ...keys);
  if (v == null) return undefined;
  const n = Number(String(v).replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : undefined;
}

function parseCuisines(raw: string | undefined): Cuisine[] {
  if (!raw) return ['American'];
  const tokens = raw.split(/[,;|/]/).map((t) => t.trim()).filter(Boolean);
  const matched: Cuisine[] = [];
  for (const tok of tokens) {
    const lower = tok.toLowerCase();
    for (const c of CUISINE_VOCAB) {
      if (lower.includes(c.toLowerCase())) {
        if (!matched.includes(c)) matched.push(c);
      }
    }
  }
  if (matched.length === 0) matched.push('American');
  return matched.slice(0, 4);
}

function parseHours(raw: string | undefined): Hours | undefined {
  if (!raw) return undefined;
  // Simple parser: split on common separators, map day prefixes
  const out: Hours = {};
  const dayMap: Record<string, keyof Hours> = {
    mon: 'mon', tue: 'tue', wed: 'wed', thu: 'thu', fri: 'fri', sat: 'sat', sun: 'sun',
  };
  for (const part of raw.split(/[;,]|\s{2,}/)) {
    const m = part.match(/^(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*[:\-]?\s*(.+)$/i);
    if (m) {
      const day = dayMap[m[1].toLowerCase()];
      if (day) out[day] = m[2].trim();
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function resolveState(raw: string | undefined): { name: string; slug: string; abbr: string } | undefined {
  if (!raw) return undefined;
  const r = raw.trim();
  const byName = STATE_BY_NAME[r.toLowerCase()];
  if (byName) return { name: byName.name, slug: byName.slug, abbr: byName.abbr };
  const byAbbr = STATE_BY_ABBR[r.toUpperCase()];
  if (byAbbr) return { name: byAbbr.name, slug: byAbbr.slug, abbr: byAbbr.abbr };
  return undefined;
}

function rng(seedStr: string) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
}

function rowToTruck(row: Record<string, unknown>, seen: Set<string>): Truck | null {
  const name = pickKey(row, 'name', 'title', 'business_name');
  const rawState = pickKey(row, 'state', 'state_name', 'state_code');
  const city = pickKey(row, 'city', 'town');
  if (!name || !rawState || !city) return null;
  const state = resolveState(rawState);
  if (!state) return null;

  const placeId = pickKey(row, 'place_id', 'google_place_id');
  const baseSlug = slugify(`${name}-${city}`);
  let slug = baseSlug;
  let n = 2;
  while (seen.has(slug)) slug = `${baseSlug}-${n++}`;
  seen.add(slug);

  const photosRaw = pickKey(row, 'photos', 'photo', 'image', 'images', 'thumbnail');
  const photos = photosRaw
    ? photosRaw.split(/[,;|]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const r = rng(slug);
  if (photos.length === 0) {
    const a = Math.floor(r() * PHOTO_POOL.length);
    const b = (a + 1 + Math.floor(r() * (PHOTO_POOL.length - 1))) % PHOTO_POOL.length;
    const c = (a + 2 + Math.floor(r() * (PHOTO_POOL.length - 2))) % PHOTO_POOL.length;
    photos.push(PHOTO_POOL[a], PHOTO_POOL[b], PHOTO_POOL[c]);
  }

  const rating = pickNumber(row, 'rating', 'stars') ?? Number((3.8 + r() * 1.2).toFixed(1));
  const reviewCount =
    pickNumber(row, 'reviews', 'review_count', 'reviews_count') ?? Math.floor(15 + r() * 600);

  return {
    slug,
    name,
    state: state.name,
    stateSlug: state.slug,
    city,
    citySlug: slugify(city),
    address: pickKey(row, 'address', 'full_address', 'street') ?? `${city}, ${state.abbr}`,
    lat: pickNumber(row, 'lat', 'latitude'),
    lng: pickNumber(row, 'lng', 'lon', 'longitude'),
    phone: pickKey(row, 'phone', 'phone_number', 'tel'),
    website: pickKey(row, 'website', 'site', 'url'),
    cuisine: parseCuisines(pickKey(row, 'cuisine', 'category', 'categories', 'type')),
    rating: Math.min(5, Math.max(0, rating)),
    reviewCount,
    hours: parseHours(pickKey(row, 'hours', 'working_hours', 'opening_hours')),
    photos,
    placeId,
    featured: ((): boolean => {
      const f = pickKey(row, 'featured', 'premium');
      if (!f) return r() < 0.12;
      return ['1', 'true', 'yes', 'y', 'featured'].includes(f.toLowerCase());
    })(),
    priceLevel: ((): 1 | 2 | 3 | undefined => {
      const p = pickNumber(row, 'price_level', 'price');
      if (p == null) return Math.ceil(1 + r() * 2) as 1 | 2 | 3;
      return Math.min(3, Math.max(1, Math.round(p))) as 1 | 2 | 3;
    })(),
    description: pickKey(row, 'description', 'about'),
  };
}

function readExcelFiles(): Truck[] {
  if (!existsSync(DATA_DIR)) return [];
  const files = readdirSync(DATA_DIR).filter((f) => /\.(xlsx|xls)$/i.test(f));
  if (files.length === 0) return [];
  console.log(`[build-data] Found ${files.length} Excel file(s).`);
  const seen = new Set<string>();
  const placeIds = new Set<string>();
  const all: Truck[] = [];
  for (const file of files) {
    const wb = XLSX.read(readFileSync(join(DATA_DIR, file)));
    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
      for (const row of rows) {
        const t = rowToTruck(row, seen);
        if (!t) continue;
        if (t.placeId && placeIds.has(t.placeId)) continue;
        if (t.placeId) placeIds.add(t.placeId);
        all.push(t);
      }
    }
    console.log(`[build-data]  · ${file} → running total ${all.length}`);
  }
  return all;
}

/* ------------------------------- SEED FALLBACK ------------------------------- */

const CITY_BANK: Record<string, string[]> = {
  Alabama: ['Birmingham', 'Huntsville', 'Mobile', 'Montgomery', 'Tuscaloosa'],
  Alaska: ['Anchorage', 'Fairbanks', 'Juneau'],
  Arizona: ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler', 'Tempe'],
  Arkansas: ['Little Rock', 'Fayetteville', 'Bentonville', 'Hot Springs'],
  California: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland', 'San Jose', 'Long Beach', 'Fresno'],
  Colorado: ['Denver', 'Boulder', 'Colorado Springs', 'Fort Collins', 'Aspen'],
  Connecticut: ['Hartford', 'New Haven', 'Stamford', 'Bridgeport'],
  Delaware: ['Wilmington', 'Dover', 'Newark'],
  Florida: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'St. Petersburg', 'Tallahassee', 'Fort Lauderdale'],
  Georgia: ['Atlanta', 'Savannah', 'Augusta', 'Athens', 'Macon'],
  Hawaii: ['Honolulu', 'Hilo', 'Lahaina', 'Kailua'],
  Idaho: ['Boise', 'Idaho Falls', 'Coeur d Alene'],
  Illinois: ['Chicago', 'Springfield', 'Naperville', 'Rockford', 'Evanston'],
  Indiana: ['Indianapolis', 'Fort Wayne', 'Bloomington', 'South Bend'],
  Iowa: ['Des Moines', 'Cedar Rapids', 'Iowa City', 'Davenport'],
  Kansas: ['Wichita', 'Kansas City', 'Topeka', 'Overland Park'],
  Kentucky: ['Louisville', 'Lexington', 'Bowling Green', 'Frankfort'],
  Louisiana: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'],
  Maine: ['Portland', 'Bangor', 'Augusta'],
  Maryland: ['Baltimore', 'Annapolis', 'Frederick', 'Silver Spring'],
  Massachusetts: ['Boston', 'Cambridge', 'Worcester', 'Salem', 'Springfield'],
  Michigan: ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing', 'Kalamazoo'],
  Minnesota: ['Minneapolis', 'Saint Paul', 'Duluth', 'Rochester'],
  Mississippi: ['Jackson', 'Gulfport', 'Biloxi', 'Hattiesburg'],
  Missouri: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia'],
  Montana: ['Billings', 'Missoula', 'Bozeman', 'Helena'],
  Nebraska: ['Omaha', 'Lincoln', 'Bellevue'],
  Nevada: ['Las Vegas', 'Reno', 'Henderson', 'Carson City'],
  'New Hampshire': ['Manchester', 'Concord', 'Portsmouth'],
  'New Jersey': ['Newark', 'Jersey City', 'Hoboken', 'Princeton', 'Trenton'],
  'New Mexico': ['Albuquerque', 'Santa Fe', 'Las Cruces', 'Taos'],
  'New York': ['New York City', 'Brooklyn', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
  'North Carolina': ['Charlotte', 'Raleigh', 'Asheville', 'Durham', 'Greensboro'],
  'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks'],
  Ohio: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
  Oklahoma: ['Oklahoma City', 'Tulsa', 'Norman', 'Edmond'],
  Oregon: ['Portland', 'Eugene', 'Salem', 'Bend'],
  Pennsylvania: ['Philadelphia', 'Pittsburgh', 'Harrisburg', 'Lancaster', 'Allentown'],
  'Rhode Island': ['Providence', 'Newport', 'Warwick'],
  'South Carolina': ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach'],
  'South Dakota': ['Sioux Falls', 'Rapid City', 'Pierre'],
  Tennessee: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Franklin'],
  Texas: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth', 'El Paso', 'Plano'],
  Utah: ['Salt Lake City', 'Provo', 'Park City', 'Ogden'],
  Vermont: ['Burlington', 'Montpelier', 'Stowe'],
  Virginia: ['Richmond', 'Virginia Beach', 'Norfolk', 'Arlington', 'Charlottesville'],
  Washington: ['Seattle', 'Spokane', 'Tacoma', 'Bellevue', 'Olympia'],
  'West Virginia': ['Charleston', 'Huntington', 'Morgantown'],
  Wisconsin: ['Milwaukee', 'Madison', 'Green Bay', 'Eau Claire'],
  Wyoming: ['Cheyenne', 'Jackson', 'Casper'],
};

const NAME_PARTS_A = [
  'Smokin', 'Wild', 'Holy', 'Big', 'Little', 'Rolling', 'Hot', 'Sunny', 'King', 'Queen',
  'Atomic', 'Lone Star', 'Velvet', 'Iron', 'Brick', 'Burnt', 'Crispy', 'Magnolia', 'Cosmic', 'Salt',
  'Coastal', 'Bayou', 'Mesa', 'Pacific', 'Heartland', 'Ember', 'Saffron', 'Mama', 'Papa', 'Uncle',
];
const NAME_PARTS_B = [
  'Joe', 'Mary', 'Dragon', 'Pig', 'Buffalo', 'Lobster', 'Taco', 'Pho', 'Curry', 'Bao',
  'BBQ', 'Burger', 'Cone', 'Pie', 'Bowl', 'Fork', 'Whisk', 'Smoke', 'Spice', 'Kettle',
  'Goat', 'Crab', 'Skillet', 'Rooster', 'Lion', 'Truck', 'Cart', 'Wagon', 'Shack', 'Stand',
];
const NAME_SUFFIX = ['& Co', 'Kitchen', 'Bros', 'Sisters', 'Express', 'Republic', 'Society', '', '', ''];

function seed(): Truck[] {
  const seen = new Set<string>();
  const all: Truck[] = [];
  for (const s of US_STATES) {
    const cities = CITY_BANK[s.name] ?? [s.name];
    const r = rng(s.slug);
    // Density: ~14 per state, more for big states
    const big = ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania'].includes(s.name);
    const target = big ? 22 : cities.length >= 5 ? 16 : 12;
    for (let i = 0; i < target; i++) {
      const a = NAME_PARTS_A[Math.floor(r() * NAME_PARTS_A.length)];
      const b = NAME_PARTS_B[Math.floor(r() * NAME_PARTS_B.length)];
      const suf = NAME_SUFFIX[Math.floor(r() * NAME_SUFFIX.length)];
      const name = `${a} ${b}${suf ? ' ' + suf : ''}`.replace(/\s+/g, ' ').trim();
      const city = cities[Math.floor(r() * cities.length)];
      const cuisinePick: Cuisine[] = [];
      const primary = CUISINE_VOCAB[Math.floor(r() * CUISINE_VOCAB.length)];
      cuisinePick.push(primary);
      if (r() > 0.55) {
        const second = CUISINE_VOCAB[Math.floor(r() * CUISINE_VOCAB.length)];
        if (second !== primary) cuisinePick.push(second);
      }
      const photos = [
        PHOTO_POOL[Math.floor(r() * PHOTO_POOL.length)],
        PHOTO_POOL[Math.floor(r() * PHOTO_POOL.length)],
        PHOTO_POOL[Math.floor(r() * PHOTO_POOL.length)],
      ];
      const baseSlug = slugify(`${name}-${city}`);
      let slug = baseSlug;
      let nn = 2;
      while (seen.has(slug)) slug = `${baseSlug}-${nn++}`;
      seen.add(slug);

      all.push({
        slug,
        name,
        state: s.name,
        stateSlug: s.slug,
        city,
        citySlug: slugify(city),
        address: `${100 + Math.floor(r() * 9899)} ${['Main', 'Oak', 'Pine', 'Market', 'Broadway', 'Elm', 'Maple'][Math.floor(r() * 7)]} St, ${city}, ${s.abbr}`,
        phone: `(${200 + Math.floor(r() * 700)}) ${100 + Math.floor(r() * 899)}-${1000 + Math.floor(r() * 8999)}`,
        website: r() > 0.5 ? `https://${slug}.com` : undefined,
        cuisine: cuisinePick,
        rating: Number((3.8 + r() * 1.2).toFixed(1)),
        reviewCount: Math.floor(15 + r() * 600),
        hours: {
          mon: r() > 0.2 ? '11:00 AM – 9:00 PM' : 'Closed',
          tue: '11:00 AM – 9:00 PM',
          wed: '11:00 AM – 9:00 PM',
          thu: '11:00 AM – 10:00 PM',
          fri: '11:00 AM – 11:00 PM',
          sat: '12:00 PM – 11:00 PM',
          sun: r() > 0.4 ? '12:00 PM – 8:00 PM' : 'Closed',
        },
        photos,
        featured: r() < 0.18,
        priceLevel: (Math.ceil(1 + r() * 2)) as 1 | 2 | 3,
        description: `Local favorite slinging ${cuisinePick.join(' & ').toLowerCase()} in ${city}.`,
      });
    }
  }
  return all;
}

/* ---------------------------------- main ---------------------------------- */

function main() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  // The committed trucks.json is the source of truth — it ships with the repo
  // so Hostinger builds without needing the (gitignored) outscraper-merged.json
  // or xlsx source files. Only regenerate when trucks.json is missing/empty
  // (fresh clone before any data import).
  if (existsSync(OUT_FILE)) {
    try {
      const existing = JSON.parse(readFileSync(OUT_FILE, 'utf8')) as unknown[];
      if (Array.isArray(existing) && existing.length > 0) {
        console.log(`[build-data] trucks.json already populated (${existing.length} trucks) — skipping regeneration.`);
        return;
      }
    } catch {
      // fall through to regenerate
    }
  }

  // Regeneration path (only runs when trucks.json is missing/corrupt):
  // 1. Prefer outscraper-merged.json if available (production data source)
  const outscraperResult = importOutscraperTrucks(DATA_DIR);
  if (outscraperResult) {
    const { trucks, stats } = outscraperResult;
    console.log('[build-data] Importing from outscraper-merged.json');
    console.log(`  raw rows:           ${stats.raw}`);
    console.log(`  kept:               ${stats.kept}`);
    console.log(`  dropped closed:     ${stats.droppedClosed}`);
    console.log(`  dropped chains:     ${stats.droppedChain}`);
    console.log(`  dropped industrial: ${stats.droppedCategory}`);
    console.log(`  dropped no state:   ${stats.droppedNoState}`);
    console.log(`  dropped no name:    ${stats.droppedNoName}`);
    console.log(`  dropped duplicate:  ${stats.droppedDuplicate}`);
    writeFileSync(OUT_FILE, JSON.stringify(trucks));
    console.log(`[build-data] Wrote ${trucks.length} trucks → ${OUT_FILE}`);
    return;
  }

  // 2. Fall back to any xlsx files in /data/
  let trucks = readExcelFiles();
  if (trucks.length === 0) {
    // 3. Last resort: generate a seed dataset so fresh clones still build
    console.log('[build-data] No data sources found — generating seed dataset.');
    trucks = seed();
  }
  writeFileSync(OUT_FILE, JSON.stringify(trucks));
  console.log(`[build-data] Wrote ${trucks.length} trucks → ${OUT_FILE}`);
}

main();
