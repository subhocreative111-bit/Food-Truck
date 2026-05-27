'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import CuisineIconArt from './CuisineIconArt';
import type { CitySummary } from '@/lib/types';

export default function CityCard({ city, index = 0 }: { city: CitySummary; index?: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  // Pick a smaller display size for long city names so they don't break mid-word
  const longName = city.name.length > 9;
  const headingSize = longName ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl';
  const showPhoto = city.coverPhoto && !imgFailed;

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
        {showPhoto ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={city.coverPhoto}
              alt={`Food truck in ${city.name}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="zoom-img absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
          </>
        ) : (
          <>
            {/* Fallback: cuisine icon art when a city has no real photo or it failed to load */}
            <CuisineIconArt cuisine="American" name={city.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          {/* Top row: count + arrow (small badge style on mobile, big number on desktop) */}
          <div className="flex items-center justify-between gap-2">
            <span className="tabular inline-flex items-baseline gap-1 rounded-full bg-cream/95 px-2.5 py-1 text-[11px] font-black text-ink md:bg-transparent md:px-0 md:py-0 md:text-cream">
              <span className="md:text-4xl md:font-black">{city.count.toLocaleString()}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-ink/55 md:hidden">trucks</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-cream transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          {/* Bottom row: city name + state (hyphenated wrapping, smaller size for long names) */}
          <div className="mt-3 md:mt-2">
            <h3
              lang="en"
              className={`hyphens-auto font-black leading-[0.95] tracking-tight text-cream ${headingSize}`}
            >
              {city.name}
            </h3>
            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.18em] text-cream/70 md:text-xs">{city.state}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
