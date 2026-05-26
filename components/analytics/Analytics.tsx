'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  GA_MEASUREMENT_ID,
  ADSENSE_CLIENT,
  GA_ENABLED,
  ADSENSE_ENABLED,
  CONSENT_KEY,
  type ConsentValue,
} from '@/lib/analytics-config';

// Tell TypeScript about the window globals these scripts add
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}

/**
 * Loads Google Analytics 4 + Google AdSense after the visitor accepts the
 * consent banner. Renders nothing visually; pairs with <ConsentBanner/>.
 *
 * Behavior:
 *   - Reads consent from localStorage on mount; listens for runtime changes
 *     so accepting in the banner immediately injects the scripts.
 *   - Fires a GA `page_view` on every App Router navigation (path/query).
 *   - Uses next/script `afterInteractive` so neither tag blocks LCP.
 */
export default function Analytics() {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const pathname = usePathname();
  const search = useSearchParams();

  // Initial consent read + cross-tab sync + custom event from the banner
  useEffect(() => {
    const read = () => {
      if (typeof window === 'undefined') return;
      const v = window.localStorage.getItem(CONSENT_KEY);
      setConsent(v === 'granted' ? 'granted' : v === 'denied' ? 'denied' : null);
    };
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === CONSENT_KEY) read(); };
    const onCustom = () => read();
    window.addEventListener('storage', onStorage);
    window.addEventListener('foodtrucks:consent', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('foodtrucks:consent', onCustom);
    };
  }, []);

  // Track route changes (App Router doesn't auto-fire page_view on navigation)
  useEffect(() => {
    if (consent !== 'granted' || !GA_ENABLED || !window.gtag) return;
    const url = pathname + (search?.toString() ? `?${search.toString()}` : '');
    window.gtag('config', GA_MEASUREMENT_ID!, { page_path: url });
  }, [pathname, search, consent]);

  if (consent !== 'granted') return null;
  if (!GA_ENABLED && !ADSENSE_ENABLED) return null;

  return (
    <>
      {GA_ENABLED && (
        <>
          <Script
            id="ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {ADSENSE_ENABLED && (
        <Script
          id="adsense-loader"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
          async
        />
      )}
    </>
  );
}
