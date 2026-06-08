// Hero used to be a client component for framer-motion fade-in animations.
// Those animations were holding LCP elements at opacity:0 until React
// hydrated (3-5 s on throttled mobile), which tanked the Lighthouse mobile
// score. Removing framer-motion lets Hero render server-side, ships ~30 KB
// less JS to the client, and removes the LCP block.
import { ArrowDown } from 'lucide-react';
import SearchBar from './SearchBar';

interface Props {
  cities: { name: string; state: string; stateSlug: string; slug: string }[];
  cuisines: { cuisine: string; slug: string }[];
  popularCuisines: { cuisine: string; slug: string }[];
  totalTrucks: number;
  totalStates: number;
}

export default function Hero({ cities, cuisines, popularCuisines, totalTrucks, totalStates }: Props) {
  return (
    <section className="grain relative isolate overflow-hidden px-6 pb-20 pt-12 md:px-10 md:pb-32 md:pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-end">
        <div>
          {/* These three elements (eyebrow, h1, description) form the above-the-fold
              content that's likely the LCP target on mobile. Plain HTML rather
              than motion components so they paint immediately rather than being
              held at opacity:0 until React hydrates the framer-motion animation. */}
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-ember">
            <span className="inline-block h-px w-10 bg-ember" />
            America&apos;s curated mobile-eats directory
          </div>

          <h1 className="mt-6 break-words text-[clamp(3rem,12vw,8.5rem)] font-black leading-[0.92] tracking-tightest text-ink">
            Eat where the
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 italic text-ember">locals</span>
              <span className="absolute inset-x-0 bottom-2 z-0 h-3 bg-saffron/70 md:h-5" aria-hidden />
            </span>{' '}
            do.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/70 md:text-xl">
            A hand-curated directory of <strong className="font-bold text-ink">{totalTrucks.toLocaleString()}</strong> independent
            food trucks, taco stands, and roadside eateries across all{' '}
            <strong className="font-bold text-ink">{totalStates}</strong> states.
          </p>

          <div className="mt-10">
            <SearchBar
              cities={cities}
              cuisines={cuisines}
              placeholder="Try &ldquo;Austin tacos&rdquo; or &ldquo;Brooklyn BBQ&rdquo;"
            />
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink/50">
              <span className="font-bold uppercase tracking-wider">Popular:</span>
              {popularCuisines.slice(0, 6).map((c) => (
                <a
                  key={c.slug}
                  href={`/cuisines/${c.slug}/`}
                  className="rounded-full border border-ink/12 px-3 py-1 font-bold text-ink/70 transition-colors hover:border-ember hover:text-ember"
                >
                  {c.cuisine}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: stacked stats + image */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-ink/10 bg-cream-100">
            {/* Responsive srcset so mobile gets a 600px image (~50 KB) instead
                of the desktop 1000px image (~150 KB). Saves ~100 KB on the
                LCP fetch over throttled mobile networks. fetchPriority="high"
                tells the browser to prioritise this download over other assets. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1683508700255-f9b09a11f687?w=1000&q=70&auto=format&fit=crop"
              srcSet="https://images.unsplash.com/photo-1683508700255-f9b09a11f687?w=600&q=65&auto=format&fit=crop 600w, https://images.unsplash.com/photo-1683508700255-f9b09a11f687?w=1000&q=70&auto=format&fit=crop 1000w"
              sizes="(max-width: 1024px) 100vw, 40vw"
              alt="Customers gathered at a food truck at sunset"
              fetchPriority="high"
              decoding="async"
              width={1000}
              height={1250}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <div className="tabular text-5xl font-black leading-none text-cream md:text-6xl">
                  {totalTrucks.toLocaleString()}
                </div>
                <div className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-cream/85">
                  Trucks indexed
                </div>
              </div>
              <div className="text-right">
                <div className="tabular text-5xl font-black leading-none text-cream md:text-6xl">{totalStates}</div>
                <div className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-cream/85">States</div>
              </div>
            </div>
          </div>

          <div
            className="absolute -left-6 top-10 hidden rotate-[-6deg] rounded-2xl border border-ink/10 bg-cream px-4 py-3 shadow-[0_20px_40px_-20px_rgba(26,22,20,0.3)] md:flex"
          >
            <div className="flex items-center gap-3">
              <span className="featured-pill">Featured</span>
              <span className="text-sm font-bold">Open now near you</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 hidden max-w-7xl items-center justify-between text-xs font-black uppercase tracking-[0.22em] text-ink/45 md:flex">
        <span>Scroll to explore</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
        <span>Eat well &middot; est. 2026</span>
      </div>
    </section>
  );
}
