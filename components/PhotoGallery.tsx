'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import CuisineIconArt from './CuisineIconArt';
import type { Cuisine } from '@/lib/types';

export default function PhotoGallery({
  photos,
  name,
  fallbackCuisine,
}: {
  photos: string[];
  name: string;
  /** Rendered when every photo URL fails to load. */
  fallbackCuisine?: Cuisine;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [broken, setBroken] = useState<Set<number>>(new Set());

  // Filter out broken photos for the UI; lightbox indices reference the original array
  const usablePhotos = photos.filter((_, i) => !broken.has(i));
  const count = usablePhotos.length;

  if (count === 0) {
    // All photos failed to load (or never existed) — show the cuisine icon art fallback
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-ink/8 bg-cream-100 md:aspect-[21/9]">
        <CuisineIconArt cuisine={fallbackCuisine ?? 'American'} name={name} />
      </div>
    );
  }

  // Single-photo layout: one big centered hero — no awkward half-empty grid
  if (count === 1) {
    return (
      <>
        <button
          onClick={() => setLightbox(0)}
          className="group relative block aspect-[16/9] w-full overflow-hidden rounded-3xl bg-cream-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={usablePhotos[0]}
            alt={`${name} photo`}
            loading="eager"
            referrerPolicy="no-referrer"
            className="zoom-img absolute inset-0 h-full w-full object-cover"
            onError={() => {
              const idx = photos.indexOf(usablePhotos[0]);
              setBroken((b) => new Set(b).add(idx));
            }}
          />
        </button>
        {renderLightbox()}
      </>
    );
  }

  // Two-photo layout: side-by-side
  if (count === 2) {
    return (
      <>
        <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-3xl md:gap-3">
          {usablePhotos.map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox(photos.indexOf(src))}
              className="group relative aspect-[16/10] overflow-hidden bg-cream-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${name} photo ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
                className="zoom-img absolute inset-0 h-full w-full object-cover"
                onError={() => {
                  const idx = photos.indexOf(src);
                  setBroken((b) => new Set(b).add(idx));
                }}
              />
            </button>
          ))}
        </div>
        {renderLightbox()}
      </>
    );
  }

  // 3+: the original 4-col / 2-row mosaic layout
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:gap-3">
        {usablePhotos.slice(0, 5).map((src, i) => {
          const isHero = i === 0;
          return (
            <button
              key={i}
              onClick={() => setLightbox(photos.indexOf(src))}
              className={`group relative overflow-hidden bg-cream-100
                          ${isHero ? 'col-span-4 row-span-2 md:col-span-2' : 'col-span-2 md:col-span-1'}
                          ${isHero ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[4/3]'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${name} photo ${i + 1}`}
                loading={isHero ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
                className="zoom-img absolute inset-0 h-full w-full object-cover"
                onError={() => {
                  const idx = photos.indexOf(src);
                  setBroken((b) => new Set(b).add(idx));
                }}
              />
              {i === 4 && usablePhotos.length > 5 && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-lg font-black text-cream">
                  +{usablePhotos.length - 5} more
                </span>
              )}
            </button>
          );
        })}
      </div>
      {renderLightbox()}
    </>
  );

  function renderLightbox() {
    if (lightbox == null) return null;
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-6"
        onClick={() => setLightbox(null)}
      >
        <button
          aria-label="Close"
          className="absolute right-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink"
          onClick={() => setLightbox(null)}
        >
          <X className="h-5 w-5" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[lightbox]}
          alt={`${name} large`}
          referrerPolicy="no-referrer"
          className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }
}
