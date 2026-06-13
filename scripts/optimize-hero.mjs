/**
 * Generates the self-hosted homepage hero image variants.
 *
 * Why: the hero is the mobile LCP element. Served from Unsplash it cost ~384 KB
 * AVIF and ~5 s LCP on PSI's Slow-4G profile — a third-party origin (extra
 * DNS/TLS + Unsplash's own processing) sitting on the critical path. Encoding
 * our own AVIF at the exact widths we serve, hosted same-origin (Cloudflare
 * edge), cuts the bytes by more than half and removes the third-party hop.
 *
 * One-off / re-runnable. Writes public/hero/hero-{640,960,1280}.avif + a
 * hero-1280.jpg fallback for the rare no-AVIF browser. Source is the same
 * Unsplash photo we used before, pulled once at high res.
 *
 *   node scripts/optimize-hero.mjs
 */
import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'hero');
// Master cache lives OUTSIDE public/ so `next build` doesn't ship the 1.1 MB
// source to out/. Gitignored; re-fetched on demand.
const MASTER = path.join(ROOT, 'scripts', '.hero-master.jpg');
const SRC_URL =
  'https://images.unsplash.com/photo-1683508700255-f9b09a11f687?w=1600&q=85&auto=format&fit=crop';

const WIDTHS = [640, 960, 1280];

async function main() {
  await mkdir(OUT, { recursive: true });

  // Fetch the master once and cache it locally so re-runs are offline.
  if (!existsSync(MASTER)) {
    const res = await fetch(SRC_URL);
    if (!res.ok) throw new Error(`master fetch failed: HTTP ${res.status}`);
    await writeFile(MASTER, Buffer.from(await res.arrayBuffer()));
    console.log(`fetched master -> ${path.relative(ROOT, MASTER)}`);
  }

  const master = await readFile(MASTER);

  for (const w of WIDTHS) {
    // q42 is the knee of the curve for this photo: ~155 KB at 960px (vs ~384 KB
    // from Unsplash) with no visible loss under the hero's dark gradient + text.
    const buf = await sharp(master)
      .resize({ width: w })
      .avif({ quality: 42, effort: 6 })
      .toBuffer();
    const file = path.join(OUT, `hero-${w}.avif`);
    await writeFile(file, buf);
    console.log(`hero-${w}.avif  ${(buf.length / 1024).toFixed(0)} KB`);
  }

  // JPEG fallback at the largest width for browsers without AVIF support.
  const jpg = await sharp(master).resize({ width: 1280 }).jpeg({ quality: 72, mozjpeg: true }).toBuffer();
  await writeFile(path.join(OUT, 'hero-1280.jpg'), jpg);
  console.log(`hero-1280.jpg  ${(jpg.length / 1024).toFixed(0)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
