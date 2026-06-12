import type { Metadata } from 'next';
import Link from 'next/link';
import SearchClient from './SearchClient';
import { getAllCities, getAllCuisines, getAllStates } from '@/lib/data';
import { STATE_BY_NAME } from '@/lib/states';

/**
 * /search/ is Google's preferred candidate for the "food trucks near me"
 * query cluster (GSC, Jun 2026) — but the interactive search UI lives behind
 * a Suspense boundary (useSearchParams + static export), so the exported
 * HTML used to contain nothing but the fallback. Everything SEO-relevant
 * (h1, intro, popular city/cuisine links) is server-rendered here; the
 * client component only renders the search box and results.
 */

export function generateMetadata(): Metadata {
  const total = getAllStates().reduce((s, st) => s + st.count, 0);
  return {
    title: { absolute: `Find Food Trucks Near You — Search ${total.toLocaleString()} Trucks` },
    description: `Search ${total.toLocaleString()} independent food trucks across all 50 states by name, city, state or cuisine — hand-curated listings with real ratings, hours and locations.`,
    alternates: { canonical: '/search' },
  };
}

export default function SearchPage() {
  const totalTrucks = getAllStates().reduce((s, st) => s + st.count, 0);
  const popularCities = [...getAllCities()].sort((a, b) => b.count - a.count).slice(0, 16);
  const cuisines = getAllCuisines();
  const topCuisines = [...cuisines].sort((a, b) => b.count - a.count).slice(0, 12);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://foodtrucksnearmeusa.com/' },
      { '@type': 'ListItem', position: 2, name: 'Search', item: 'https://foodtrucksnearmeusa.com/search/' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Server-rendered heading + intro: present in the static HTML. */}
      <section className="px-6 pt-12 md:px-10 md:pt-16">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Search</span>
          <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,7.5rem)] font-black leading-[0.92] tracking-tightest">
            Find food trucks <span className="italic text-ember">near you</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink/55 md:text-lg">
            Search <span className="tabular font-black text-ink">{totalTrucks.toLocaleString()}</span> independent
            food trucks across all 50 states — by name, city, state, or cuisine. Every listing is hand-curated:
            real ratings, real hours, real locations.
          </p>
        </div>
      </section>

      {/* Interactive search (client-side; hydrates after load) */}
      <SearchClient
        allCuisines={cuisines.map((c) => ({ cuisine: c.cuisine, count: c.count }))}
      />

      {/* Server-rendered browse paths: crawlable internal links that exist
          even before the search index hydrates. */}
      <section className="bg-cream-50 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— No search needed</span>
          <h2 className="mt-4 text-[clamp(1.75rem,5vw,3rem)] font-black leading-tight tracking-tightest">
            Or browse the busiest food truck cities.
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularCities.map((c) => (
              <li key={`${c.stateSlug}/${c.slug}`}>
                <Link
                  href={`/states/${c.stateSlug}/${c.slug}/`}
                  className="group flex items-baseline justify-between gap-2 rounded-2xl border border-ink/10 bg-cream px-4 py-3 transition-colors hover:border-ember"
                >
                  <span className="min-w-0 truncate text-sm font-black tracking-tight transition-colors group-hover:text-ember">
                    {c.name}, {STATE_BY_NAME[c.state]?.abbr ?? c.state}
                  </span>
                  <span className="tabular shrink-0 text-xs font-bold text-ink/45">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="mt-16 text-[clamp(1.5rem,4vw,2.25rem)] font-black leading-tight tracking-tightest">
            Or by what you&apos;re craving.
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {topCuisines.map((c) => (
              <li key={c.slug}>
                <Link href={`/cuisines/${c.slug}/`} className="chip transition-colors hover:border-ember hover:text-ember">
                  {c.cuisine} <span className="tabular ml-1 text-ink/45">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-saffron/40 bg-saffron/10 p-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black tracking-tight">Planning an event?</h2>
              <p className="mt-2 max-w-xl text-sm text-ink/65">
                Weddings, office lunches, parties — tell us about your event and we&apos;ll match you with
                available local trucks. Free, no obligation.
              </p>
            </div>
            <Link href="/catering/" className="btn-primary shrink-0 text-sm">
              Get catering quotes
            </Link>
          </div>

          <p className="mt-12 text-sm text-ink/55">
            Prefer the long way around? Browse the{' '}
            <Link href="/states/" className="font-bold text-ember underline-offset-4 hover:underline">
              full state-by-state directory
            </Link>{' '}
            — all 50 states, every city we cover.
          </p>
        </div>
      </section>
    </>
  );
}
