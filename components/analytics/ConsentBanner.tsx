'use client';

import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { CONSENT_KEY } from '@/lib/analytics-config';

/**
 * Bottom-pinned cookie/tracking consent banner. Only renders when the
 * visitor hasn't made a choice yet. Clicking "Accept" or "Decline"
 * persists the answer and fires a `foodtrucks:consent` event so the
 * Analytics component can react without a full reload.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const v = window.localStorage.getItem(CONSENT_KEY);
    if (!v) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (value: 'granted' | 'denied') => {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent('foodtrucks:consent'));
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-cream
                 px-5 py-4 shadow-[0_24px_60px_-12px_rgba(26,22,20,0.35)] backdrop-blur md:inset-x-6 md:px-6"
    >
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
        <div className="flex items-start gap-3 md:items-center">
          <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember md:inline-flex">
            <Cookie className="h-4 w-4" />
          </span>
          <p className="text-sm leading-relaxed text-ink/80">
            <strong className="font-black">Cookies, plain & simple.</strong>{' '}
            We use Google Analytics and AdSense to understand site usage and pay
            for hosting. Pick one — your choice is remembered.
          </p>
        </div>
        <div className="flex w-full shrink-0 gap-2 md:w-auto">
          <button
            onClick={() => decide('denied')}
            className="flex-1 rounded-full border border-ink/15 px-4 py-2 text-sm font-bold text-ink/75 transition-colors hover:border-ink hover:text-ink md:flex-none"
          >
            Decline
          </button>
          <button
            onClick={() => decide('granted')}
            className="btn-primary flex-1 px-5 py-2 text-sm md:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
