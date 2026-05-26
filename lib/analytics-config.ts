/**
 * Public IDs for Google Analytics 4 and Google AdSense.
 * Both are PUBLIC by design — they're meant to ship in the HTML.
 *
 * To swap IDs without touching code, set NEXT_PUBLIC_GA_ID and/or
 * NEXT_PUBLIC_ADSENSE_CLIENT in your Hostinger environment variables.
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || 'G-2HZDGFLPKF';

export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-5602859356335609';

/** Local-storage key for cookie/tracking consent. */
export const CONSENT_KEY = 'foodtrucks-consent-v1';

/** Possible consent states. Anything other than 'granted' = no tracking loads. */
export type ConsentValue = 'granted' | 'denied' | null;
