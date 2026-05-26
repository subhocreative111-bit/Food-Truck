import trucksData from '@/data/trucks.json';
import type { Cuisine, CitySummary, StateSummary, Truck, CuisineSummary } from './types';
import { US_STATES } from './states';
import { slugify, cuisineSlug } from './slug';

export const TRUCKS: Truck[] = trucksData as Truck[];

const byState = new Map<string, Truck[]>();
const byCity = new Map<string, Truck[]>(); // key: stateSlug/citySlug
const bySlug = new Map<string, Truck>();
const byCuisine = new Map<Cuisine, Truck[]>();

for (const t of TRUCKS) {
  if (!byState.has(t.stateSlug)) byState.set(t.stateSlug, []);
  byState.get(t.stateSlug)!.push(t);

  const cityKey = `${t.stateSlug}/${t.citySlug}`;
  if (!byCity.has(cityKey)) byCity.set(cityKey, []);
  byCity.get(cityKey)!.push(t);

  bySlug.set(t.slug, t);

  for (const c of t.cuisine) {
    if (!byCuisine.has(c)) byCuisine.set(c, []);
    byCuisine.get(c)!.push(t);
  }
}

export function getAllTrucks(): Truck[] {
  return TRUCKS;
}

export function getTrucksByState(stateSlug: string): Truck[] {
  return byState.get(stateSlug) ?? [];
}

export function getTrucksByCity(stateSlug: string, citySlug: string): Truck[] {
  return byCity.get(`${stateSlug}/${citySlug}`) ?? [];
}

export function getTruckBySlug(slug: string): Truck | undefined {
  return bySlug.get(slug);
}

export function getTrucksByCuisine(cuisine: Cuisine): Truck[] {
  return byCuisine.get(cuisine) ?? [];
}

/** Sort trucks by editorial relevance: featured → rating → review count. */
export function rankTrucks(list: Truck[]): Truck[] {
  return [...list].sort(
    (a, b) =>
      Number(b.featured ?? false) - Number(a.featured ?? false) ||
      b.rating - a.rating ||
      b.reviewCount - a.reviewCount,
  );
}

/**
 * Page-size cap for listing pages. Keeps HTML under ~500KB on the biggest states
 * (CA was 53 MB unconstrained). Users browse deeper via city / cuisine pages.
 */
export const LISTING_PAGE_CAP = 60;

export function getFeaturedTrucks(limit = 8): Truck[] {
  return TRUCKS.filter((t) => t.featured)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function getRecentTrucks(limit = 12): Truck[] {
  // No timestamp in data — use rating × reviewCount as a stand-in for "fresh + popular"
  return [...TRUCKS]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, limit);
}

export function getAllStates(): StateSummary[] {
  return US_STATES.map((s) => {
    const trucks = getTrucksByState(s.slug);
    const cityMap = new Map<string, CitySummary>();
    for (const t of trucks) {
      const ck = t.citySlug;
      const existing = cityMap.get(ck);
      if (existing) {
        existing.count += 1;
        if (t.rating > existing.topRating) existing.topRating = t.rating;
      } else {
        cityMap.set(ck, {
          name: t.city,
          slug: t.citySlug,
          state: s.name,
          stateSlug: s.slug,
          count: 1,
          topRating: t.rating,
        });
      }
    }
    const cuisineMap = new Map<Cuisine, number>();
    for (const t of trucks) for (const c of t.cuisine) cuisineMap.set(c, (cuisineMap.get(c) ?? 0) + 1);

    return {
      name: s.name,
      slug: s.slug,
      abbr: s.abbr,
      count: trucks.length,
      topCities: [...cityMap.values()].sort((a, b) => b.count - a.count).slice(0, 12),
      topCuisines: [...cuisineMap.entries()]
        .map(([cuisine, count]) => ({ cuisine, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
    };
  });
}

export function getStateBySlug(slug: string): StateSummary | undefined {
  return getAllStates().find((s) => s.slug === slug);
}

export function getAllCities(): CitySummary[] {
  const out: CitySummary[] = [];
  const seen = new Set<string>();
  for (const t of TRUCKS) {
    const k = `${t.stateSlug}/${t.citySlug}`;
    if (seen.has(k)) continue;
    seen.add(k);
    const trucks = getTrucksByCity(t.stateSlug, t.citySlug);
    out.push({
      name: t.city,
      slug: t.citySlug,
      state: t.state,
      stateSlug: t.stateSlug,
      count: trucks.length,
      topRating: trucks.reduce((m, x) => Math.max(m, x.rating), 0),
    });
  }
  return out;
}

export function getCity(stateSlug: string, citySlug: string): CitySummary | undefined {
  const trucks = getTrucksByCity(stateSlug, citySlug);
  if (trucks.length === 0) return undefined;
  const t = trucks[0];
  return {
    name: t.city,
    slug: t.citySlug,
    state: t.state,
    stateSlug: t.stateSlug,
    count: trucks.length,
    topRating: trucks.reduce((m, x) => Math.max(m, x.rating), 0),
  };
}

export function getPopularCities(limit = 12): CitySummary[] {
  return getAllCities()
    .filter((c) => c.slug !== 'other-locations')
    .sort((a, b) => b.count - a.count || b.topRating - a.topRating)
    .slice(0, limit);
}

export function getAllCuisines(): CuisineSummary[] {
  return [...byCuisine.entries()]
    .map(([cuisine, list]) => ({ cuisine, slug: cuisineSlug(cuisine), count: list.length }))
    .sort((a, b) => b.count - a.count);
}

export function getCuisineBySlug(slug: string): CuisineSummary | undefined {
  return getAllCuisines().find((c) => c.slug === slug);
}

// Re-export pure helpers so existing server-side imports keep working.
// Client components should import from '@/lib/truck-helpers' directly to
// avoid pulling trucks.json into the client bundle.
export { hasDetailPage, googleMapsUrl } from './truck-helpers';
import { hasDetailPage } from './truck-helpers';

export function getTrucksWithDetailPages(): Truck[] {
  return TRUCKS.filter(hasDetailPage);
}

export { slugify, cuisineSlug };
