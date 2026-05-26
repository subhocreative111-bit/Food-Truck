'use client';

import Link from 'next/link';
import { useState } from 'react';
import { US_STATES } from '@/lib/states';

/**
 * Hand-built compact "state grid" map — not geographically accurate, but
 * visually distinctive, fully clickable, and zero external dependencies.
 * Each state gets a 1×1 square laid out in a recognizable US silhouette.
 */
const GRID: (string | null)[][] = [
  // 11 cols × 8 rows
  [null,  null,  null,  null,  null,  null,  null,  null,  null,  null,  'ME'],
  [null,  'WA',  null,  'MT',  'ND',  'MN',  null,  'WI',  null,  'VT', 'NH'],
  [null,  'OR',  'ID',  'WY',  'SD',  'IA',  'IL',  'MI',  'OH',  'NY', 'MA'],
  [null,  'CA',  'NV',  'UT',  'CO',  'NE',  'MO',  'IN',  'PA',  'NJ', 'CT'],
  [null,  null,  null,  'AZ',  'NM',  'KS',  'AR',  'KY',  'WV',  'DE', 'RI'],
  ['AK',  null,  null,  null,  'TX',  'OK',  'LA',  'TN',  'VA',  'MD', null],
  [null,  null,  null,  null,  null,  null,  'MS',  'AL',  'NC',  null, null],
  ['HI',  null,  null,  null,  null,  null,  null,  'GA',  'SC',  'FL', null],
];

const ABBR_TO_STATE = Object.fromEntries(US_STATES.map((s) => [s.abbr, s]));

export default function StateMap({ counts }: { counts: Record<string, number> }) {
  const [hover, setHover] = useState<string | null>(null);
  const hoveredState = hover ? ABBR_TO_STATE[hover] : null;

  return (
    <div className="relative">
      <div className="grid grid-cols-11 gap-1.5 md:gap-2">
        {GRID.flat().map((abbr, i) => {
          if (!abbr) return <div key={`empty-${i}`} aria-hidden />;
          const state = ABBR_TO_STATE[abbr];
          if (!state) return <div key={`bad-${abbr}-${i}`} aria-hidden />;
          const c = counts[state.slug] ?? 0;
          const intensity = Math.min(1, c / 25);
          return (
            <Link
              key={`${abbr}-${i}`}
              href={`/states/${state.slug}`}
              onMouseEnter={() => setHover(abbr)}
              onMouseLeave={() => setHover((h) => (h === abbr ? null : h))}
              className="group relative aspect-square overflow-hidden rounded-md border border-ink/10
                         transition-all duration-300 ease-editorial
                         hover:scale-105 hover:border-ember hover:shadow-[0_10px_30px_-10px_rgba(200,70,58,0.6)]"
              style={{
                backgroundColor: `rgba(200, 70, 58, ${0.08 + intensity * 0.65})`,
              }}
              aria-label={`${state.name}: ${c} trucks`}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-tight text-ink/85 transition-colors group-hover:text-cream md:text-xs">
                {abbr}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 text-xs text-ink/55">
          <span className="font-bold uppercase tracking-wider text-ink/45">Truck density</span>
          <div className="flex h-2 w-32 overflow-hidden rounded-full">
            {[0.12, 0.28, 0.45, 0.62, 0.85].map((v) => (
              <span key={v} className="flex-1" style={{ backgroundColor: `rgba(200, 70, 58, ${v})` }} />
            ))}
          </div>
        </div>
        <div className="min-h-[2.25rem] text-sm">
          {hoveredState ? (
            <span className="tabular">
              <span className="font-black tracking-tight">{hoveredState.name}</span>
              <span className="mx-2 text-ink/30">·</span>
              <span className="text-ink/65">{counts[hoveredState.slug] ?? 0} trucks</span>
            </span>
          ) : (
            <span className="text-ink/40">Hover a state</span>
          )}
        </div>
      </div>
    </div>
  );
}
