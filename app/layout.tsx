import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Poppins } from 'next/font/google';
import './globals.css';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';
import Analytics from '@/components/analytics/Analytics';
import ConsentBanner from '@/components/analytics/ConsentBanner';

const poppins = Poppins({
  subsets: ['latin'],
  // Trimmed from [400, 600, 700, 900] to [400, 700, 900] to save ~150 KB on
  // the initial font payload. 600 was barely used; 700 covers the bold cases
  // that previously used 600.
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://foodtrucksnearmeusa.com'),
  title: {
    default: 'Food Trucks Near Me — America\'s Curated Mobile-Eats Directory',
    template: '%s · FoodTrucksNearMeUSA',
  },
  description:
    'Discover independent food trucks, taco stands, BBQ rigs and roadside eateries across all 50 states. Hand-picked listings, real hours, real reviews.',
  openGraph: {
    type: 'website',
    siteName: 'FoodTrucksNearMeUSA',
    locale: 'en_US',
    // Default share image (Ahrefs flagged og:image missing). Same Unsplash
    // photo as the homepage hero, cropped to the 1200x630 OG canvas. Pages
    // that define their own openGraph.images (truck pages) still win.
    images: [
      {
        url: 'https://images.unsplash.com/photo-1683508700255-f9b09a11f687?w=1200&h=630&q=70&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Customers gathered at a food truck — FoodTrucksNearMeUSA',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  // Site-verification meta tags. Next renders these in <head> as
  // <meta name="<provider>-site-verification" content="...">
  verification: {
    other: {
      'ahrefs-site-verification': '85e62f3fdcd9c690f4a7b28f4b1ec45e5b9344939e4249c80630f9a02850a862',
    },
  },
  // Icons are auto-discovered from app/icon.svg + app/apple-icon.png — no
  // explicit `icons` override here (an override would suppress auto-detection).
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Preconnect to the photo hosts so the TLS handshake happens before
            the image URLs are discovered. The actual LCP-image preload lives
            in app/page.tsx (homepage only) so we don't waste bytes
            preloading the hero on truck/state/cuisine pages. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://pub-1fc3abcd270c4b80ac998884b38e3fc3.r2.dev" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pub-1fc3abcd270c4b80ac998884b38e3fc3.r2.dev" />
        {/* Ahrefs Web Analytics. Cookieless and PII-free, so it loads
            unconditionally — GA4/AdSense stay consent-gated in <Analytics />.
            Plain server-rendered tag (not next/script) so Ahrefs' "Verify
            installation" crawler finds it in the static HTML. */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="DFMO1DcXSx3kPtzup9qGPg"
          async
        />
      </head>
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        <SiteNav />
        <main>{children}</main>
        <Footer />
        <ConsentBanner />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
