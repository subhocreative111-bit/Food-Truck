/**
 * Builds /public/search-index.json — a slimmed truck list (slug, name, city,
 * state, cuisine, rating, photo) that the search page fetches lazily on the
 * client. Cuts ~38 MB of inline RSC payload out of the search HTML.
 *
 * Compaction tricks vs the raw 40 MB trucks.json:
 *   - Deduplicate photo URLs into a separate `pp` (photo pool) array, store
 *     indices in each row instead of full strings. Saves ~5 MB.
 *   - Deduplicate state + cuisine strings the same way.
 *   - Drop fields not used in the search UI (address, hours, place_id, etc.).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Truck } from '../lib/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'data', 'trucks.json');
const PUBLIC_DIR = join(ROOT, 'public');
const OUT = join(PUBLIC_DIR, 'search-index.json');

function dedupe<T extends string>(values: T[]): { pool: T[]; toIdx: Map<T, number> } {
  const pool: T[] = [];
  const toIdx = new Map<T, number>();
  for (const v of values) {
    if (!toIdx.has(v)) {
      toIdx.set(v, pool.length);
      pool.push(v);
    }
  }
  return { pool, toIdx };
}

function main() {
  if (!existsSync(SRC)) {
    console.warn('[search-index] data/trucks.json missing — skipping.');
    return;
  }
  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

  const trucks = JSON.parse(readFileSync(SRC, 'utf8')) as Truck[];

  const photos = dedupe(trucks.map((t) => t.photos?.[0] ?? ''));
  const states = dedupe(trucks.map((t) => t.state));
  const stateSlugs = dedupe(trucks.map((t) => t.stateSlug));
  const cuisines = dedupe(trucks.map((t) => t.cuisine[0] ?? 'Other'));

  const rows = trucks.map((t) => [
    t.slug,
    t.name,
    t.city,
    t.citySlug,
    stateSlugs.toIdx.get(t.stateSlug),
    states.toIdx.get(t.state),
    cuisines.toIdx.get(t.cuisine[0] ?? 'Other'),
    photos.toIdx.get(t.photos?.[0] ?? ''),
    Math.round(t.rating * 10), // store as integer × 10
    t.reviewCount,
    t.featured ? 1 : 0,
    t.phone || t.website || t.hours || (t.description && t.description.length > 40) ? 1 : 0,
    t.lat != null ? Math.round(t.lat * 1e4) : 0,
    t.lng != null ? Math.round(t.lng * 1e4) : 0,
  ]);

  const payload = {
    v: 2,
    p: photos.pool,
    s: states.pool,
    ss: stateSlugs.pool,
    cu: cuisines.pool,
    r: rows,
  };

  writeFileSync(OUT, JSON.stringify(payload));
  const mb = (Buffer.byteLength(JSON.stringify(payload)) / 1024 / 1024).toFixed(1);
  console.log(`[search-index] Wrote ${rows.length.toLocaleString()} rows (${mb} MB) → ${OUT}`);
  console.log(`[search-index]   photo pool: ${photos.pool.length}, state pool: ${states.pool.length}, cuisine pool: ${cuisines.pool.length}`);
}

main();
