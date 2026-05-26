'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, UtensilsCrossed } from 'lucide-react';
import { US_STATES } from '@/lib/states';

interface SearchOption {
  label: string;
  sub: string;
  href: string;
  kind: 'state' | 'city' | 'cuisine';
}

interface Props {
  cities: { name: string; state: string; stateSlug: string; slug: string }[];
  cuisines: { cuisine: string; slug: string }[];
  size?: 'hero' | 'compact';
  placeholder?: string;
}

export default function SearchBar({ cities, cuisines, size = 'hero', placeholder }: Props) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const options = useMemo<SearchOption[]>(() => {
    const base: SearchOption[] = [
      ...US_STATES.map<SearchOption>((s) => ({
        label: s.name,
        sub: `State · ${s.abbr}`,
        href: `/states/${s.slug}`,
        kind: 'state',
      })),
      ...cities.map<SearchOption>((c) => ({
        label: c.name,
        sub: `City · ${c.state}`,
        href: `/states/${c.stateSlug}/${c.slug}`,
        kind: 'city',
      })),
      ...cuisines.map<SearchOption>((c) => ({
        label: c.cuisine,
        sub: 'Cuisine',
        href: `/cuisines/${c.slug}`,
        kind: 'cuisine',
      })),
    ];
    if (!q.trim()) return [];
    const needle = q.trim().toLowerCase();
    return base
      .filter((o) => o.label.toLowerCase().includes(needle))
      .sort((a, b) => {
        const ai = a.label.toLowerCase().indexOf(needle);
        const bi = b.label.toLowerCase().indexOf(needle);
        return ai - bi;
      })
      .slice(0, 8);
  }, [q, cities, cuisines]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const submit = () => {
    if (options[active]) {
      router.push(options[active].href);
    } else if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const isHero = size === 'hero';

  return (
    <div ref={ref} className="relative w-full">
      <div
        className={`group relative flex items-center gap-3 rounded-full border border-ink/15 bg-cream
                    transition-all duration-300 ease-editorial
                    focus-within:border-ember focus-within:shadow-[0_28px_60px_-22px_rgba(200,70,58,0.45)]
                    ${isHero ? 'px-6 py-3 md:px-8 md:py-4' : 'px-4 py-2.5'}`}
      >
        <Search className={`shrink-0 text-ink/50 ${isHero ? 'h-5 w-5 md:h-6 md:w-6' : 'h-4 w-4'}`} />
        <input
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, options.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              submit();
              setOpen(false);
            }
          }}
          placeholder={placeholder ?? 'Search cities, states, or cuisines'}
          className={`w-full bg-transparent text-ink placeholder:text-ink/35 focus:outline-none
                      ${isHero ? 'text-base md:text-lg font-medium' : 'text-sm'}`}
        />
        <button
          onClick={submit}
          className={`btn-primary shrink-0 ${isHero ? 'px-6 py-3 text-sm md:px-7 md:py-3.5' : 'px-4 py-2 text-xs'}`}
        >
          Search
        </button>
      </div>

      {open && options.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-ink/10
                     bg-cream shadow-[0_30px_60px_-20px_rgba(26,22,20,0.25)] backdrop-blur"
          role="listbox"
        >
          {options.map((o, i) => (
            <li
              key={`${o.kind}-${o.label}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                router.push(o.href);
                setOpen(false);
              }}
              className={`flex cursor-pointer items-center gap-3 px-5 py-3 text-sm transition-colors
                          ${i === active ? 'bg-ember-50 text-ember' : 'text-ink/85 hover:bg-cream-50'}`}
            >
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full
                                ${o.kind === 'cuisine' ? 'bg-saffron/25 text-saffron-700' : 'bg-ink/8 text-ink/65'}`}>
                {o.kind === 'cuisine' ? <UtensilsCrossed className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
              </span>
              <span className="flex-1">
                <span className="font-bold">{o.label}</span>
                <span className="ml-2 text-xs uppercase tracking-wider text-ink/40">{o.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
