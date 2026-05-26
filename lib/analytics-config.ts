/**
 * Public IDs for Google Analytics 4 and Google AdSense.
 * Both are PUBLIC by design — they're meant to ship in the HTML.
 *
 * To swap IDs without touching code, set NEXT_PUBLIC_GA_ID and/or
 * NEXT_PUBLIC_ADSENSE_CLIENT in your Hostinger environment variables.
 */

/**
 * Set the env var to the literal string `"disabled"` (or any falsy value)
 * to kill that integration without touching code. Useful when you want to
 * pause AdSense until you have traffic, or disable GA during dev runs.
 */
const isOff = (v: string | undefined) =>
  !v || v.toLowerCase() === 'disabled' || v.toLowerCase() === 'off' || v.toLowerCase() === 'false';

const rawGa = process.env.NEXT_PUBLIC_GA_ID;
const rawAds = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

// If env var unset, fall back to the IDs from the old HTML site.
// If env var explicitly "disabled" / "off" / "false", treat as disabled.
export const GA_MEASUREMENT_ID = rawGa === undefined ? 'G-2HZDGFLPKF' : isOff(rawGa) ? null : rawGa;
export const ADSENSE_CLIENT    = rawAds === undefined ? 'ca-pub-5602859356335609' : isOff(rawAds) ? null : rawAds;

export const GA_ENABLED      = Boolean(GA_MEASUREMENT_ID);
export const ADSENSE_ENABLED = Boolean(ADSENSE_CLIENT);

/** Local-storage key for cookie/tracking consent. */
export const CONSENT_KEY = 'foodtrucks-consent-v1';

/** Possible consent states. Anything other than 'granted' = no tracking loads. */
export type ConsentValue = 'granted' | 'denied' | null;
