import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms that govern your use of FoodTrucksNearMeUSA — covering listings, owner accounts, content accuracy, intellectual property and limitation of liability.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  const updated = 'May 31, 2026';
  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Terms of Service</span>
        <h1 className="mt-4 break-words text-[clamp(2.5rem,9vw,5.5rem)] font-black leading-[0.95] tracking-tightest">
          The fine print.
        </h1>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-ink/45">
          Last updated · {updated}
        </p>
        <p className="mt-8 text-lg leading-relaxed text-ink/75">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of foodtrucksnearmeusa.com (the
          &ldquo;Site&rdquo;), operated by FoodTrucksNearMeUSA (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the Site
          you agree to these Terms. If you do not agree, please don&apos;t use the Site.
        </p>

        <div className="prose mt-14 space-y-10 text-base leading-relaxed text-ink/75">
          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">1. What this site is</h2>
            <p className="mt-4">
              The Site is a curated directory of independent food trucks across the United States. Listings include
              business names, locations, hours, photos, ratings and reviews compiled from publicly available sources
              and, where available, supplied directly by the truck operators themselves.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">2. Eligibility</h2>
            <p className="mt-4">
              You must be at least 13 years old to use the Site. If you create an owner account, you must have the
              authority to represent the food truck or business you are claiming.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">3. Owner accounts and listings</h2>
            <p className="mt-4">
              When you claim or submit a listing, you represent that:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>You are the owner or an authorised representative of the business.</li>
              <li>The information you provide is accurate, current and complete.</li>
              <li>
                You own (or have the necessary rights to use) any photos, logos or content you upload, and you grant
                us a non-exclusive, royalty-free licence to display them on the Site.
              </li>
              <li>You will keep your listing reasonably up to date.</li>
            </ul>
            <p className="mt-4">
              We reserve the right to refuse, edit or remove any listing at our discretion — including listings that
              appear to be inactive, misleading, fraudulent or in violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">4. Acceptable use</h2>
            <p className="mt-4">When using the Site, you agree not to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Scrape, crawl, harvest or otherwise collect data from the Site at scale without our written consent.</li>
              <li>Use the Site to send spam, harass other users, or impersonate any person or business.</li>
              <li>Upload content that is unlawful, defamatory, hateful, sexually explicit, or infringes the rights of others.</li>
              <li>Attempt to gain unauthorised access to any part of the Site, its servers or its data.</li>
              <li>Interfere with the operation of the Site or any features we provide.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">5. Content accuracy and disclaimer</h2>
            <p className="mt-4">
              We work hard to keep listings accurate, but the food-truck world moves fast. Hours change. Trucks move.
              Menus evolve. Information on the Site is provided <strong>&ldquo;as is&rdquo;</strong> without
              warranties of any kind. We do not guarantee that any listing is current, complete or error-free, and we
              are not responsible for the food, service, prices or conduct of any business listed. Always call ahead
              for important details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">6. Intellectual property</h2>
            <p className="mt-4">
              The Site, including its design, code, logos, editorial content, and the compilation of listings, is
              owned by us and protected by copyright, trademark and other laws. You may view and share individual
              listings for personal, non-commercial purposes. You may not copy, modify, distribute, sell or lease any
              part of the Site without our written permission.
            </p>
            <p className="mt-4">
              Business names, logos and photos belonging to listed food trucks remain the property of those
              businesses. They are displayed for the purpose of identifying the business in our directory.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">7. Third-party links and ads</h2>
            <p className="mt-4">
              The Site contains links to external websites operated by food trucks and other third parties. We
              don&apos;t control those sites and aren&apos;t responsible for their content, privacy practices or
              policies. The Site also displays advertising served by Google AdSense and similar partners — clicking
              an ad takes you to the advertiser&apos;s site, governed by their terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">8. Disclaimer of warranties</h2>
            <p className="mt-4">
              TO THE FULLEST EXTENT PERMITTED BY LAW, THE SITE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">9. Limitation of liability</h2>
            <p className="mt-4">
              TO THE EXTENT PERMITTED BY LAW, FOODTRUCKSNEARMEUSA WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE. OUR
              AGGREGATE LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS WILL NOT EXCEED US $100 OR THE AMOUNT YOU
              PAID US IN THE PRIOR 12 MONTHS, WHICHEVER IS GREATER.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">10. Termination</h2>
            <p className="mt-4">
              We may suspend or terminate your access to the Site at any time, with or without notice, if we believe
              you have violated these Terms. You may stop using the Site at any time. Provisions of these Terms that
              by their nature should survive termination — including intellectual property, disclaimers and limitation
              of liability — will survive.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">11. Changes to these Terms</h2>
            <p className="mt-4">
              We may revise these Terms from time to time. When we do, we&apos;ll update the &ldquo;Last
              updated&rdquo; date above and announce significant changes via a banner on the Site for at least 30
              days. Continued use of the Site after changes take effect means you accept the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">12. Governing law</h2>
            <p className="mt-4">
              These Terms are governed by the laws of India, without regard to its conflict-of-laws principles. Any
              disputes will be resolved exclusively in the courts located in Kolkata, India — except where local
              consumer-protection laws require otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">13. Contact</h2>
            <p className="mt-4">
              Questions about these Terms? Reach us through{' '}
              <a href="/contact" className="font-bold text-ember underline-offset-4 hover:underline">
                the contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
