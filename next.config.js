const { PHASE_PRODUCTION_BUILD } = require('next/constants');

/**
 * Two supported deployment modes:
 *   - Static export (default) — produces out/ for Hostinger's GitHub-integrated
 *     "Deployment" feature, Netlify, Vercel static, GitHub Pages, etc.
 *     `npm run build` writes out/ via Next's static export.
 *   - Node server — set BUILD_NODE=1 to skip the static export and build for
 *     `npm start` (node server.js). Use this only if you're running the app
 *     on Hostinger's Node.js panel (not the Deployment feature) or a VPS.
 *
 * @type {(phase: string) => import('next').NextConfig}
 */
module.exports = (phase) => {
  const isProdBuild = phase === PHASE_PRODUCTION_BUILD;
  const wantNode = process.env.BUILD_NODE === '1';
  const wantStatic = isProdBuild && !wantNode;

  return {
    // Default: emit out/ for static hosting.
    ...(wantStatic ? { output: 'export' } : {}),

    images: wantStatic
      ? { unoptimized: true } // static export can't run Next's image optimizer
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
