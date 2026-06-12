import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck, MessagesSquare, Truck, ArrowUpRight } from 'lucide-react';
import CateringQuoteForm from '@/components/forms/CateringQuoteForm';
import { CATERING_CITIES } from '@/lib/catering';
import { getAllStates } from '@/lib/data';

export const metadata: Metadata = {
  title: { absolute: 'Food Truck Catering — Book a Truck for Your Event' },
  description:
    'Book a food truck for your wedding, office event, or party. Tell us about your event and we connect you with available local trucks — free, no obligation.',
  alternates: { canonical: '/catering' },
  openGraph: {
    title: 'Food Truck Catering — FoodTrucksNearMeUSA',
    description: 'Book a food truck for weddings, corporate events and parties. Free matching with local trucks.',
    url: '/catering',
    type: 'website',
  },
};

export default function CateringPage() {
  const totalTrucks = getAllStates().reduce((s, st) => s + st.count, 0);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://foodtrucksnearmeusa.com/' },
      { '@type': 'ListItem', position: 2, name: 'Catering', item: 'https://foodtrucksnearmeusa.com/catering/' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO */}
      <section className="grain relative isolate overflow-hidden px-6 pb-16 pt-12 md:px-10 md:pt-20">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Catering</span>
          <h1 className="mt-4 break-words text-[clamp(2.75rem,10vw,7rem)] font-black leading-[0.95] tracking-tightest">
            Book a food truck
            <br />
            for your <span className="italic text-ember">event</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75 md:text-xl">
            Weddings, office lunches, birthdays, festivals. Tell us about your event and we&apos;ll connect you
            with available trucks from our directory of {totalTrucks.toLocaleString()}+ across all 50 states.
            Free, no obligation — you book directly with the truck.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-cream-50 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl">
          <ol className="grid gap-8 md:grid-cols-3">
            {[
              { icon: <MessagesSquare className="h-5 w-5" />, n: '1', title: 'Tell us about your event', body: 'Date, city, headcount, cuisine preferences. Two minutes, free.' },
              { icon: <Truck className="h-5 w-5" />, n: '2', title: 'We match available trucks', body: 'We reach out to trucks in our directory that fit your event and check availability.' },
              { icon: <CalendarCheck className="h-5 w-5" />, n: '3', title: 'You book direct', body: 'We introduce you. Pricing, menu and logistics are settled directly with the truck — no middleman fees.' },
            ].map((s) => (
              <li key={s.n} className="rounded-3xl border border-ink/10 bg-cream p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ember/15 text-ember">{s.icon}</span>
                <div className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-ink/45">Step {s.n}</div>
                <h2 className="mt-2 text-xl font-black leading-tight tracking-tight">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FORM */}
      <section className="px-6 py-16 md:px-10 md:py-24" id="quote">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-black leading-tight tracking-tightest">
            Get free quotes.
          </h2>
          <p className="mt-4 text-base text-ink/65">
            One form, no spam, no obligation. We reply within one business day.
          </p>
          <div className="mt-10">
            <CateringQuoteForm />
          </div>
        </div>
      </section>

      {/* CITY GRID */}
      <section className="bg-cream-50 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— By city</span>
          <h2 className="mt-4 text-[clamp(1.75rem,5vw,3rem)] font-black leading-tight tracking-tightest">
            Food truck catering near you.
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {CATERING_CITIES.map((c) => (
              <li key={`${c.stateSlug}/${c.citySlug}`}>
                <Link
                  href={`/catering/${c.citySlug}`}
                  className="group flex items-baseline justify-between gap-2 rounded-2xl border border-ink/10 bg-cream px-4 py-3 transition-colors hover:border-ember"
                >
                  <span className="min-w-0 truncate text-sm font-black tracking-tight transition-colors group-hover:text-ember">
                    {c.city}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink/35 transition-colors group-hover:text-ember" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
