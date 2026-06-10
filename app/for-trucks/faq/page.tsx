import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'FAQ — For Food Truck Owners' },
  description:
    'Real answers to real questions from food truck owners about claiming your listing, updating your page, and getting found by customers.',
  alternates: { canonical: '/for-trucks/faq' },
};

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: 'Is the basic listing actually free?',
    a:
      'Yes. The free tier gets you a dedicated truck page, your contact info, hours, photos, map, and listings across every relevant state, city, and cuisine page on the site. No credit card. No trial that converts. No bait-and-switch.',
  },
  {
    q: 'How long does it take to claim my listing?',
    a:
      'About ten minutes to fill the form, plus up to 48 hours for us to verify ownership and approve the claim. Verification is usually faster — most claims clear within 24 hours.',
  },
  {
    q: 'How do you verify I really own the truck?',
    a:
      'Two ways. The fast path: we send a verification email to an address on your truck\'s business domain (or to a verified Google Business email). The longer path: photo verification — a clearly-dated photo of you at the truck holding a paper with our verification code on it. Use whichever works for you.',
  },
  {
    q: 'My truck isn\'t in the directory yet. Can I still add it?',
    a:
      'Yes. Go to "Get listed" and submit a new listing. We\'ll review it (we manually check every new truck) and add it to the directory once approved. Approval is usually 48 hours.',
  },
  {
    q: 'What is a Featured listing?',
    a:
      'Featured listings are paid upgrades that boost your truck to the top of state, city, and cuisine pages. They also include premium photo slots and basic analytics. We don\'t require Featured — most operators run on the free tier successfully. Featured pricing will be published once we launch the paid tier.',
  },
  {
    q: 'How will I show up in Google search?',
    a:
      'When customers Google "food trucks in [your city]" or "[your cuisine] food trucks near me," our state, city, and cuisine pages are designed to rank. Once you\'re listed, you appear on those ranked pages. Your own truck page (e.g. /truck/your-name/) is also indexed and can rank directly for searches for your truck\'s name.',
  },
  {
    q: 'Will customers see my phone number?',
    a:
      'Only if you choose. The contact info you provide during claim is what customers see. You can hide phone, hide email, hide website, or any combination. Most operators show at least one direct contact method because customers convert better when they can reach you.',
  },
  {
    q: 'My truck moves between locations. How do I handle that?',
    a:
      'Your listing has a primary address (commissary, home base, or most-frequent location). Inside your owner dashboard you can also update a "where I\'ll be today/this week" status that appears on your page. This is the most useful field for daily operators — keep it current.',
  },
  {
    q: 'Can I add my own photos?',
    a:
      'Yes. After your claim is approved, you can upload up to six photos through the owner dashboard. Replace the auto-pulled Google Maps photos with your own — better photos meaningfully improve customer click-through.',
  },
  {
    q: 'Can multiple people manage one listing?',
    a:
      'Yes. The owner dashboard supports team access. After claiming, the primary owner can add team members with edit or view-only permissions. Useful for trucks with multiple operators or a social media manager.',
  },
  {
    q: 'How is my data used?',
    a:
      'Listing data (truck name, location, hours, contact) is public — that\'s the whole point of a directory. Account data (your email, login info, internal notes) is private and never sold. We use Google Analytics in aggregate to understand visitor behavior. See our full Privacy Policy for the details.',
  },
  {
    q: 'How do I remove my listing?',
    a:
      'Email us through the contact page and ask. We honor every removal request. If your truck has permanently closed, the listing is marked as closed and stays for historical reference. If you just don\'t want to be listed, we delete the page entirely.',
  },
  {
    q: 'How do you decide which trucks to list?',
    a:
      'Two criteria. (1) It\'s an independent food truck — not a brick-and-mortar restaurant calling itself a "food truck," not a national chain (Subway, Dunkin\', etc.), not a delivery-only ghost kitchen. (2) It\'s operational — currently serving customers within the last six months. We filter both during our review process.',
  },
  {
    q: 'Do I need a website to be listed?',
    a:
      'No. Plenty of trucks in our directory only have an Instagram handle. You need at least one way for customers to find or contact you (phone, Instagram, Facebook, website — any one). The more the better but one is enough.',
  },
  {
    q: 'Will being listed help me show up in Google Maps?',
    a:
      'Indirectly. We don\'t control Google Maps — that\'s a separate Google Business Profile listing you should also claim. But our truck page links to your Google Maps location, and customers landing on us often click through to Maps for directions. Think of us as one more place customers can find your truck, alongside Maps, Yelp, and your own social.',
  },
  {
    q: 'Can I get an analytics report on how many customers see my page?',
    a:
      'Featured listings include weekly analytics — pageviews, search impressions, click-throughs to your phone and website. Free listings don\'t include analytics, but you can use your own UTM parameters when we link out to your site to track conversions in your own Google Analytics.',
  },
  {
    q: 'What happens if I stop maintaining my listing?',
    a:
      'Listings that haven\'t been updated by the owner in 12+ months get a "may not be current" banner. After 18 months without owner activity, the listing reverts to "unclaimed" status and the owner ownership is removed. You can always reclaim later if you come back.',
  },
];

export default function FaqPage() {
  // FAQPage JSON-LD — Google may render rich results with collapsible Q&A
  // directly in the SERP for queries that match our questions. Real CTR boost
  // when this fires for owner-intent searches.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: { '@type': 'Answer', text: qa.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
            <Link href="/" className="hover:text-ember">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/for-trucks" className="hover:text-ember">For Trucks</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink">FAQ</span>
          </nav>

          <span className="mt-8 inline-block text-xs font-black uppercase tracking-[0.22em] text-ember">
            — Owner FAQ
          </span>
          <h1 className="mt-4 break-words text-[clamp(2.5rem,9vw,5.5rem)] font-black leading-[0.95] tracking-tightest">
            Real questions, real answers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75 md:text-xl">
            Honest answers to the questions truck operators actually ask us. If yours isn&apos;t here, hit{' '}
            <Link href="/contact" className="font-bold text-ember underline-offset-4 hover:underline">
              the contact page
            </Link>{' '}
            and we&apos;ll add it.
          </p>

          <ul className="mt-16 space-y-4">
            {FAQS.map((qa, i) => (
              <li key={i}>
                <details className="group rounded-3xl border border-ink/10 bg-cream-50 transition-colors hover:border-ember/40 open:border-ember/40">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 p-6 md:p-7">
                    <h2 className="text-lg font-black leading-tight tracking-tight text-ink md:text-xl">
                      {qa.q}
                    </h2>
                    <span
                      aria-hidden
                      className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/55 transition-transform duration-300 ease-editorial group-open:rotate-90 group-open:border-ember group-open:text-ember"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </summary>
                  <div className="border-t border-ink/8 px-6 pb-7 pt-5 text-base leading-relaxed text-ink/75 md:px-7">
                    {qa.a}
                  </div>
                </details>
              </li>
            ))}
          </ul>

          <div className="mt-20 rounded-3xl border border-dashed border-ink/15 bg-cream-50 p-8 text-center md:p-12">
            <h3 className="text-2xl font-black tracking-tight md:text-3xl">
              Still have questions?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-base text-ink/65">
              Hit us up. We answer every owner email within two business days.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary text-sm">
                Email us
              </Link>
              <Link
                href="/list-your-truck"
                className="inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-ember hover:text-ember"
              >
                Get listed
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
