const { PHASE_PRODUCTION_BUILD } = require('next/constants');

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = (phase) => ({
  // Only enable static export at production build time. In dev, leave it off so
  // generateStaticParams introspection works without recompiling every route.
  ...(phase === PHASE_PRODUCTION_BUILD ? { output: 'export' } : {}),
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
});
