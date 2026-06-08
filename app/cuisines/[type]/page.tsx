import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TruckListing from '@/components/TruckListing';
import SectionHeader from '@/components/SectionHeader';
import { LISTING_PAGE_CAP, getAllCuisines, getCuisineBySlug, getTrucksByCuisine, rankTrucks } from '@/lib/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCuisines().map((c) => ({ type: c.slug }));
}

export function generateMetadata({ params }: { params: { type: string } }): Metadata {
  const c = getCuisineBySlug(params.type);
  if (!c) return {};
  return {
    title: { absolute: `${c.cuisine} Food Trucks Across the US` },
    description: `Browse ${c.count} ${c.cuisine} food trucks across all 50 states. Compare ratings and reviews, and check opening hours and locations near you.`,
    alternates: { canonical: `/cuisines/${c.slug}` },
    openGraph: {
      title: `${c.cuisine} Food Trucks`,
      description: `${c.count} ${c.cuisine.toLowerCase()} food trucks across the US.`,
      url: `/cuisines/${c.slug}`,
      type: 'website',
    },
  };
}

export default function CuisinePage({ params }: { params: { type: string } }) {
  const summary = getCuisineBySlug(params.type);
  if (!summary) notFound();
  const allTrucks = getTrucksByCuisine(summary.cuisine);
  const trucks = rankTrucks(allTrucks).slice(0, LISTING_PAGE_CAP);
  const truncated = allTrucks.length > trucks.length;
  const cuisineList = [{ cuisine: summary.cuisine, count: summary.count }];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://foodtrucksnearmeusa.com/' },
      { '@type': 'ListItem', position: 2, name: 'Cuisines', item: 'https://foodtrucksnearmeusa.com/cuisines/' },
      { '@type': 'ListItem', position: 3, name: summary.cuisine, item: `https://foodtrucksnearmeusa.com/cuisines/${summary.slug}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="grain relative isolate overflow-hidden px-6 pb-12 pt-12 md:px-10 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
            <Link href="/" className="hover:text-ember">Home</Link>
            <span>/</span>
            <Link href="/cuisines" className="hover:text-ember">Cuisines</Link>
            <span>/</span>
            <span className="text-ink">{summary.cuisine}</span>
          </nav>
          <span className="mt-8 inline-block text-xs font-black uppercase tracking-[0.22em] text-ember">— Cuisine</span>
          <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,8.5rem)] font-black leading-[0.92] tracking-tightest">
            {summary.cuisine}<span className="text-ember">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/65 md:text-xl">
            <span className="font-black text-ink">{summary.count.toLocaleString()}</span> {summary.cuisine.toLowerCase()} trucks across all 50 states.
            {truncated && (
              <span className="block mt-3 text-base text-ink/55">
                Showing the top {trucks.length}. Browse by state to see them all.
              </span>
            )}
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Directory" title={`Every ${summary.cuisine.toLowerCase()} truck`} />
          <div className="mt-10">
            <TruckListing trucks={trucks} allCuisines={cuisineList} />
          </div>
        </div>
      </section>
    </>
  );
}
