/**
 * One-shot migration: download every truck photo from Google's CDN, upload to
 * Cloudflare R2, rewrite the URL in data/trucks.json. After this runs, photos
 * are durable (no transient gps-cs-s/ tokens that expire) and indexable by
 * Google Image Search.
 *
 * Idempotent — re-running skips photos that are already in R2 (cheap HEAD check)
 * and only re-uploads anything missing.
 *
 * Usage:
 *   node scripts/migrate-photos-to-r2.mjs              # full run, 8x concurrent
 *   node scripts/migrate-photos-to-r2.mjs --limit=50   # test mode, first 50 only
 *   node scripts/migrate-photos-to-r2.mjs --dry-run    # show what would change
 *
 * Reads credentials from .env.local (R2_* vars). NEVER commit those.
 */
import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { config as loadEnv } from 'dotenv';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

// dotenv/config loads .env; we also want .env.local explicitly
loadEnv({ path: '.env.local' });

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_ENDPOINT,
  R2_PUBLIC_URL,
} = process.env;

for (const [name, val] of [
  ['R2_ACCOUNT_ID', R2_ACCOUNT_ID],
  ['R2_ACCESS_KEY_ID', R2_ACCESS_KEY_ID],
  ['R2_SECRET_ACCESS_KEY', R2_SECRET_ACCESS_KEY],
  ['R2_BUCKET', R2_BUCKET],
  ['R2_ENDPOINT', R2_ENDPOINT],
  ['R2_PUBLIC_URL', R2_PUBLIC_URL],
]) {
  if (!val) {
    console.error(`Missing ${name} in .env.local`);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT = (() => {
  const a = args.find((x) => x.startsWith('--limit='));
  return a ? parseInt(a.split('=')[1], 10) : Infinity;
})();
const CONCURRENCY = 8; // R2 free tier allows plenty; 8 is comfortable + polite

const TRUCKS_JSON = 'data/trucks.json';

const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

// ─── helpers ─────────────────────────────────────────────────────────────────

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
  Referer: 'https://foodtrucksnearmeusa.com/',
};

/** True when this photo URL is a Google CDN URL we want to mirror to R2. */
function isGoogleCdnUrl(url) {
  return /^https?:\/\/lh3\.googleusercontent\.com\//.test(url);
}

/** R2 object key for a given truck slug. Stable, predictable, indexable. */
function r2KeyFor(slug) {
  return `trucks/${slug}.jpg`;
}

/** Public URL once uploaded. */
function publicUrlFor(slug) {
  return `${R2_PUBLIC_URL}/${r2KeyFor(slug)}`;
}

/** Has the object already been uploaded? Cheap Class B HEAD request. */
async function alreadyInR2(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch (err) {
    if (err?.$metadata?.httpStatusCode === 404 || err.name === 'NotFound') return false;
    throw err;
  }
}

async function downloadPhoto(url) {
  const res = await fetch(url, { headers: BROWSER_HEADERS, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url.slice(0, 80)}…`);
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.startsWith('image/')) throw new Error(`Not an image (content-type: ${ct})`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`Suspiciously small (${buf.length} bytes)`);
  return { buf, contentType: ct };
}

async function uploadToR2(key, buf, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buf,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable', // 1 year — slug is stable
    }),
  );
}

/** Process one truck. Returns { status, slug, newUrl } where status ∈
 *  {migrated, alreadyOnR2, skippedNonGoogle, skippedNoPhotos, failed}. */
async function migrateOne(truck) {
  const slug = truck.slug;
  if (!truck.photos || truck.photos.length === 0) {
    return { status: 'skippedNoPhotos', slug };
  }
  const url = truck.photos[0];
  if (!isGoogleCdnUrl(url)) {
    return { status: 'skippedNonGoogle', slug };
  }

  const key = r2KeyFor(slug);
  const newUrl = publicUrlFor(slug);

  if (await alreadyInR2(key)) {
    return { status: 'alreadyOnR2', slug, newUrl };
  }

  if (DRY_RUN) {
    return { status: 'wouldMigrate', slug, newUrl };
  }

  try {
    const { buf, contentType } = await downloadPhoto(url);
    await uploadToR2(key, buf, contentType);
    return { status: 'migrated', slug, newUrl, bytes: buf.length };
  } catch (err) {
    return { status: 'failed', slug, err: String(err.message ?? err).slice(0, 120) };
  }
}

// ─── concurrent worker pool ──────────────────────────────────────────────────

async function runInBatches(items, fn, concurrency) {
  const results = new Array(items.length);
  let nextIndex = 0;
  let completed = 0;
  const start = Date.now();

  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
      completed++;
      if (completed % 25 === 0 || completed === items.length) {
        const elapsed = ((Date.now() - start) / 1000).toFixed(0);
        const rate = (completed / Math.max(1, (Date.now() - start) / 1000)).toFixed(1);
        process.stdout.write(
          `\r  ${completed.toString().padStart(5)}/${items.length}  ` +
            `${elapsed}s elapsed  ${rate} trucks/s    `,
        );
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  process.stdout.write('\n');
  return results;
}

// ─── main ────────────────────────────────────────────────────────────────────

const trucks = JSON.parse(readFileSync(TRUCKS_JSON, 'utf8'));
const toProcess = trucks.slice(0, Math.min(LIMIT, trucks.length));

console.log(`R2 migration${DRY_RUN ? ' (DRY RUN)' : ''}`);
console.log(`  trucks total:      ${trucks.length}`);
console.log(`  processing now:    ${toProcess.length}${LIMIT !== Infinity ? ` (--limit=${LIMIT})` : ''}`);
console.log(`  bucket:            ${R2_BUCKET} @ ${R2_ENDPOINT.replace(/^https:\/\//, '')}`);
console.log(`  public base URL:   ${R2_PUBLIC_URL}`);
console.log(`  concurrency:       ${CONCURRENCY}`);
console.log('');

const results = await runInBatches(toProcess, migrateOne, CONCURRENCY);

// Tally
const counts = {
  migrated: 0,
  alreadyOnR2: 0,
  wouldMigrate: 0,
  skippedNonGoogle: 0,
  skippedNoPhotos: 0,
  failed: 0,
};
let bytesUploaded = 0;
const failures = [];
for (const r of results) {
  counts[r.status] = (counts[r.status] ?? 0) + 1;
  if (r.bytes) bytesUploaded += r.bytes;
  if (r.status === 'failed') failures.push(r);
}

console.log('');
console.log('Summary:');
console.log(`  migrated this run:   ${counts.migrated}`);
console.log(`  already on R2:       ${counts.alreadyOnR2}`);
console.log(`  would migrate (DRY): ${counts.wouldMigrate}`);
console.log(`  skipped (non-google):${counts.skippedNonGoogle}`);
console.log(`  skipped (no photos): ${counts.skippedNoPhotos}`);
console.log(`  FAILED:              ${counts.failed}`);
if (bytesUploaded > 0) {
  console.log(`  bytes uploaded:      ${(bytesUploaded / 1024 / 1024).toFixed(1)} MB`);
}

if (failures.length > 0) {
  console.log('\nFailures (first 10):');
  for (const f of failures.slice(0, 10)) {
    console.log(`  - ${f.slug}: ${f.err}`);
  }
}

// Rewrite trucks.json with R2 URLs where we successfully migrated or confirmed
// the object exists. Idempotent: trucks already pointing to R2 stay as-is.
if (!DRY_RUN) {
  let rewroteCount = 0;
  for (const r of results) {
    if (r.status !== 'migrated' && r.status !== 'alreadyOnR2') continue;
    const truck = trucks.find((t) => t.slug === r.slug);
    if (!truck) continue;
    if (truck.photos?.[0] === r.newUrl) continue; // already updated
    truck.photos = [r.newUrl, ...(truck.photos ?? []).slice(1)];
    rewroteCount++;
  }
  if (rewroteCount > 0) {
    writeFileSync(TRUCKS_JSON, JSON.stringify(trucks));
    console.log(`\n${rewroteCount} truck records updated in ${TRUCKS_JSON}`);
  } else {
    console.log('\nNo trucks needed URL rewrites (already pointing at R2).');
  }
}
