'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import RatingDots from '@/components/RatingDots';

/** Compact row format from /search-index.json v2 — see scripts/build-search-index.ts */
interface SearchPayload {
  v: 2;
  p: string[];   // photo URL pool
  s: string[];   // state name pool
  ss: string[];  // state slug pool
  cu: string[];  // cuisine pool
  r: SearchTuple[];
}
type SearchTuple = [
  slug: string,
  name: string,
  city: string,
  citySlug: string,
  stateSlugIdx: number,
  stateIdx: number,
  cuisineIdx: number,
  photoIdx: number,
  rating10: number,  // rating × 10
  reviewCount: number,
  featured: 0 | 1,
  hasPage: 0 | 1,
  lat4: number,  // lat × 1e4
  lng4: number,
];

interface SearchRow {
  s: string; n: string; c: string; cs: string; st: string; ss: string;
  cu: string; r: number; rc: number; p: string; f: 0 | 1; h: 0 | 1;
  la?: number; lo?: number;
}

interface Props {
  allCuisines: { cuisine: string; count: number }[];
}

const PAGE_SIZE = 30;

function mapsHref(row: SearchRow): string {
  const q = encodeURIComponent(`${row.n} ${row.c} ${row.st}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function SearchInner({ allCuisines: _allCuisines }: Props) {
  const params = useSearchParams();
  const initial = params?.get('q') ?? '';
  const [q, setQ] = useState(initial);
  const [index, setIndex] = useState<SearchRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((payload: SearchPayload) => {
        if (cancelled) return;
        // Expand the compact tuple format into full SearchRow objects on the client.
        const rows: SearchRow[] = payload.r.map((t) => ({
          s: t[0],
          n: t[1],
          c: t[2],
          cs: t[3],
          ss: payload.ss[t[4]],
          st: payload.s[t[5]],
          cu: payload.cu[t[6]],
          p: payload.p[t[7]],
          r: t[8] / 10,
          rc: t[9],
          f: t[10],
          h: t[11],
          la: t[12] / 1e4,
          lo: t[13] / 1e4,
        }));
        setIndex(rows);
      })
      .catch(() => { if (!cancelled) setIndex([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!index) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) {
      // Default view: featured + top-rated, capped
      return [...index]
        .sort((a, b) => b.f - a.f || b.r - a.r || b.rc - a.rc)
        .slice(0, 200);
    }
    const out: SearchRow[] = [];
    for (let i = 0; i < index.length; i++) {
      const t = index[i];
      if (
        t.n.toLowerCase().includes(needle) ||
        t.c.toLowerCase().includes(needle) ||
        t.st.toLowerCase().includes(needle) ||
        t.cu.toLowerCase().includes(needle)
      ) {
        out.push(t);
        if (out.length >= 600) break; // hard cap on returned matches
      }
    }
    out.sort((a, b) => b.f - a.f || b.r - a.r || b.rc - a.rc);
    return out;
  }, [index, q]);

  useEffect(() => setVisibleCount(PAGE_SIZE), [q]);
  const visible = filtered.slice(0, visibleCount);

  return (
    <section className="px-6 pb-20 pt-12 md:px-10 md:pt-16">
      <div className="mx-auto max-w-7xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Search</span>
        <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,7.5rem)] font-black leading-[0.92] tracking-tightest">Find a truck.</h1>
        <p className="mt-4 max-w-2xl text-base text-ink/55 md:text-lg">
          Search across <span className="tabular font-black text-ink">{(index?.length ?? 0).toLocaleString()}</span> trucks in all 50 states.
        </p>

        <div className="mt-10 flex items-center gap-3 rounded-full border border-ink/15 bg-cream px-6 py-4 focus-within:border-ember">
          <SearchIcon className="h-5 w-5 text-ink/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
            placeholder="Truck name, city, state, or cuisine"
            className="w-full bg-transparent text-base font-medium text-ink placeholder:text-ink/35 focus:outline-none md:text-lg"
          />
          {loading && <Loader2 className="h-5 w-5 animate-spin text-ink/40" />}
          <span className="tabular hidden text-xs font-bold text-ink/45 md:inline">
            {filtered.length.toLocaleString()} results
          </span>
        </div>

        {loading && !index && (
          <div className="mt-20 text-center text-sm text-ink/50">Loading the index…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="mt-20 rounded-2xl border border-dashed border-ink/15 p-12 text-center">
            <h3 className="text-2xl font-black">No matches</h3>
            <p className="mt-2 text-sm text-ink/55">Try a city, state, or cuisine.</p>
          </div>
        )}

        {visible.length > 0 && (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((t, i) => (
              <SearchResultRow key={t.s} row={t} index={i} />
            ))}
          </ul>
        )}

        {filtered.length > visibleCount && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="btn-ghost"
            >
              Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function SearchResultRow({ row, index }: { row: SearchRow; index: number }) {
  const href = row.h ? `/truck/${row.s}/` : mapsHref(row);
  const external = !row.h;
  return (
    <li
      className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-cream-50 transition-all duration-500 ease-editorial
                 hover:border-ember hover:shadow-[0_24px_50px_-20px_rgba(200,70,58,0.25)]"
      style={{ animation: `rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(index, 8) * 0.03}s both` }}
    >
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="flex gap-4 p-4"
      >
        <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
          {row.p ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={row.p} alt={row.n} loading="lazy" className="zoom-img h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ember/10 text-[10px] font-black uppercase tracking-widest text-ember">
              {row.cu}
            </div>
          )}
          {row.f === 1 && <span className="featured-pill absolute left-1.5 top-1.5 scale-75 origin-top-left">★</span>}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="min-w-0 truncate text-base font-black tracking-tight text-ink">{row.n}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/55">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{row.c} · {row.st}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <RatingDots rating={row.r} size="sm" showNumber reviewCount={row.rc} />
            <span className="chip">{row.cu}</span>
          </div>
        </div>
        {external && (
          <ExternalLink className="h-4 w-4 shrink-0 self-start text-ink/35 transition-colors group-hover:text-ember" />
        )}
      </Link>
    </li>
  );
}

export default function SearchClient(props: Props) {
  return (
    <Suspense fallback={<div className="px-6 py-32 text-center text-ink/50">Loading…</div>}>
      <SearchInner {...props} />
    </Suspense>
  );
}
