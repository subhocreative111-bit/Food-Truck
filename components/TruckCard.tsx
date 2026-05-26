'use client';

import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import RatingDots from './RatingDots';
import CuisineIconArt from './CuisineIconArt';
import { hasDetailPage, googleMapsUrl } from '@/lib/truck-helpers';
import type { Truck } from '@/lib/types';

interface Props {
  truck: Truck;
  variant?: 'grid' | 'list' | 'tall';
  index?: number;
}

export default function TruckCard({ truck, variant = 'grid', index = 0 }: Props) {
  const aspect =
    variant === 'tall' ? 'aspect-[4/5]' : variant === 'list' ? 'aspect-[16/10]' : 'aspect-[5/4]';
  const hasPhoto = truck.photos && truck.photos.length > 0;
  const hasPage = hasDetailPage(truck);
  const cardHref = hasPage ? `/truck/${truck.slug}` : googleMapsUrl(truck);
  const externalProps = hasPage ? {} : { target: '_blank' as const, rel: 'noopener noreferrer' };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(index, 6) * 0.04 }}
      className={`group relative min-w-0 ${variant === 'list' ? 'flex gap-6' : 'flex flex-col'}`}
    >
      <Link
        href={cardHref}
        {...externalProps}
        className={`relative overflow-hidden rounded-2xl border border-ink/8 bg-cream-100
                   transition-all duration-500 ease-editorial
                   group-hover:border-ember/60 group-hover:shadow-[0_24px_50px_-20px_rgba(200,70,58,0.35)]
                   ${variant === 'list' ? 'w-2/5 shrink-0' : ''} ${aspect}`}
      >
        {hasPhoto ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={truck.photos[0]}
              alt={truck.name}
              loading="lazy"
              className="zoom-img absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          </>
        ) : (
          <CuisineIconArt cuisine={truck.cuisine[0]} name={truck.name} />
        )}

        {truck.featured && <span className="featured-pill absolute left-3 top-3">Featured</span>}

        {hasPhoto && (
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="rounded-full bg-cream/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-ink">
              {truck.cuisine[0]}
            </div>
            {truck.priceLevel != null && (
              <div className="tabular rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-cream">
                {'$'.repeat(truck.priceLevel)}
              </div>
            )}
          </div>
        )}
      </Link>

      <div className={`min-w-0 ${variant === 'list' ? 'flex-1' : 'mt-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 break-words text-lg font-black leading-tight tracking-tight text-ink md:text-xl">
            <Link href={cardHref} {...externalProps} className="transition-colors group-hover:text-ember">
              {truck.name}
            </Link>
          </h3>
          <Link
            href={cardHref}
            {...externalProps}
            aria-label={hasPage ? `Open ${truck.name}` : `Find ${truck.name} on Google Maps`}
            className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/15
                       text-ink/60 transition-all duration-300 ease-editorial
                       group-hover:border-ember group-hover:bg-ember group-hover:text-cream group-hover:rotate-12"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-ink/55">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="min-w-0 truncate">
            <Link href={`/states/${truck.stateSlug}/${truck.citySlug}`} className="font-bold hover:text-ember">
              {truck.city}
            </Link>
            <span className="mx-1 text-ink/30">·</span>
            <Link href={`/states/${truck.stateSlug}`} className="hover:text-ember">{truck.state}</Link>
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <RatingDots rating={truck.rating} showNumber reviewCount={truck.reviewCount} />
        </div>

        {variant === 'list' && truck.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/65">{truck.description}</p>
        )}

        {variant === 'list' && truck.cuisine.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {truck.cuisine.slice(1, 4).map((c) => (
              <span key={c} className="chip">{c}</span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
