import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllStates } from '@/lib/data';

export const metadata: Metadata = {
  title: 'All 50 States — Food Truck Directory',
  description: 'Browse food trucks by US state. All 50 states covered.',
};

export default function StatesIndex() {
  const states = getAllStates();
  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— 50 states</span>
        <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,7.5rem)] font-black leading-[0.92] tracking-tightest">All states.</h1>
        <p className="mt-6 max-w-xl text-lg text-ink/65">
          Every state has its own directory page with cities, cuisines, and the trucks worth seeking out.
        </p>

        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/states/${s.slug}`}
                className="group flex items-baseline justify-between gap-4 border-b border-ink/8 py-4 transition-colors hover:border-ember"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-2xl font-black tracking-tight transition-colors group-hover:text-ember">
                    {s.name}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-ink/40">{s.abbr}</span>
                </span>
                <span className="tabular text-sm font-bold text-ink/55">{s.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
