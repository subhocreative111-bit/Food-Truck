'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function PhotoGallery({ photos, name }: { photos: string[]; name: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:gap-3">
        {photos.slice(0, 5).map((src, i) => {
          const isHero = i === 0;
          return (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className={`group relative overflow-hidden bg-cream-100
                          ${isHero ? 'col-span-4 row-span-2 md:col-span-2' : 'col-span-2 md:col-span-1'}
                          ${isHero ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[4/3]'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${name} photo ${i + 1}`}
                loading={isHero ? 'eager' : 'lazy'}
                className="zoom-img absolute inset-0 h-full w-full object-cover"
              />
              {i === 4 && photos.length > 5 && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-lg font-black text-cream">
                  +{photos.length - 5} more
                </span>
              )}
            </button>
          );
        })}
      </div>

      {lightbox != null && (
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
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
