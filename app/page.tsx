import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import TruckCard from '@/components/TruckCard';
import SectionHeader from '@/components/SectionHeader';
import StateMap from '@/components/StateMap';
import CityCard from '@/components/CityCard';
import CuisineCard from '@/components/CuisineCard';
import Marquee from '@/components/Marquee';
import SpotlightCard from '@/components/SpotlightCard';
import {
  getAllCities,
  getAllCuisines,
  getAllStates,
  getFeaturedTrucks,
  getPopularCities,
  getRecentTrucks,
} from '@/lib/data';
import { US_STATES } from '@/lib/states';

export const metadata: Metadata = {
  // Title and description come from the root layout's defaults.
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const cities = getAllCities();
  const cuisines = getAllCuisines();
  const featured = getFeaturedTrucks(7);
  const recent = getRecentTrucks(10);
  const popularCities = getPopularCities(12);
  const states = getAllStates();
  const totalTrucks = states.reduce((s, st) => s + st.count, 0);

  const stateCounts: Record<string, number> = Object.fromEntries(states.map((s) => [s.slug, s.count]));

  return (
    <>
      {/* Preload the hero LCP image (the AVIF set served by <picture> in
          Hero.tsx). type + imageSrcSet + imageSizes MUST match the <source>
          there byte-for-byte so the browser dedupes them into one fetch —
          a mismatch makes the preload a wasted second download. Starts the
          fetch at HTML parse. Homepage-only — truck / state / blog pages
          have their own LCP elements. */}
      <link
        rel="preload"
        as="image"
        type="image/avif"
        imageSrcSet="/hero/hero-640.avif 640w, /hero/hero-960.avif 960w, /hero/hero-1280.avif 1280w"
        imageSizes="(max-width: 1024px) calc(100vw - 48px), 40vw"
        fetchPriority="high"
      />
      <Hero
        cities={cities}
        cuisines={cuisines.map((c) => ({ cuisine: c.cuisine, slug: c.slug }))}
        popularCuisines={cuisines.slice(0, 6).map((c) => ({ cuisine: c.cuisine, slug: c.slug }))}
        totalTrucks={totalTrucks}
        totalStates={US_STATES.length}
      />

      <Marquee
        items={[
          'Tacos al pastor',
          'Brisket',
          'Banh mi',
          'Wood-fired pizza',
          'Korean fried chicken',
          'Lobster rolls',
          'Birria',
          'Soft serve',
          'Cuban sandwiches',
          'Smash burgers',
        ]}
      />

      {/* Featured — editorial asymmetric grid */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Featured this week"
            title="Trucks the editors are eating from."
            description="A rotating set of independently-run rigs chosen for craft, consistency, and the way the line moves."
            href="/search"
            hrefLabel="Browse all"
          />

          {featured.length > 0 && (
            <SpotlightCard className="mt-14 grid gap-6 rounded-3xl p-2 md:grid-cols-12">
              {/* Hero: span 7 cols, tall */}
              <div className="md:col-span-7">
                <TruckCard truck={featured[0]} variant="tall" />
              </div>
              {/* Right rail */}
              <div className="grid grid-rows-2 gap-6 md:col-span-5">
                {featured.slice(1, 3).map((t, i) => (
                  <TruckCard key={t.slug} truck={t} variant="list" index={i + 1} />
                ))}
              </div>
              {/* Lower row: 4 in a row */}
              {featured.slice(3, 7).map((t, i) => (
                <div key={t.slug} className="md:col-span-3">
                  <TruckCard truck={t} index={i + 3} />
                </div>
              ))}
            </SpotlightCard>
          )}
        </div>
      </section>

      {/* Popular cities */}
      <section className="bg-cream-50 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Cities"
            title="Where to start."
            description="Big metro lines and small-town gems alike. Pick a city, find your next favorite."
          />
          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {popularCities.map((c, i) => (
              <CityCard key={`${c.stateSlug}-${c.slug}`} city={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* USA map */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="50-state coverage"
            title="The whole map. Hand-mapped."
            description="From Birmingham to Boise, every state has its own page with the local trucks worth tracking down."
          />
          <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <StateMap counts={stateCounts} />
            <div className="rounded-3xl border border-ink/10 bg-cream-50 p-8">
              <h3 className="text-2xl font-black tracking-tight">Top states by truck count</h3>
              <ul className="mt-6 space-y-2">
                {[...states].sort((a, b) => b.count - a.count).slice(0, 10).map((s, i) => (
                  <li key={s.slug}>
                    <Link
                      href={`/states/${s.slug}`}
                      className="group flex items-baseline justify-between gap-4 border-b border-ink/8 py-3
                                 transition-colors hover:border-ember"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="tabular w-6 text-xs font-black text-ink/40">{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-lg font-black tracking-tight transition-colors group-hover:text-ember">
                          {s.name}
                        </span>
                      </span>
                      <span className="tabular text-sm font-bold text-ink/55">{s.count.toLocaleString()}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisines */}
      <section className="bg-cream-50 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Cuisines"
            title="Browse by what you're craving."
            href="/cuisines"
            hrefLabel="All cuisines"
          />
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cuisines.slice(0, 12).map((c) => (
              <CuisineCard key={c.slug} cuisine={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently added rail */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Fresh listings"
            title="Recently added."
            description="The newest trucks indexed across the country."
            href="/search"
            hrefLabel="Browse all"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {recent.map((t, i) => (
              <TruckCard key={t.slug} truck={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-ink px-8 py-16 text-cream md:px-16 md:py-24">
            <div className="grid items-end gap-12 md:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.22em] text-saffron">For owners</span>
                <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-tightest md:text-7xl">
                  Run a truck?
                  <br />
                  Get found.
                </h2>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/70 md:text-lg">
                  Claim your free listing or upgrade to Featured for priority placement, premium photography slots,
                  and weekly traffic analytics.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/list-your-truck" className="btn-primary text-base">
                  Get listed — free
                </Link>
                <Link
                  href="/list-your-truck#featured"
                  className="inline-flex items-center justify-center rounded-full border border-cream/30 px-7 py-4 font-bold text-cream transition-all hover:border-saffron hover:text-saffron"
                >
                  Compare plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
