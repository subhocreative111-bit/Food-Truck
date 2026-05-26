# FoodTrucksNearMeUSA

Production-grade Next.js directory for independent food trucks across all 50 US states. Fully static (SSG), built for SEO and Hostinger static hosting.

## Stack

- **Next.js 14** App Router · TypeScript strict · Tailwind CSS
- **Poppins** (400/600/700/900) via `next/font` — Black for display type
- **Framer Motion** for scroll-rise + page polish
- **xlsx** for the build-time Excel → JSON pipeline
- `output: 'export'` — produces a static `out/` folder

## Running locally

```bash
npm install
npm run build:data    # compiles /data/*.xlsx → /data/trucks.json (falls back to a 50-state seed if none)
npm run dev           # http://localhost:3000
```

## Production build for Hostinger

```bash
npm run build
# → out/  (upload this folder to Hostinger via FTP / File Manager)
```

The script chain is `build:data` → `next build`. With `output: 'export'`, every page is pre-rendered to static HTML, giving you ~1,000+ pages from the seed dataset alone.

## Data sources — three ways to populate trucks.json

### A. Import from the legacy HTML site (one-time, ~94k trucks)

```bash
npm run import:old
```

Parses every `food-trucks-in-<state>.html` in `C:\Users\Subho Laha\Desktop\foodtrucks_site\pages\` and dumps name + cuisine + lat/lng to `data/trucks.json`. ~94k trucks in ~1 second. Trucks within 80 km of a known city centroid are tagged with that city; the rest land under "Other Locations".

### B. Add Excel data (recurring, full schema)

Drop `.xlsx` files into `/data/` (Google Maps scraper output works directly). See [`data/README.md`](./data/README.md) for accepted columns (name, state, city, address, phone, website, rating, photos, hours, place_id, etc.).

```bash
npm run build:data
```

This reads every sheet of every Excel file, deduplicates by Place ID, and overwrites `trucks.json`.

### C. Generated seed (development only)

If `data/` is empty and `trucks.json` is missing, `build:data` creates a 50-state seed dataset (~700 trucks) so the site is buildable from a clean clone.

## Scale strategy — how 94k trucks become a deployable site

A naïve "one static HTML per truck" approach with 94k sparse listings would balloon `out/` to ~15 GB. Instead:

- **State / city / cuisine pages** are capped at 60 ranked trucks (featured → rating → reviews). Below the listing, a chip row prompts the user to drill into a city or cuisine for deeper browsing.
- **Truck detail pages** are generated only for listings with rich data — a phone, website, hours, real description, or the "featured" flag. Sparse legacy imports get no detail page; their cards link directly to Google Maps via deep-link.
- **Search** lazy-fetches `/search-index.json` (~25 MB) on the client instead of inlining all 94k trucks into the HTML. Search-page shell is under 60 KB.
- **No real photos for sparse listings** — they render with a cuisine-typed icon card (see [`components/CuisineIconArt.tsx`](./components/CuisineIconArt.tsx)). Real photos appear when owners claim and upload via the "List your truck" flow.

Result: `out/` is ~900 MB instead of ~15 GB, and California's page is 320 KB instead of 53 MB.

## Getting real photos for trucks

The site supports three photo modes per listing:

1. **Owner-uploaded** (best) — via the claim-listing flow in `/list-your-truck`
2. **Categorized placeholder** — assigned at build time from a cuisine pool ([`scripts/import-old-html.ts`](./scripts/import-old-html.ts) → `CUISINE_PHOTO_POOL`)
3. **No photo** — falls through to the cuisine icon art card

For bulk real photos at the 94k scale, the realistic option is a paid re-scrape via Outscraper or Apify (~$100–$200 for the whole dataset) that captures Google Maps photo URLs. Store the URLs in `trucks.json` and the existing renderer picks them up automatically.

## Project layout

```
app/
  layout.tsx              · root layout + Poppins + nav + footer
  page.tsx                · homepage (hero, featured, cities, map, cuisines, recent)
  states/page.tsx         · all 50 states index
  states/[state]/page.tsx · state directory (50 pages, SSG)
  states/[state]/[city]/  · city directory (~210 pages, SSG)
  truck/[slug]/page.tsx   · individual business page + LocalBusiness JSON-LD (~700 pages, SSG)
  cuisines/page.tsx       · all cuisines index
  cuisines/[type]/page.tsx· cuisine filter pages (~25 pages, SSG)
  search/page.tsx         · client-side search over the full index
  list-your-truck/        · owner signup + pricing
  about/ · contact/ · blog/
  sitemap.ts · robots.ts  · auto-generated from the data
components/
  SiteNav · Footer · Hero · SearchBar · TruckCard · TruckListing
  StateMap · FilterSidebar · BusinessHours · RatingDots
  PhotoGallery · CityCard · CuisineCard · SectionHeader · Marquee · SpotlightCard
lib/
  data.ts · types.ts · states.ts · slug.ts · hours.ts
scripts/
  build-data.ts           · Excel → JSON pipeline (with seed fallback)
data/
  *.xlsx                  · your scraped data (gitignored)
  trucks.json             · generated; gitignored
```

## Design system

- **Palette**: Ember Red `#C8463A` · Saffron `#F2A53A` · Cream `#FAF4E8` · Ink `#1A1614`
- **Type**: Poppins Black (900) for H1/H2, Bold (700) for H3/buttons, Regular (400) for body
- **Body line-height**: 1.7 · **Numerics**: tabular-nums on all stats
- **Hover ease**: `cubic-bezier(0.22, 1, 0.36, 1)` (the "editorial" curve)
- **Rating**: filled saffron dots (not stars)
- **Featured badge**: saffron pill, sorted to top
- **Grain texture**: SVG-noise overlay on hero + dark CTA blocks

## SEO

- `generateMetadata` on every route — unique title + description
- `LocalBusiness` JSON-LD on each `/truck/[slug]` page
- Auto-generated `sitemap.xml` covering: 1 home + 8 statics + 50 states + ~210 cities + ~25 cuisines + ~700 trucks
- `robots.txt` allows all
- OpenGraph metadata + per-truck image

## Deploy to Hostinger

1. `npm run build`
2. Open Hostinger File Manager → `public_html/`
3. Upload everything in the `out/` folder (preserve folder structure)
4. Drop the included `.htaccess` (if you want clean URLs) or rely on the `trailingSlash: true` config which produces `index.html` files inside each route folder

Re-uploading is a full overwrite — there's no server runtime to manage.
