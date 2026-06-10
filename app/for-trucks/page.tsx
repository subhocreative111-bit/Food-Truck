import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowUpRight, MapPin, Camera, Eye, Phone, Shield, Zap } from 'lucide-react';
import { US_STATES } from '@/lib/states';
import { getAllStates } from '@/lib/data';

export const metadata: Metadata = {
  title: { absolute: 'For Food Truck Owners — Get Found by Customers' },
  description:
    'Free directory listing for independent food trucks across all 50 states. Real customers, real searches, real visibility — without ad spend.',
  alternates: { canonical: '/for-trucks' },
  openGraph: {
    title: 'For Food Truck Owners — FoodTrucksNearMeUSA',
    description: 'Free listing for independent food trucks across all 50 states.',
    url: '/for-trucks',
    type: 'website',
  },
};

export default function ForTrucksPage() {
  const totalTrucks = getAllStates().reduce((s, st) => s + st.count, 0);

  return (
    <>
      {/* HERO */}
      <section className="grain relative isolate overflow-hidden px-6 pb-16 pt-12 md:px-10 md:pt-20">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">
            — For Food Truck Owners
          </span>
          <h1 className="mt-4 break-words text-[clamp(2.75rem,10vw,7rem)] font-black leading-[0.95] tracking-tightest">
            Get found
            <br />
            by hungry
            <br />
            <span className="italic text-ember">customers</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75 md:text-xl">
            We&apos;re a curated directory of {totalTrucks.toLocaleString()}+ independent food trucks across all{' '}
            {US_STATES.length} US states. Customers find us when they search for trucks near them. Free listing,
            no contracts, no ad spend required.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/list-your-truck" className="btn-primary text-base">
              Get listed — free
            </Link>
            <Link
              href="/for-trucks/guide"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-7 py-4 font-bold text-ink transition-all hover:border-ember hover:text-ember"
            >
              How it works
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat number={`${totalTrucks.toLocaleString()}+`} label="Trucks listed" />
            <Stat number={US_STATES.length.toString()} label="States covered" />
            <Stat number="100%" label="Free to claim" />
            <Stat number="48h" label="Avg. review time" />
          </div>
        </div>
      </section>

      {/* WHY LIST */}
      <section className="bg-cream-50 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">
            — Why list here
          </span>
          <h2 className="mt-4 text-[clamp(2rem,6vw,4rem)] font-black leading-tight tracking-tightest">
            Three reasons it&apos;s worth ten minutes.
          </h2>

          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            <Reason
              icon={<Eye className="h-5 w-5" />}
              title="Customers actually find you"
              body="People type 'food trucks near me' into Google 130,000+ times a month in the US. Our pages rank for those searches. Your listing rides along."
            />
            <Reason
              icon={<Zap className="h-5 w-5" />}
              title="Free, no contracts"
              body="The basic listing — name, location, hours, photos, contact — costs zero. No card on file. Featured upgrades come later but aren't required."
            />
            <Reason
              icon={<Shield className="h-5 w-5" />}
              title="You control your listing"
              body="Claim ownership with your business email. After verification, you can update hours, swap photos, add a menu, and reply to customer questions."
            />
          </ul>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">
            — What&apos;s included free
          </span>
          <h2 className="mt-4 text-[clamp(2rem,6vw,4rem)] font-black leading-tight tracking-tightest">
            Everything you actually need.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-ink/70">
            Every truck on the directory gets these in the free tier. No catch.
          </p>

          <ul className="mt-12 grid gap-3 md:grid-cols-2">
            {[
              ['A dedicated public truck page', 'with your name, location, hours, cuisine, and contact info'],
              ['Verified ownership badge', 'so customers know your listing is current'],
              ['Up to 6 photos', 'either uploaded by you or pulled from Google Maps'],
              ['Direct phone + website links', 'customers can call or visit your site from your page'],
              ['Map embed with your address', 'directions in one click'],
              ['State + city directory listings', 'we cross-list you on every relevant page'],
              ['Cuisine category pages', 'discoverable by what you cook, not just where you are'],
              ['SEO-optimized page', 'titles, schema, sitemap — built to rank in Google'],
            ].map(([title, body]) => (
              <li
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-cream-50 p-6"
              >
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="font-black text-ink">{title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-ink/65">{body}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS — short */}
      <section className="bg-cream-50 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">
            — How it works
          </span>
          <h2 className="mt-4 text-[clamp(2rem,6vw,4rem)] font-black leading-tight tracking-tightest">
            Four steps. About ten minutes.
          </h2>

          <ol className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              ['1', 'Find your truck', 'Search the directory by name or location. If your truck is already listed, you can claim it. If not, you submit a new listing.'],
              ['2', 'Verify ownership', 'Confirm you can receive email at your business domain. Takes minutes if you already have email set up.'],
              ['3', 'Update everything', 'Edit your hours, photos, menu link, social handles, and exact location. Changes go live in your dashboard.'],
              ['4', 'Show up in search', 'Your page is now indexed by Google. Customers searching for trucks in your city can find you.'],
            ].map(([n, title, body]) => (
              <li key={n} className="min-w-0">
                <div className="tabular text-5xl font-black leading-none text-ember">{n}</div>
                <div className="mt-4 text-lg font-black text-ink">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-wrap gap-4">
            <Link href="/for-trucks/guide" className="btn-primary text-base">
              Read the full guide
            </Link>
            <Link href="/for-trucks/faq" className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-7 py-4 font-bold text-ink transition-all hover:border-ember hover:text-ember">
              See all FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">
            — Resources for owners
          </span>
          <h2 className="mt-4 text-[clamp(2rem,6vw,4rem)] font-black leading-tight tracking-tightest">
            Learn from operators who&apos;ve done it.
          </h2>

          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              {
                href: '/blog/how-to-start-a-food-truck-business',
                title: 'How to Start a Food Truck Business',
                blurb: 'What it actually costs, what you actually need, and what nobody tells you. The practical operator playbook.',
              },
              {
                href: '/blog/food-truck-menu-ideas',
                title: 'Food Truck Menu Ideas — What to Sell and Why',
                blurb: 'Menu archetypes that work on a truck, pricing math, 30 concrete menu ideas across cuisines.',
              },
              {
                href: '/blog/food-truck-industry-trends-2025',
                title: 'Food Truck Industry Trends',
                blurb: 'What’s growing, what’s declining, what to bet on. From the operator’s lens.',
              },
              {
                href: '/blog/best-food-truck-festivals',
                title: 'The Best Food Truck Festivals in America',
                blurb: 'Regional guide to high-revenue events worth booking. Where the operators we list make their year.',
              },
            ].map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="group block h-full rounded-3xl border border-ink/10 bg-cream-50 p-6 transition-all duration-500 ease-editorial hover:border-ember hover:shadow-[0_24px_50px_-20px_rgba(200,70,58,0.25)]"
                >
                  <h3 className="text-lg font-black leading-tight tracking-tight text-ink transition-colors group-hover:text-ember md:text-xl">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{r.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-ember">
                    Read the guide <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="grain relative isolate bg-ink px-6 py-24 text-cream md:px-10 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="break-words text-[clamp(2rem,8vw,5rem)] font-black leading-[0.95] tracking-tightest">
            Ready to be findable?
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-cream/75 md:text-xl">
            Takes ten minutes. Free. We&apos;ll have your listing reviewed and live within 48 hours.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/list-your-truck" className="btn-primary text-base">
              Get listed — free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/30 px-7 py-4 font-bold text-cream transition-all hover:border-saffron hover:text-saffron"
            >
              Talk to us
              <Phone className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-cream-50 p-5">
      <div className="tabular text-3xl font-black leading-none tracking-tight md:text-4xl">{number}</div>
      <div className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-ink/55 md:text-xs">
        {label}
      </div>
    </div>
  );
}

function Reason({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <li className="rounded-3xl border border-ink/10 bg-cream p-7">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ember/15 text-ember">
        {icon}
      </span>
      <h3 className="mt-5 text-xl font-black leading-tight tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">{body}</p>
    </li>
  );
}
