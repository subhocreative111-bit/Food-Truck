/**
 * One-shot: merge salvageable real-data trucks from data/trucks.json.backup-seed
 * back into the new Outscraper-derived data/trucks.json.
 *
 * Currently scoped to Rhode Island, which had real Google Maps data in the
 * legacy dataset. Nevada is intentionally skipped — its hours field is
 * malformed (addresses stored as day values), so the data is not worth
 * preserving.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const NEW = './data/trucks.json';
const BACKUP = './data/trucks.json.backup-seed';

if (!existsSync(BACKUP)) {
  console.log('[merge-backup-states] No backup file found — skipping.');
  process.exit(0);
}

const fresh = JSON.parse(readFileSync(NEW, 'utf8'));
const backup = JSON.parse(readFileSync(BACKUP, 'utf8'));

const STATES_TO_MERGE = new Set(['Rhode Island']);

// Clean hours strings that have weird encoding artifacts
function cleanHours(h) {
  if (!h || typeof h !== 'object') return undefined;
  const out = {};
  for (const [k, v] of Object.entries(h)) {
    if (typeof v !== 'string') continue;
    // Drop entries that contain digits next to street-name words (address leakage)
    if (/\d+\s+[A-Za-z]+\s+(?:St|Ave|Rd|Dr|Blvd|Ln|Way)/i.test(v)) continue;
    // Fix the Â· artifact from utf-8 mis-decoding
    const cleaned = v.replace(/Â·/g, '·').replace(/â¯/g, ' ').trim();
    if (cleaned && cleaned !== '·') out[k] = cleaned;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

// Existing slugs in fresh dataset
const freshSlugs = new Set(fresh.map((t) => t.slug));

let added = 0;
let skippedDupe = 0;
for (const t of backup) {
  if (!STATES_TO_MERGE.has(t.state)) continue;
  // Require real contact info — drop seed-flavoured entries
  if (!t.phone && !t.website) continue;
  if (freshSlugs.has(t.slug)) {
    skippedDupe++;
    continue;
  }
  // Wipe the Unsplash stock photos — they're fake
  const photos =
    Array.isArray(t.photos) && t.photos.every((p) => !/images\.unsplash\.com/.test(p))
      ? t.photos
      : [];
  // Strip fake-looking ratings? They came from the legacy scrape so they're real,
  // keep them as-is.
  fresh.push({
    ...t,
    photos,
    hours: cleanHours(t.hours),
  });
  freshSlugs.add(t.slug);
  added++;
}

console.log(`Added ${added} salvaged trucks (Rhode Island).`);
console.log(`Skipped ${skippedDupe} duplicate slugs.`);
console.log(`New total: ${fresh.length}`);

writeFileSync(NEW, JSON.stringify(fresh));
console.log(`Wrote ${NEW}`);
