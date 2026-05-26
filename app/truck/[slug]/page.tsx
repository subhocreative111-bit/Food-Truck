import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Globe, Tag, ShieldCheck } from 'lucide-react';
import PhotoGallery from '@/components/PhotoGallery';
import BusinessHours from '@/components/BusinessHours';
import RatingDots from '@/components/RatingDots';
import TruckCard from '@/components/TruckCard';
import SectionHeader from '@/components/SectionHeader';
import { getTrucksWithDetailPages, getTruckBySlug, getTrucksByCity } from '@/lib/data';
import { cuisineSlug } from '@/lib/slug';

export const dynamicParams = false;

export function generateStaticParams() {
  // Detail pages are generated only for trucks with rich data (claimed/featured
  // listings, or anything with phone/website/hours). The 93k sparse imports
  // surface on listing pages with a direct Google-Maps deep-link instead.
  return getTrucksWithDetailPages().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = getTruckBySlug(params.slug);
  if (!t) return {};
  const cuisine = t.cuisine.join(' & ');
  return {
    title: `${t.name} — ${cuisine} in ${t.city}, ${t.state}`,
    description:
      t.description ?? `${t.name} is a ${cuisine.toLowerCase()} food truck in ${t.city}, ${t.state}. Hours, address, photos and reviews.`,
    openGraph: {
      title: t.name,
      description: `${cuisine} · ${t.city}, ${t.state}`,
      images: t.photos.slice(0, 1),
    },
  };
}

export default function TruckPage({ params }: { params: { slug: string } }) {
  const t = getTruckBySlug(params.slug);
  if (!t) notFound();

  const related = getTrucksByCity(t.stateSlug, t.citySlug).filter((x) => x.slug !== t.slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: t.name,
    image: t.photos,
    address: {
      '@type': 'PostalAddress',
      streetAddress: t.address,
      addressLocality: t.city,
      addressRegion: t.state,
      addressCountry: 'US',
    },
    geo: t.lat != null && t.lng != null ? { '@type': 'GeoCoordinates', latitude: t.lat, longitude: t.lng } : undefined,
    telephone: t.phone,
    url: t.website,
    servesCuisine: t.cuisine,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: t.rating,
      reviewCount: t.reviewCount,
    },
    priceRange: t.priceLevel ? '$'.repeat(t.priceLevel) : undefined,
  };

  const mapsUrl = t.lat != null && t.lng != null
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${t.lng - 0.01}%2C${t.lat - 0.01}%2C${t.lng + 0.01}%2C${t.lat + 0.01}&layer=mapnik&marker=${t.lat}%2C${t.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=-125%2C24%2C-66%2C49&layer=mapnik`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="px-6 pb-10 pt-8 md:px-10 md:pt-12">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
            <Link href="/" className="hover:text-ember">Home</Link>
            <span>/</span>
            <Link href={`/states/${t.stateSlug}`} className="hover:text-ember">{t.state}</Link>
            <span>/</span>
            <Link href={`/states/${t.stateSlug}/${t.citySlug}`} className="hover:text-ember">{t.city}</Link>
            <span>/</span>
            <span className="truncate text-ink">{t.name}</span>
          </nav>

          <div className="mt-6">
            <PhotoGallery photos={t.photos} name={t.name} />
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {t.featured && <span className="featured-pill">Featured</span>}
                {t.cuisine.slice(0, 3).map((c) => (
                  <Link key={c} href={`/cuisines/${cuisineSlug(c)}`} className="chip transition-colors hover:border-ember hover:text-ember">
                    {c}
                  </Link>
                ))}
                {t.priceLevel != null && (
                  <span className="tabular chip">{'$'.repeat(t.priceLevel)}</span>
                )}
              </div>
              <h1 className="mt-5 text-6xl font-black leading-[0.95] tracking-tightest md:text-7xl lg:text-8xl">
                {t.name}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <RatingDots rating={t.rating} size="lg" showNumber reviewCount={t.reviewCount} />
                <span className="text-sm text-ink/55">
                  <MapPin className="mr-1 inline h-3.5 w-3.5" />
                  {t.city}, {t.state}
                </span>
              </div>

              {t.description && (
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75">{t.description}</p>
              )}

              <div className="mt-12 grid gap-3 sm:grid-cols-2">
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={t.address} />
                {t.phone && <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={t.phone} href={`tel:${t.phone}`} />}
                {t.website && <InfoRow icon={<Globe className="h-4 w-4" />} label="Website" value={t.website.replace(/^https?:\/\//, '')} href={t.website} />}
                <InfoRow icon={<Tag className="h-4 w-4" />} label="Cuisine" value={t.cuisine.join(', ')} />
              </div>

              <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10">
                <iframe
                  src={mapsUrl}
                  title={`Map of ${t.name}`}
                  className="aspect-[16/9] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <BusinessHours hours={t.hours} />

              <div className="mt-5 rounded-3xl border border-ink/10 bg-cream-50 p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-ember" />
                  <h3 className="text-sm font-black uppercase tracking-[0.18em]">Own this truck?</h3>
                </div>
                <p className="mt-3 text-sm text-ink/65">
                  Claim your listing to update hours, add photos, and respond to reviews.
                </p>
                <Link href="/list-your-truck" className="btn-primary mt-5 w-full text-sm">
                  Claim this listing
                </Link>
              </div>

              <div className="mt-5 rounded-3xl border border-dashed border-ink/15 p-6 text-sm text-ink/55">
                Reviews coming soon — we&apos;re currently displaying aggregated Google ratings.
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-cream-50 px-6 py-20 md:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow={`More in ${t.city}`} title="Other trucks nearby." />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r, i) => (
                <TruckCard key={r.slug} truck={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <>
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/40">{label}</span>
        <span className="truncate font-bold text-ink">{value}</span>
      </span>
    </>
  );
  return href ? (
    <a href={href} className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4 transition-colors hover:border-ember hover:bg-cream-50" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/10 p-4">{inner}</div>
  );
}
