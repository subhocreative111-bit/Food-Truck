'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/states/california', label: 'States' },
  { href: '/cuisines', label: 'Cuisines' },
  { href: '/search', label: 'Search' },
  { href: '/list-your-truck', label: 'For Owners' },
  { href: '/about', label: 'About' },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      data-scrolled={scrolled}
      className="site-nav sticky top-0 z-50 w-full px-6 py-5 transition-all duration-300 ease-editorial md:px-10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-ember text-cream
                       transition-transform duration-500 ease-editorial group-hover:rotate-[-8deg]"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M3 11h13l-1.5-4H4.5L3 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M16 11h3l2 3v3h-2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 14h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-lg font-black leading-none tracking-tight">
            FoodTrucks<span className="text-ember">.</span>
            <span className="text-ink/50">NearMeUSA</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="relative text-sm font-bold tracking-wide text-ink/80 transition-colors hover:text-ink
                           after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-ember
                           after:transition-all after:duration-500 after:ease-editorial hover:after:w-full"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15
                       text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link href="/list-your-truck" className="btn-primary px-5 py-2.5 text-sm">
            List your truck
          </Link>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mt-4 rounded-2xl border border-ink/10 bg-cream-50 p-5 md:hidden">
          <ul className="space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-lg font-bold text-ink/80 transition-colors hover:text-ember"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/list-your-truck" onClick={() => setOpen(false)} className="btn-primary mt-5 w-full">
            List your truck
          </Link>
        </div>
      )}
    </nav>
  );
}
