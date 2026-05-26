const { PHASE_PRODUCTION_BUILD } = require('next/constants');

/**
 * Two deployment modes:
 *   - Node server (default) — runs `npm start` on Hostinger Node hosting.
 *     Unlocks ISR, API routes, real form submissions, on-demand rendering.
 *   - Static export — set BUILD_STATIC=1 before `npm run build` to produce
 *     out/ for plain static hosting. Use this if you ever drop back to a
 *     static-only host.
 *
 * @type {(phase: string) => import('next').NextConfig}
 */
module.exports = (phase) => {
  const isProdBuild = phase === PHASE_PRODUCTION_BUILD;
  const wantStatic = process.env.BUILD_STATIC === '1';

  return {
    // Only emit the static out/ when explicitly asked for AND during a real build.
    ...(isProdBuild && wantStatic ? { output: 'export' } : {}),

    // Static export can't use the Next image optimizer, so unoptimize then.
    // In Node mode we let Next handle resizing for us.
    images: wantStatic
      ? { unoptimized: true }
      : {
          remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
          ],
        },

    trailingSlash: true,
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
  };
};
