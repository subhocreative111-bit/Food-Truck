'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { CitySummary } from '@/lib/types';

// Stable image picked from a pool by city slug — no per-build randomness.
const POOL = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=700&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=700&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=70&auto=format&fit=crop',
];

function imgFor(slug: string) {
  let n = 0;
  for (let i = 0; i < slug.length; i++) n = (n * 31 + slug.charCodeAt(i)) >>> 0;
  return POOL[n % POOL.length];
}

export default function CityCard({ city, index = 0 }: { city: CitySummary; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(index, 8) * 0.04 }}
    >
      <Link
        href={`/states/${city.stateSlug}/${city.slug}`}
        className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-ink/10 bg-cream-100
                   transition-all duration-500 ease-editorial
                   hover:border-ember hover:shadow-[0_24px_50px_-20px_rgba(200,70,58,0.35)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgFor(city.slug)} alt={city.name} loading="lazy" className="zoom-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          {/* Top row: count + arrow (small badge style on mobile, big number on desktop) */}
          <div className="flex items-center justify-between gap-2">
            <span className="tabular inline-flex items-baseline gap-1 rounded-full bg-cream/95 px-2.5 py-1 text-[11px] font-black text-ink md:bg-transparent md:px-0 md:py-0 md:text-cream">
              <span className="md:text-4xl md:font-black">{city.count.toLocaleString()}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-ink/55 md:hidden">trucks</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-cream transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          {/* Bottom row: city name + state (full width on mobile) */}
          <div className="mt-3 md:mt-2">
            <h3 className="break-words text-2xl font-black leading-[0.95] tracking-tight text-cream md:text-3xl">{city.name}</h3>
            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.18em] text-cream/70 md:text-xs">{city.state}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
