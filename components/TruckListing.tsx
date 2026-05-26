'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import TruckCard from './TruckCard';
import FilterSidebar, { Filters } from './FilterSidebar';
import type { Truck } from '@/lib/types';
import { isOpenNow } from '@/lib/hours';

interface Props {
  trucks: Truck[];
  allCuisines: { cuisine: string; count: number }[];
}

type Sort = 'featured' | 'rating' | 'reviews' | 'az';

export default function TruckListing({ trucks, allCuisines }: Props) {
  const [filters, setFilters] = useState<Filters>({ cuisines: new Set(), minRating: 0, openNow: false });
  const [sort, setSort] = useState<Sort>('featured');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = trucks.filter((t) => {
      if (filters.minRating > 0 && t.rating < filters.minRating) return false;
      if (filters.cuisines.size > 0 && !t.cuisine.some((c) => filters.cuisines.has(c))) return false;
      if (filters.openNow && !isOpenNow(t.hours)) return false;
      return true;
    });
    if (sort === 'featured') {
      list = [...list].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.rating - a.rating);
    } else if (sort === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sort === 'reviews') {
      list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [trucks, filters, sort]);

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <div className={`${open ? 'fixed inset-0 z-50 overflow-y-auto bg-cream/95 p-6 backdrop-blur lg:static lg:bg-transparent lg:p-0' : 'hidden lg:block'}`}>
        {open && (
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <h3 className="text-lg font-black">Filters</h3>
            <button onClick={() => setOpen(false)} className="text-sm font-bold text-ember">Done</button>
          </div>
        )}
        <FilterSidebar allCuisines={allCuisines} filters={filters} onChange={setFilters} />
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="tabular text-sm text-ink/55">
            <span className="font-black text-ink">{filtered.length}</span> of {trucks.length} trucks
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-bold lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
            <label className="text-xs font-bold uppercase tracking-wider text-ink/45">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="cursor-pointer rounded-full border border-ink/15 bg-cream px-3 py-1.5 text-xs font-bold text-ink focus:border-ember focus:outline-none"
            >
              <option value="featured">Featured first</option>
              <option value="rating">Highest rating</option>
              <option value="reviews">Most reviewed</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-ink/15 p-12 text-center">
            <h3 className="text-2xl font-black">No matches</h3>
            <p className="mt-2 text-sm text-ink/55">Try clearing a filter or broadening your rating threshold.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((t, i) => (
              <TruckCard key={t.slug} truck={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
