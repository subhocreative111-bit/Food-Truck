import type { Metadata } from 'next';
import CuisineCard from '@/components/CuisineCard';
import { getAllCuisines } from '@/lib/data';

export const metadata: Metadata = {
  title: 'All cuisines',
  description: 'Browse food trucks by cuisine — tacos, BBQ, vegan, coffee and more.',
};

export default function CuisinesIndex() {
  const cuisines = getAllCuisines();
  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Cuisines</span>
        <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,7.5rem)] font-black leading-[0.92] tracking-tightest">What you're craving.</h1>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {cuisines.map((c) => (
            <CuisineCard key={c.slug} cuisine={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
