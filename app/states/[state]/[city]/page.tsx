import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TruckListing from '@/components/TruckListing';
import SectionHeader from '@/components/SectionHeader';
import { LISTING_PAGE_CAP, getAllCities, getCity, getStateBySlug, getTrucksByCity, rankTrucks } from '@/lib/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCities().map((c) => ({ state: c.stateSlug, city: c.slug }));
}

export function generateMetadata({ params }: { params: { state: string; city: string } }): Metadata {
  const c = getCity(params.state, params.city);
  if (!c) return {};
  return {
    // `absolute` avoids the brand suffix so the title stays ≤ 60 chars
    title: { absolute: `Food Trucks in ${c.name}, ${c.state}` },
    description: `The best food trucks in ${c.name}, ${c.state} — ${c.count} curated listings with ratings, reviews, opening hours and locations.`,
    alternates: { canonical: `/states/${c.stateSlug}/${c.slug}` },
    openGraph: {
      title: `Food Trucks in ${c.name}, ${c.state}`,
      description: `${c.count} food trucks in ${c.name}.`,
      url: `/states/${c.stateSlug}/${c.slug}`,
      type: 'website',
    },
  };
}

export default function CityPage({ params }: { params: { state: string; city: string } }) {
  const city = getCity(params.state, params.city);
  const state = getStateBySlug(params.state);
  if (!city || !state) notFound();

  const allTrucks = getTrucksByCity(params.state, params.city);
  const trucks = rankTrucks(allTrucks).slice(0, LISTING_PAGE_CAP);
  const truncated = allTrucks.length > trucks.length;
  const cuisineMap = new Map<string, number>();
  for (const t of allTrucks) for (const c of t.cuisine) cuisineMap.set(c, (cuisineMap.get(c) ?? 0) + 1);
  const cuisineList = [...cuisineMap.entries()].map(([cuisine, count]) => ({ cuisine, count }));

  return (
    <>
      <section className="grain relative isolate overflow-hidden px-6 pb-12 pt-12 md:px-10 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
            <Link href="/" className="hover:text-ember">Home</Link>
            <span>/</span>
            <Link href={`/states/${state.slug}`} className="hover:text-ember">{state.name}</Link>
            <span>/</span>
            <span className="text-ink">{city.name}</span>
          </nav>

          <div className="mt-8">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">
              {state.abbr} · City guide
            </span>
            <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,8.5rem)] font-black leading-[0.92] tracking-tightest">
              {city.name}
              <span className="text-ember">.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/65 md:text-xl">
              <span className="font-black text-ink">{allTrucks.length.toLocaleString()}</span> food trucks in {city.name}, {state.name} —
              from late-night taco windows to weekend BBQ rigs.
              {truncated && (
                <span className="block mt-3 text-base text-ink/55">
                  Showing the top {trucks.length}. Use search or cuisine filters to find more.
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Directory" title={`Trucks in ${city.name}`} />
          <div className="mt-10">
            <TruckListing trucks={trucks} allCuisines={cuisineList} />
          </div>
        </div>
      </section>
    </>
  );
}
