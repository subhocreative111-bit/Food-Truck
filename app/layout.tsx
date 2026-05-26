import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
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
  },
  twitter: { card: 'summary_large_image' },
  // Icons are auto-discovered from app/icon.svg + app/apple-icon.png — no
  // explicit `icons` override here (an override would suppress auto-detection).
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Saves 200-400ms on the first Unsplash image — the LCP hero photo */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        <SiteNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
