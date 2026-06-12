import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import CateringQuoteForm from '@/components/forms/CateringQuoteForm';
import TruckCard from '@/components/TruckCard';
import { CATERING_CITIES, CATERING_BLURBS, getCateringCity } from '@/lib/catering';
import { getTrucksByCity, rankTrucks } from '@/lib/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return CATERING_CITIES.map((c) => ({ city: c.citySlug }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const c = getCateringCity(params.city);
  if (!c) return {};
  return {
    title: { absolute: `Food Truck Catering in ${c.city}, ${c.state}` },
    description: `Book a food truck for your event in ${c.city} — weddings, office lunches, parties. ${c.count}+ local trucks. Free quotes, no obligation, book direct.`,
    alternates: { canonical: `/catering/${c.citySlug}` },
    openGraph: {
      title: `Food Truck Catering in ${c.city}`,
      description: `Book a local food truck for your ${c.city} event. Free matching, no fees.`,
      url: `/catering/${c.citySlug}`,
      type: 'website',
    },
  };
}

export default function CateringCityPage({ params }: { params: { city: string } }) {
  const c = getCateringCity(params.city);
  if (!c) notFound();

  const blurb = CATERING_BLURBS[`${c.stateSlug}/${c.citySlug}`];
  const trucks = rankTrucks(getTrucksByCity(c.stateSlug, c.citySlug)).slice(0, 8);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://foodtrucksnearmeusa.com/' },
      { '@type': 'ListItem', position: 2, name: 'Catering', item: 'https://foodtrucksnearmeusa.com/catering/' },
      { '@type': 'ListItem', position: 3, name: c.city, item: `https://foodtrucksnearmeusa.com/catering/${c.citySlug}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="grain relative isolate overflow-hidden px-6 pb-12 pt-12 md:px-10 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-5xl">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
            <Link href="/" className="hover:text-ember">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/catering" className="hover:text-ember">Catering</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink">{c.city}</span>
          </nav>

          <h1 className="mt-8 break-words text-[clamp(2.5rem,9vw,6rem)] font-black leading-[0.95] tracking-tightest">
            Food truck catering
            <br />
            in <span className="italic text-ember">{c.city}</span>.
          </h1>

          {blurb ? (
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/75">{blurb}</p>
          ) : (
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink/75">
              {c.city} has {c.count}+ independent food trucks in our directory — from taco rigs to BBQ smokers to
              dessert carts — and many of them cater. Tell us about your event below and we&apos;ll match you with
              trucks that fit your date, headcount and budget. Free, no obligation, you book directly.
            </p>
          )}
        </div>
      </section>

      <section className="px-6 py-12 md:px-10 md:py-16" id="quote">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black leading-tight tracking-tightest">
            Get quotes from {c.city} trucks.
          </h2>
          <div className="mt-8">
            <CateringQuoteForm defaultCity={`${c.city}, ${c.state}`} />
          </div>
        </div>
      </section>

      {trucks.length > 0 && (
        <section className="bg-cream-50 px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-7xl">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— The local lineup</span>
            <h2 className="mt-4 text-[clamp(1.75rem,5vw,3rem)] font-black leading-tight tracking-tightest">
              Top-rated trucks in {c.city}.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-ink/65">
              A sample of what&apos;s available locally. Browse the full{' '}
              <Link href={`/states/${c.stateSlug}/${c.citySlug}`} className="font-bold text-ember underline-offset-4 hover:underline">
                {c.city} directory
              </Link>{' '}
              for all {c.count} trucks.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trucks.map((t, i) => (
                <TruckCard key={t.slug} truck={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Other cities</span>
          <ul className="mt-6 flex flex-wrap gap-2">
            {CATERING_CITIES.filter((x) => x.citySlug !== c.citySlug).slice(0, 12).map((x) => (
              <li key={x.citySlug}>
                <Link href={`/catering/${x.citySlug}`} className="chip transition-colors hover:border-ember hover:text-ember">
                  {x.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
