import Link from 'next/link';
import { US_STATES } from '@/lib/states';

const FOOTER_COLS = [
  {
    title: 'Discover',
    links: [
      { href: '/states/california', label: 'Browse states' },
      { href: '/cuisines', label: 'Browse cuisines' },
      { href: '/search', label: 'Search trucks' },
    ],
  },
  {
    title: 'Run a truck?',
    links: [
      { href: '/list-your-truck', label: 'Get listed' },
      { href: '/list-your-truck#featured', label: 'Featured listing' },
      { href: '/contact', label: 'Claim a listing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/blog', label: 'Field notes' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-ink/10 bg-cream-50 px-6 pb-12 pt-20 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-ember text-cream">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M3 11h13l-1.5-4H4.5L3 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M16 11h3l2 3v3h-2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <span className="text-lg font-black tracking-tight">FoodTrucksNearMeUSA</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/65">
            A hand-curated directory of independent food trucks, taco stands and roadside eateries across all 50
            states. Built for hungry locals and curious travelers.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-ink/40">
            &copy; {new Date().getFullYear()} FoodTrucksNearMeUSA
          </p>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ink/45">{col.title}</h4>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink/80 transition-colors hover:text-ember">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-7xl">
        <div className="editorial-rule" />
        <h4 className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-ink/45">All 50 states</h4>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {US_STATES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/states/${s.slug}`}
                className="group flex items-baseline gap-2 text-sm text-ink/75 transition-colors hover:text-ember"
              >
                <span className="font-bold tracking-tight">{s.name}</span>
                <span className="text-[10px] uppercase tracking-widest text-ink/35 transition-colors group-hover:text-ember/60">
                  {s.abbr}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col gap-3 text-xs uppercase tracking-[0.18em] text-ink/40 sm:flex-row sm:items-center sm:justify-between">
        <p>Eat local, eat well.</p>
        <ul className="flex gap-6">
          <li><Link href="/about">Privacy</Link></li>
          <li><Link href="/about">Terms</Link></li>
          <li><Link href="/contact">Press</Link></li>
        </ul>
      </div>
    </footer>
  );
}
