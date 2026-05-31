import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TruckListing from '@/components/TruckListing';
import SectionHeader from '@/components/SectionHeader';
import { LISTING_PAGE_CAP, getAllStates, getStateBySlug, getTrucksByState, rankTrucks } from '@/lib/data';
import { US_STATES } from '@/lib/states';
import { STATE_INTROS } from '@/lib/state-intros';

export const dynamicParams = false;

export function generateStaticParams() {
  return US_STATES.map((s) => ({ state: s.slug }));
}

export function generateMetadata({ params }: { params: { state: string } }): Metadata {
  const s = getStateBySlug(params.state);
  if (!s) return {};
  return {
    // `absolute` keeps the title short — the global brand suffix would push
    // "Food Trucks in {State} — Top {N} Rated" over 60 chars on long names.
    title: { absolute: `Food Trucks in ${s.name} — ${s.count} Picks` },
    description: `Discover ${s.count} hand-picked food trucks across ${s.name}. Browse by city or cuisine and compare ratings, hours and locations. Updated weekly.`,
    alternates: { canonical: `/states/${s.slug}` },
    openGraph: {
      title: `Food Trucks in ${s.name}`,
      description: `${s.count} curated food trucks across ${s.name}.`,
      url: `/states/${s.slug}`,
      type: 'website',
    },
  };
}

export default function StatePage({ params }: { params: { state: string } }) {
  const summary = getStateBySlug(params.state);
  if (!summary) notFound();

  const allTrucks = getTrucksByState(params.state);
  const trucks = rankTrucks(allTrucks).slice(0, LISTING_PAGE_CAP);
  const totalTrucks = allTrucks.length;
  const truncated = totalTrucks > trucks.length;
  const featuredCount = allTrucks.filter((t) => t.featured).length;
  const avgRating =
    allTrucks.length > 0 ? allTrucks.reduce((s, t) => s + t.rating, 0) / allTrucks.length : 0;

  return (
    <>
      <section className="grain relative isolate overflow-hidden px-6 pb-12 pt-12 md:px-10 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
            <Link href="/" className="hover:text-ember">Home</Link>
            <span>/</span>
            <Link href="/states" className="hover:text-ember">States</Link>
            <span>/</span>
            <span className="text-ink">{summary.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div className="min-w-0">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">
                {summary.abbr} · The {summary.name} guide
              </span>
              <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,8.5rem)] font-black leading-[0.92] tracking-tightest">
                Food trucks
                <br />
                in <span className="italic text-ember">{summary.name}</span>.
              </h1>
            </div>
            <dl className="grid grid-cols-3 gap-2 md:gap-4">
              <Stat label="Listings" value={summary.count.toLocaleString()} />
              <Stat label="Featured" value={featuredCount.toLocaleString()} />
              <Stat label="Rating" value={avgRating.toFixed(1)} />
            </dl>
          </div>

          {STATE_INTROS[summary.slug] && (
            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-ink/75">
              {STATE_INTROS[summary.slug]}
            </p>
          )}

          {summary.topCities.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-ink/45">Top cities</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {summary.topCities.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/states/${summary.slug}/${c.slug}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream-50 px-4 py-2 text-sm font-bold transition-colors hover:border-ember hover:text-ember"
                    >
                      {c.name}
                      <span className="tabular text-xs text-ink/40 group-hover:text-ember/70">{c.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Directory"
            title={truncated ? `Top ${trucks.length} in ${summary.name}.` : `Every truck in ${summary.name}.`}
            description={
              truncated
                ? `Showing the top ${trucks.length} of ${totalTrucks.toLocaleString()} trucks. Drill into a city or cuisine to see the rest.`
                : undefined
            }
          />
          <div className="mt-10">
            <TruckListing trucks={trucks} allCuisines={summary.topCuisines.map((c) => ({ cuisine: c.cuisine, count: c.count }))} />
          </div>
          {truncated && (
            <div className="mt-16 rounded-3xl border border-dashed border-ink/15 bg-cream-50 p-8 text-center md:p-12">
              <h3 className="text-3xl font-black tracking-tightest md:text-4xl">
                {(totalTrucks - trucks.length).toLocaleString()} more trucks in {summary.name}.
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-base text-ink/65">
                Browse by city or cuisine to find what you&apos;re looking for.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {summary.topCities.slice(0, 6).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/states/${summary.slug}/${c.slug}`}
                    className="chip transition-colors hover:border-ember hover:text-ember"
                  >
                    {c.name} · {c.count}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <NearbyStates currentSlug={summary.slug} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-cream-50 px-3 py-3 md:px-5 md:py-4">
      <div className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-ink/40 md:text-xs md:tracking-[0.18em]">{label}</div>
      <div className="tabular mt-1 truncate text-2xl font-black tracking-tight md:text-4xl">{value}</div>
    </div>
  );
}

function NearbyStates({ currentSlug }: { currentSlug: string }) {
  const others = getAllStates()
    .filter((s) => s.slug !== currentSlug && s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  return (
    <section className="bg-cream-50 px-6 py-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Keep exploring" title="Other states." />
        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 md:grid-cols-4">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/states/${s.slug}`}
                className="group flex items-baseline justify-between gap-4 border-b border-ink/8 py-3 transition-colors hover:border-ember"
              >
                <span className="text-lg font-black tracking-tight transition-colors group-hover:text-ember">{s.name}</span>
                <span className="tabular text-xs text-ink/40">{s.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
