# CLAUDE.md — context for future agent sessions

This is the operator-facing notes file. Read this FIRST before doing any work
on this repo. It will save you from re-grepping the codebase to discover
things that are already decided.

Last updated: 2026-06-12 (Supabase incident + catering funnel + 6 city guides).

---

## What this project is

`foodtrucksnearmeusa.com` — a hand-curated directory of independent food trucks
across all 50 US states. Built with Next.js 14 App Router + static export
(`output: 'export'`), Tailwind, TypeScript strict. Hosted on Hostinger via a
GitHub-integrated deployment, with **Cloudflare DNS + CDN in front**.
Database is **Supabase** (auth + claims). Photos self-hosted on **Cloudflare R2**.

Owner / operator: **Subho** (India-based). Current operating mode: solo,
hobbyist budget, organic-SEO-first growth.

## Current state (as of 2026-06-10)

| | |
|---|---|
| Trucks indexed in `data/trucks.json` | **3,244** |
| Trucks with detail pages | ~3,116 |
| Blog posts | **16** (~75k words of editorial) |
| State intros | **50** (all states) |
| Photos durably on R2 | **3,008** (92.7%) |
| GSC indexed pages (last data point Jun 1) | 756 |
| GSC daily impressions | ~500/day, climbing |
| GSC avg position | ~10 |
| #1 Google rankings | 3 (taino warrior, food truck park near me, empanadas charleston sc) |
| Mobile PSI score | 85 |
| Lighthouse SEO score | 100 |

Run `npm run status` (defined below) to get an up-to-date snapshot any time.

## Files / directories that matter, in priority order

```
data/
  trucks.json              ← committed source of truth, 3,244 trucks (~2.3MB)
                             DO NOT read this whole file. Use scripts/status.mjs
                             or specific node -e queries instead.
  outscraper-merged.json   ← gitignored, raw scrape (regen via merge script)
  trucks.json.backup-seed  ← gitignored, original seed data we replaced

app/
  layout.tsx               ← root metadata, Poppins (weights 400/700/900),
                             preconnects for Unsplash + R2 photo subdomain
  page.tsx                 ← homepage, has hero image preload
  sitemap.ts               ← per-page sitemap, 3.6k URLs
  robots.ts                ← declares both sitemap.xml and sitemap-images.xml
  truck/[slug]/page.tsx    ← 3,116 truck detail pages, FoodEstablishment +
                             BreadcrumbList JSON-LD, NO aggregateRating
                             (Google review-snippets policy)
  blog/page.tsx            ← blog index
  blog/[slug]/page.tsx     ← post pages, Article + BreadcrumbList JSON-LD
  states/[state]/page.tsx  ← state pages with editorial intro + BreadcrumbList
  states/[state]/[city]/page.tsx ← city pages with BreadcrumbList
  cuisines/[type]/page.tsx ← cuisine pages with BreadcrumbList
  privacy/, terms/         ← legal pages (AdSense compliance)

lib/
  types.ts                 ← Truck, CitySummary, StateSummary, etc.
  data.ts                  ← getAllStates, getAllCities, rankTrucks, pickCityCover
  truck-helpers.ts         ← hasDetailPage, googleMapsUrl (client-safe)
  outscraper-import.ts     ← Outscraper → Truck schema mapper + filtering
  blog-posts.ts            ← registry; new posts must be added here
  blog/*.tsx               ← one file per blog post
  state-intros.ts          ← editorial paragraphs by state slug
  chain-blocklist.ts       ← brick-and-mortar chains filtered out of imports
  states.ts                ← US_STATES, STATE_BY_NAME, STATE_BY_ABBR
  supabase/                ← client setup, hooks; .env.local has the keys

scripts/
  build-data.ts            ← rebuilds trucks.json from outscraper-merged.json
                             SKIPS regeneration if trucks.json already exists
  build-search-index.ts    ← writes public/search-index.json
  build-image-sitemap.mjs  ← writes public/sitemap-images.xml (R2 photos only)
  run-build.js             ← orchestrates build:data → build:search → image
                             sitemap → next build
  migrate-photos-to-r2.mjs ← downloads Google CDN photos → uploads to R2,
                             rewrites trucks.json URLs. Idempotent (HEAD-checks).
                             Reads R2_* env vars from .env.local.
  merge-outscraper.mjs     ← consolidates xlsx exports → outscraper-merged.json
  merge-backup-states.mjs  ← (legacy, kept for reference) — NOT in build pipeline
  status.mjs               ← prints a one-line state snapshot

public/
  .htaccess                ← Hostinger Apache config: www→non-www, HTTPS force,
                             trailing-slash strip, legacy /pages/ + /blog/ 301s
  sitemap-images.xml       ← 2,930 R2 photos for Google Image Search

components/
  Hero.tsx                 ← homepage hero; SERVER component (no framer-motion)
  TruckCard.tsx, CityCard.tsx, PhotoGallery.tsx ← uses framer-motion
                             (below-the-fold, fine for LCP)
  Footer.tsx, SiteNav.tsx  ← Run a Truck? / My Truck / Get listed nav labels
  analytics/Analytics.tsx  ← GA4 + AdSense, gated by consent, afterInteractive
```

## Critical commands

```
npm run dev               # local dev at :3000
npm run build             # full prod build → out/ (runs run-build.js)
npm run build:data        # only regenerate trucks.json (no-op if exists)
npm run typecheck         # tsc --noEmit
npm run lint              # next lint
npm run status            # one-line state snapshot (data + commits)

# Image migration (one-off; requires R2 env vars)
node scripts/migrate-photos-to-r2.mjs --dry-run
node scripts/migrate-photos-to-r2.mjs --limit=10   # test
node scripts/migrate-photos-to-r2.mjs              # full
```

## Deployment

GitHub-integrated via Hostinger. Push to `main` and Hostinger auto-pulls +
runs `node scripts/run-build.js`. Output: `out/`. Hostname:
`foodtrucksnearmeusa.com` (non-www, www → non-www 301 in .htaccess +
Cloudflare). Cloudflare CDN is in front; Under Attack Mode is OFF (was the
cause of a 5-day Google indexing stall).

## Decisions already made — DO NOT re-debate

- **Tagline / nav labels:** "Run a Truck?" (nav link), "My Truck" (sign-in),
  "Get listed" (CTA). Owner-y wording was rejected as too corporate.
- **No aggregateRating JSON-LD on truck pages.** Google's review-snippet
  policy requires the reviews to be on the same domain; ours are aggregated
  from Google Maps. Adding it back triggered a Search Console error.
- **R2 photo URLs use the dev domain** `pub-1fc3abcd270c4b80ac998884b38e3fc3.r2.dev`
  for now. Plan: swap to custom subdomain `photos.foodtrucksnearmeusa.com`
  later (5-min Cloudflare DNS work + trucks.json regex rewrite + Polish).
- **Outscraper data is the source.** 35k seed trucks were wiped (stock photos,
  fake ratings). Real RI data was salvaged from backup into the merge.
- **Hostinger is the host, not Cloudflare Pages.** R2 migration paywall blocked
  R2 setup but unrelated to hosting choice. Pages migration was deferred.
- **AdSense was rejected once** for "Low value content"; the round-2 fix (legal
  pages + 16 blog posts + 50 state intros) is shipped and waiting for re-review.
- **The 46 trucks with `gps-proxy/` photo URLs are not migrated** — Google's
  CDN returns 403 on those. They fall back to the cuisine icon art via the
  onError handler. Accepted as 1.4% loss.
- **Hero is server-rendered, no framer-motion.** All `motion.*` removed from
  above-the-fold elements. Below-the-fold cards still use framer-motion (fine).
- **Poppins font weights:** 400, 700, 900. 600 was dropped to save ~150KB.

## Patterns / gotchas to remember

- `data/trucks.json` is huge — never `Read` the whole file. Instead use:
  ```
  node -e "const t=require('./data/trucks.json'); console.log(t.length)"
  ```
- The Coverage / Performance exports from GSC are in CSVs inside zip files
  in the user's Downloads folder. Format: `<domain>-<report>-YYYY-MM-DD.zip`.
- `npm run build` will skip regenerating `trucks.json` if it already has data.
  This is intentional — the committed file is the source of truth.
- `.env.local` contains R2 credentials AND Supabase credentials. Gitignored.
  Hostinger reads `NEXT_PUBLIC_*` vars only at build time via its env panel.
- Don't run `npm run dev` and expect a clean restart — `.next/` cache often
  needs `rm -rf .next` first if a prior build cluttered it.
- **Supabase free tier auto-pauses after ~7 days without API activity**, and
  while paused EVERY form on the live site silently fails (catering, contact,
  claims, sign-in). Discovered 2026-06-12: project was paused AND the database
  was empty — the schema had never been applied via migration history. Fixed
  by restoring the project and applying all 5 files in `supabase/migrations/`
  via MCP (now recorded in migration history), recreating the `truck-photos`
  bucket, and adding `.github/workflows/supabase-keepalive.yml` (daily
  authenticated REST ping). If forms break again, FIRST check project status
  with the Supabase MCP (`get_project`, status INACTIVE = paused).
- **Resend is in sandbox mode** — notification emails can only deliver to
  `subho.creative111@gmail.com` (the Resend account owner). The
  `notify-submission` edge function's `ADMIN_EMAIL` secret points at
  `hello@foodtrucksnearmeusa.com`, which Resend 403s. Fix: either verify the
  domain at resend.com/domains (Cloudflare DNS records) + set `NOTIFY_FROM`,
  or set `ADMIN_EMAIL=subho.creative111@gmail.com` in the function secrets.
  Leads are never lost either way — they land in `public.submissions`.

## Commit message style

Sentence case for the title; prefix with category when relevant ("SEO:",
"Perf:", "Content sprint:", etc.). Always include a body explaining the
why, not just the what. Co-author trailer:

```
Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## When in doubt

1. Read this file before doing anything else.
2. For one-line state queries, run `npm run status`.
3. For "what changed recently", run `git log --oneline -10`.
4. For "what's the data shape", run a `node -e` one-liner against
   `data/trucks.json` — never `Read` the file.
5. If you're about to do something destructive (replace trucks.json,
   delete files), ASK first. The user has put real money and time into this.

— Ve
