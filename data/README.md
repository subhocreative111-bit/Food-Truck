# Data folder

Drop your Google-Maps-scraper Excel files here as `.xlsx`. Then run:

```bash
npm run build:data
```

This compiles every sheet of every Excel file into `data/trucks.json`, which the site reads at build time.

## Expected columns (case-insensitive, any subset)

- `name` / `title` / `business_name`
- `state` / `state_name` (full name OR 2-letter abbreviation)
- `city`
- `address` / `full_address`
- `phone`
- `website` / `site`
- `rating`
- `reviews` / `review_count`
- `lat` / `latitude`, `lng` / `lon` / `longitude`
- `cuisine` / `category` / `categories` / `type` (comma- or pipe-separated)
- `hours` / `working_hours`
- `photos` / `image` / `thumbnail` (comma-separated URLs)
- `place_id` / `google_place_id` (used to dedupe)
- `featured` (`true`/`1`/`yes` to flag as a premium listing)
- `price_level` (1, 2, or 3)
- `description`

If `data/` is empty, `build-data` generates a seed dataset spanning all 50 states so the site builds clean.
