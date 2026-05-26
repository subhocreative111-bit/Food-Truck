'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface Filters {
  cuisines: Set<string>;
  minRating: number;
  openNow: boolean;
}

interface Props {
  allCuisines: { cuisine: string; count: number }[];
  filters: Filters;
  onChange: (next: Filters) => void;
}

export default function FilterSidebar({ allCuisines, filters, onChange }: Props) {
  const [openSections, setOpenSections] = useState({ cuisine: true, rating: true, status: true });
  const visibleCuisines = useMemo(() => allCuisines.slice(0, 14), [allCuisines]);

  const toggleCuisine = (c: string) => {
    const next = new Set(filters.cuisines);
    if (next.has(c)) next.delete(c); else next.add(c);
    onChange({ ...filters, cuisines: next });
  };

  const Section = ({ id, title, children }: { id: keyof typeof openSections; title: string; children: React.ReactNode }) => (
    <div className="border-b border-ink/8 py-5 last:border-b-0">
      <button
        className="flex w-full items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-ink/55"
        onClick={() => setOpenSections((s) => ({ ...s, [id]: !s[id] }))}
      >
        {title}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${openSections[id] ? 'rotate-0' : '-rotate-90'}`}
        />
      </button>
      {openSections[id] && <div className="mt-4">{children}</div>}
    </div>
  );

  return (
    <aside className="sticky top-24 h-fit rounded-2xl border border-ink/10 bg-cream-50 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.18em]">Filters</h3>
        <button
          onClick={() => onChange({ cuisines: new Set(), minRating: 0, openNow: false })}
          className="text-xs font-bold text-ember hover:underline"
        >
          Clear
        </button>
      </div>

      <Section id="cuisine" title="Cuisine">
        <ul className="space-y-2.5">
          {visibleCuisines.map((c) => (
            <li key={c.cuisine}>
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={filters.cuisines.has(c.cuisine)}
                    onChange={() => toggleCuisine(c.cuisine)}
                  />
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-ink/25
                                   peer-checked:border-ember peer-checked:bg-ember">
                    {filters.cuisines.has(c.cuisine) && (
                      <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 text-cream"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </span>
                  <span className="text-sm font-medium text-ink/85">{c.cuisine}</span>
                </span>
                <span className="tabular text-xs text-ink/40">{c.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="rating" title="Minimum rating">
        <div className="flex flex-wrap gap-2">
          {[0, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, minRating: r })}
              className={`tabular rounded-full border px-3 py-1.5 text-xs font-bold transition-colors
                          ${filters.minRating === r
                            ? 'border-ember bg-ember text-cream'
                            : 'border-ink/15 text-ink/75 hover:border-ink'}`}
            >
              {r === 0 ? 'Any' : `${r.toFixed(1)}+`}
            </button>
          ))}
        </div>
      </Section>

      <Section id="status" title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={filters.openNow}
            onChange={() => onChange({ ...filters, openNow: !filters.openNow })}
          />
          <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-ink/25
                           peer-checked:border-ember peer-checked:bg-ember">
            {filters.openNow && (
              <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 text-cream"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
          <span className="text-sm font-medium text-ink/85">Open now</span>
        </label>
      </Section>
    </aside>
  );
}
