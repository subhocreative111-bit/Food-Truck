import type { Cuisine } from '@/lib/types';

/**
 * Clean cuisine-icon art used as a placeholder when a truck has no real photo.
 * No stock images — a typographic + iconographic composition on a cream/ember field.
 */

const ICONS: Record<string, string> = {
  Tacos:        'M3 14c2-5 7-7 9-7s7 2 9 7c-3 3-7 4-9 4s-6-1-9-4Z',
  Mexican:      'M3 14c2-5 7-7 9-7s7 2 9 7c-3 3-7 4-9 4s-6-1-9-4Z',
  'Tex-Mex':    'M3 14c2-5 7-7 9-7s7 2 9 7c-3 3-7 4-9 4s-6-1-9-4Z',
  BBQ:          'M5 11h14M7 7h10l-2 4H9zM6 14h12l-1 5H7z',
  Pizza:        'M12 3l9 16H3z M9 9h.01 M14 11h.01 M11 14h.01',
  Italian:      'M4 12a8 8 0 0 1 16 0v6H4z',
  Burgers:      'M4 10c0-3 4-5 8-5s8 2 8 5H4Zm0 4h16M5 18h14',
  American:     'M4 10c0-3 4-5 8-5s8 2 8 5H4Zm0 4h16M5 18h14',
  Sandwiches:   'M4 10c0-3 4-5 8-5s8 2 8 5H4Zm0 4h16M5 18h14',
  Asian:        'M5 6c0 6 6 10 7 10s7-4 7-10M4 18h16',
  Thai:         'M5 6c0 6 6 10 7 10s7-4 7-10M4 18h16',
  Chinese:      'M5 6c0 6 6 10 7 10s7-4 7-10M4 18h16',
  Japanese:     'M5 6c0 6 6 10 7 10s7-4 7-10M4 18h16',
  Korean:       'M5 6c0 6 6 10 7 10s7-4 7-10M4 18h16',
  Vietnamese:   'M5 6c0 6 6 10 7 10s7-4 7-10M4 18h16',
  Coffee:       'M4 8h11v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm11 2h3a2 2 0 0 1 0 4h-3',
  Seafood:      'M3 12c4-5 12-5 16 0-4 5-12 5-16 0Zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  Vegan:        'M12 4c-5 4-7 9-3 13s9 1 13-3c-1-5-5-8-10-10Z',
  Desserts:     'M4 10h16l-2 9H6zM8 10c0-3 2-5 4-5s4 2 4 5',
  Breakfast:    'M4 10h16l-2 9H6zM8 10c0-3 2-5 4-5s4 2 4 5',
  Indian:       'M5 14a7 7 0 0 1 14 0M12 7v3M9 4l2 3M15 4l-2 3',
  Mediterranean:'M5 14a7 7 0 0 1 14 0M12 7v3',
  'Soul Food':  'M5 11h14v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z',
  Halal:        'M12 4l2 6h6l-5 4 2 7-7-5-7 5 2-7-5-4h6z',
  Caribbean:    'M4 16c4-2 12-2 16 0M6 12a6 6 0 0 1 12 0M12 6v6',
  Cajun:        'M5 11h14M7 7h10l-2 4H9zM6 14h12l-1 5H7z',
  Other:        'M5 5h14v14H5z',
};

// Palette per cuisine — deterministic, lightly saturated, on-brand
const PALETTE: Record<string, { bg: string; fg: string; accent: string }> = {
  Tacos:        { bg: '#FBE2B4', fg: '#7E251C', accent: '#C8463A' },
  Mexican:      { bg: '#FBE2B4', fg: '#7E251C', accent: '#C8463A' },
  'Tex-Mex':    { bg: '#FBE2B4', fg: '#7E251C', accent: '#C8463A' },
  BBQ:          { bg: '#F5CFCA', fg: '#3A0F0A', accent: '#C8463A' },
  Pizza:        { bg: '#FBECEA', fg: '#7E251C', accent: '#D38716' },
  Italian:      { bg: '#F0E6D2', fg: '#3D3633', accent: '#9F6611' },
  Burgers:      { bg: '#FEF4E2', fg: '#3D3633', accent: '#D38716' },
  American:     { bg: '#FAF4E8', fg: '#1A1614', accent: '#C8463A' },
  Sandwiches:   { bg: '#F0E6D2', fg: '#1A1614', accent: '#D38716' },
  Asian:        { bg: '#FBE2B4', fg: '#3D3633', accent: '#C8463A' },
  Thai:         { bg: '#FBECEA', fg: '#3D3633', accent: '#F2A53A' },
  Chinese:      { bg: '#F5CFCA', fg: '#3A0F0A', accent: '#C8463A' },
  Japanese:     { bg: '#FAF4E8', fg: '#1A1614', accent: '#C8463A' },
  Korean:       { bg: '#F5CFCA', fg: '#3A0F0A', accent: '#C8463A' },
  Vietnamese:   { bg: '#FBECEA', fg: '#3D3633', accent: '#F2A53A' },
  Coffee:       { bg: '#3D3633', fg: '#FAF4E8', accent: '#F2A53A' },
  Seafood:      { bg: '#E2D2B0', fg: '#1A1614', accent: '#9F6611' },
  Vegan:        { bg: '#E2D2B0', fg: '#3A0F0A', accent: '#9F6611' },
  Desserts:     { bg: '#FBECEA', fg: '#7E251C', accent: '#F2A53A' },
  Breakfast:    { bg: '#FEF4E2', fg: '#3D3633', accent: '#F2A53A' },
  Indian:       { bg: '#FBE2B4', fg: '#3A0F0A', accent: '#C8463A' },
  Mediterranean:{ bg: '#FAF4E8', fg: '#1A1614', accent: '#D38716' },
  'Soul Food':  { bg: '#F0E6D2', fg: '#3A0F0A', accent: '#7E251C' },
  Halal:        { bg: '#FBE2B4', fg: '#3A0F0A', accent: '#9F6611' },
  Caribbean:    { bg: '#FBECEA', fg: '#3D3633', accent: '#C8463A' },
  Cajun:        { bg: '#F5CFCA', fg: '#3A0F0A', accent: '#C8463A' },
  Other:        { bg: '#F0E6D2', fg: '#1A1614', accent: '#C8463A' },
};

export default function CuisineIconArt({
  cuisine,
  name,
}: {
  cuisine: Cuisine;
  name: string;
}) {
  const icon = ICONS[cuisine] ?? ICONS.Other;
  const palette = PALETTE[cuisine] ?? PALETTE.Other;
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-5"
      style={{ background: palette.bg }}
    >
      {/* Big saffron disc behind everything */}
      <span
        aria-hidden
        className="absolute -right-12 -top-12 h-48 w-48 rounded-full"
        style={{ background: palette.accent, opacity: 0.18 }}
      />
      {/* Tiny dot pattern lower-left */}
      <span aria-hidden className="absolute bottom-5 left-5 flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="block h-1.5 w-1.5 rounded-full" style={{ background: palette.accent }} />
        ))}
      </span>

      <div className="relative">
        <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none">
          <path d={icon} stroke={palette.fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="relative">
        <span
          className="block text-[10px] font-black uppercase tracking-[0.22em]"
          style={{ color: palette.accent }}
        >
          {cuisine}
        </span>
        <span
          className="mt-1 line-clamp-2 block text-xl font-black leading-[0.95] tracking-tightest"
          style={{ color: palette.fg }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
