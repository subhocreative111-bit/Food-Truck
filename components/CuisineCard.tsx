import Link from 'next/link';
import type { CuisineSummary } from '@/lib/types';

const ICONS: Record<string, string> = {
  tacos: 'M3 14c2-5 7-7 9-7s7 2 9 7c-3 3-7 4-9 4s-6-1-9-4Z',
  bbq: 'M5 11h14M7 7h10l-2 4H9zM6 14h12l-1 5H7z',
  pizza: 'M12 3l9 16H3z',
  burgers: 'M4 10c0-3 4-5 8-5s8 2 8 5H4Zm0 4h16M5 18h14',
  asian: 'M5 6c0 6 6 10 7 10s7-4 7-10M4 18h16',
  coffee: 'M4 8h11v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm11 2h3a2 2 0 0 1 0 4h-3',
  seafood: 'M3 12c4-5 12-5 16 0-4 5-12 5-16 0Zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  vegan: 'M12 4c-5 4-7 9-3 13s9 1 13-3c-1-5-5-8-10-10Z',
  desserts: 'M4 10h16l-2 9H6zM8 10c0-3 2-5 4-5s4 2 4 5',
  mexican: 'M4 13c4-4 12-4 16 0-1 5-7 7-8 7s-7-2-8-7Z',
  italian: 'M4 12a8 8 0 0 1 16 0v6H4z',
  default: 'M5 5h14v14H5z',
};

function iconPath(slug: string) {
  for (const key of Object.keys(ICONS)) if (slug.includes(key)) return ICONS[key];
  return ICONS.default;
}

export default function CuisineCard({ cuisine }: { cuisine: CuisineSummary }) {
  return (
    <Link
      href={`/cuisines/${cuisine.slug}`}
      className="group relative flex flex-col gap-4 rounded-2xl border border-ink/10 bg-cream-50 p-6
                 transition-all duration-500 ease-editorial
                 hover:-translate-y-1 hover:border-ember hover:bg-cream hover:shadow-[0_24px_50px_-20px_rgba(200,70,58,0.3)]"
    >
      <span
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ember/10 text-ember
                   transition-all duration-500 ease-editorial group-hover:bg-ember group-hover:text-cream"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path d={iconPath(cuisine.slug)} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <h3 className="text-xl font-black tracking-tight">{cuisine.cuisine}</h3>
        <p className="tabular mt-1 text-sm text-ink/55">{cuisine.count} trucks</p>
      </div>
    </Link>
  );
}
