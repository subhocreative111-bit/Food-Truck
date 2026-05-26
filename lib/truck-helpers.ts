/**
 * Pure, data-free helpers that can be safely imported by client components
 * without dragging trucks.json into the client bundle.
 *
 * Anything in `lib/data.ts` should stay server-only because it imports the
 * full ~40 MB trucks dataset.
 */
import type { Truck } from './types';

/**
 * A truck gets its own /truck/[slug] static page only when we have meaningful
 * data beyond name+coords — phone, website, hours, or a real description.
 * Sparse imports skip the detail page and link straight to Google Maps from
 * the listing.
 */
export function hasDetailPage(t: Truck): boolean {
  return Boolean(
    t.phone ||
      t.website ||
      t.hours ||
      (t.description && t.description.length > 40) ||
      t.featured,
  );
}

export function googleMapsUrl(t: Truck): string {
  const q = encodeURIComponent(`${t.name} ${t.city} ${t.state}`);
  if (t.lat != null && t.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=${t.placeId ?? ''}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
