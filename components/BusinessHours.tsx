'use client';

import { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import type { Hours } from '@/lib/types';
import { DAY_LABELS, getTodayKey, isOpenNow } from '@/lib/hours';

const ORDER: (keyof Hours)[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export default function BusinessHours({ hours }: { hours?: Hours }) {
  const [open, setOpen] = useState(false);
  const today = getTodayKey();
  const openNow = isOpenNow(hours);
  const todayStr = hours?.[today] ?? 'Hours unavailable';

  return (
    <div className="rounded-2xl border border-ink/10 bg-cream-50">
      <button
        className="flex w-full items-center justify-between gap-3 px-5 py-4"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full
                            ${openNow ? 'bg-ember/15 text-ember' : 'bg-ink/8 text-ink/55'}`}>
            <Clock className="h-4 w-4" />
          </span>
          <span className="flex flex-col items-start text-left">
            <span className={`text-sm font-black uppercase tracking-[0.18em] ${openNow ? 'text-ember' : 'text-ink/55'}`}>
              {openNow ? 'Open now' : 'Closed now'}
            </span>
            <span className="tabular text-xs text-ink/60">{todayStr}</span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-ink/55 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul className="border-t border-ink/8 px-5 py-4">
          {ORDER.map((d) => {
            const v = hours?.[d];
            const isToday = d === today;
            return (
              <li
                key={d}
                className={`flex items-center justify-between py-1.5 text-sm
                            ${isToday ? 'font-black text-ink' : 'font-medium text-ink/65'}`}
              >
                <span>{DAY_LABELS[d]}</span>
                <span className="tabular">{v ?? '—'}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
