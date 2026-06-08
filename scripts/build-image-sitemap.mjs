/**
 * Build a Google-compliant image sitemap from data/trucks.json.
 *
 * Why a separate script: Next 14.2's MetadataRoute.Sitemap silently ignores
 * the `images` field on entries (fixed in 14.3+). Writing the image sitemap
 * directly bypasses that bug and lets us surface ~2,930 self-hosted R2 truck
 * photos to Google Image Search — a real source of long-tail traffic for
 * food-related image queries.
 *
 * Output: public/sitemap-images.xml (committed; copied into out/ by Next's
 * static export the same way other public/ files are).
 *
 * Spec: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE = 'https://foodtrucksnearmeusa.com';
const TRUCKS = JSON.parse(readFileSync(join(ROOT, 'data', 'trucks.json'), 'utf8'));
const OUT = join(ROOT, 'public', 'sitemap-images.xml');

// Match our self-hosted R2 photos. The custom-domain pattern is for the future
// photos.foodtrucksnearmeusa.com swap (5-min CNAME work, deferred).
const R2_PATTERN = /^https:\/\/(pub-1fc3[a-z0-9]+\.r2\.dev|photos\.foodtrucksnearmeusa\.com)\//;

// Only emit detail-page-worthy trucks (matches hasDetailPage in truck-helpers.ts)
function hasDetailPage(t) {
  return Boolean(
    t.phone || t.website || t.hours || (t.description && t.description.length > 40) || t.featured,
  );
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const entries = [];
for (const t of TRUCKS) {
  if (!hasDetailPage(t)) continue;
  const photo = t.photos?.[0];
  if (!photo || !R2_PATTERN.test(photo)) continue;
  const pageUrl = `${BASE}/truck/${t.slug}/`;
  const caption = `${t.name} — ${t.cuisine?.join(' & ') || 'food truck'} in ${t.city}, ${t.state}`;
  const title = `${t.name} food truck`;
  entries.push({ pageUrl, photo, caption, title });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `  <url>
    <loc>${xmlEscape(e.pageUrl)}</loc>
    <image:image>
      <image:loc>${xmlEscape(e.photo)}</image:loc>
      <image:title>${xmlEscape(e.title)}</image:title>
      <image:caption>${xmlEscape(e.caption)}</image:caption>
    </image:image>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(OUT, xml, 'utf8');
console.log(`[image-sitemap] Wrote ${entries.length.toLocaleString()} image entries → ${OUT}`);
