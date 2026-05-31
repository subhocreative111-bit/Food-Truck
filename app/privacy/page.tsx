import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How FoodTrucksNearMeUSA collects, uses and protects your information — including cookies, analytics, advertising and owner account data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  const updated = 'May 31, 2026';
  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Privacy Policy</span>
        <h1 className="mt-4 break-words text-[clamp(2.5rem,9vw,5.5rem)] font-black leading-[0.95] tracking-tightest">
          Your data, plainly.
        </h1>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-ink/45">
          Last updated · {updated}
        </p>
        <p className="mt-8 text-lg leading-relaxed text-ink/75">
          FoodTrucksNearMeUSA (&ldquo;we&rdquo;, &ldquo;us&rdquo;) runs the website at{' '}
          <a href="https://foodtrucksnearmeusa.com" className="font-bold text-ember underline-offset-4 hover:underline">
            foodtrucksnearmeusa.com
          </a>
          . This policy explains what we collect, why we collect it, who we share it with, and how to contact us. We
          aim to keep it in plain English. If anything is unclear, please{' '}
          <a href="/contact" className="font-bold text-ember underline-offset-4 hover:underline">
            email us
          </a>
          .
        </p>

        <div className="prose mt-14 space-y-10 text-base leading-relaxed text-ink/75">
          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">1. Information we collect</h2>
            <p className="mt-4">
              We collect two broad categories of information.
            </p>
            <h3 className="mt-6 text-lg font-black text-ink">a. Information you provide directly</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Owner accounts.</strong> If you claim or list a food truck, we collect your email address,
                display name, the business details you submit (truck name, location, hours, photos, contact details)
                and any messages you send us.
              </li>
              <li>
                <strong>Contact form.</strong> If you write to us via the contact page, we receive your message, the
                email address you provide, and basic metadata about the submission.
              </li>
            </ul>
            <h3 className="mt-6 text-lg font-black text-ink">b. Information collected automatically</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Usage analytics.</strong> Pages viewed, approximate location (city / country derived from IP),
                device type, browser, referrer, and the time you spent on a page. We use Google Analytics 4 for this.
              </li>
              <li>
                <strong>Advertising signals.</strong> When ads are displayed, our advertising partners (Google AdSense
                and similar) may set cookies that record general interest categories so they can deliver more relevant
                ads.
              </li>
              <li>
                <strong>Server logs.</strong> Standard web-server logs (IP address, user-agent, request path, status
                code) retained for a short period for security and debugging.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">2. How we use your information</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>To operate, maintain and improve the website and its directory listings.</li>
              <li>To authenticate owner accounts and let owners manage their listings.</li>
              <li>To respond to your messages and support requests.</li>
              <li>To measure traffic, identify popular content and diagnose technical problems.</li>
              <li>To display advertising that helps fund the site.</li>
              <li>To prevent abuse, fraud and policy violations.</li>
            </ul>
            <p className="mt-4">
              We do not sell your personal information. We do not share your contact details with third parties for
              their independent marketing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">3. Cookies and similar technologies</h2>
            <p className="mt-4">
              We use cookies and similar tracking technologies in three buckets:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <strong>Strictly necessary.</strong> Required for the site to function — for example, keeping you
                signed in as an owner.
              </li>
              <li>
                <strong>Analytics.</strong> Google Analytics 4 cookies that help us understand how visitors use the
                site in aggregate.
              </li>
              <li>
                <strong>Advertising.</strong> Cookies set by Google AdSense and its partners to serve and measure
                ads, including personalised advertising where you have consented.
              </li>
            </ul>
            <p className="mt-4">
              You can manage your consent at any time through the cookie banner shown on first visit, your browser
              settings, and Google&apos;s{' '}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-ember underline-offset-4 hover:underline"
              >
                Ads Settings
              </a>
              . Blocking cookies may break some site features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">4. Third-party services we use</h2>
            <p className="mt-4">We rely on a small set of trusted third-party providers:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <strong>Google Analytics 4</strong> — usage analytics. Subject to{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-ember underline-offset-4 hover:underline"
                >
                  Google&apos;s privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Google AdSense</strong> — advertising. Google may use cookies to serve ads based on your
                prior visits. See{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-ember underline-offset-4 hover:underline"
                >
                  how Google uses information from sites that use its services
                </a>
                .
              </li>
              <li>
                <strong>Supabase</strong> — authentication and database for owner accounts. Hosted in the United
                States.
              </li>
              <li>
                <strong>Resend</strong> — transactional email delivery for account verification and notifications.
              </li>
              <li>
                <strong>Hostinger</strong> — web hosting infrastructure.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">5. Legal bases (EEA / UK)</h2>
            <p className="mt-4">
              If you are in the European Economic Area or the United Kingdom, our legal bases for processing your data
              are: (a) your <em>consent</em> for analytics and advertising cookies; (b) <em>contractual necessity</em>{' '}
              when you create an owner account or contact us; and (c) our <em>legitimate interests</em> in running and
              securing the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">6. Your rights</h2>
            <p className="mt-4">
              Depending on where you live, you may have the right to access, correct, delete or export your personal
              information, to withdraw consent, and to object to certain processing. California residents have
              additional rights under the CCPA, including the right to opt out of the &ldquo;sale&rdquo; or
              &ldquo;sharing&rdquo; of personal information. To exercise any of these rights, email{' '}
              <a href="/contact" className="font-bold text-ember underline-offset-4 hover:underline">
                our contact form
              </a>{' '}
              and identify yourself so we can locate your records.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">7. Children</h2>
            <p className="mt-4">
              The site is not directed at children under 13 and we do not knowingly collect personal information from
              children. If you believe a child has provided us with personal information, please contact us and we
              will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">8. Data retention</h2>
            <p className="mt-4">
              Owner-account records are retained for as long as the account is active, plus a short grace period in
              case the account is reactivated. Analytics data is retained per Google&apos;s default retention period.
              You can request deletion of your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">9. International transfers</h2>
            <p className="mt-4">
              Our infrastructure providers are based in the United States. If you access the site from another
              country, your information may be transferred to and processed in the United States. Where required, we
              use standard contractual clauses or equivalent safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">10. Changes to this policy</h2>
            <p className="mt-4">
              We may update this policy from time to time. When we do, we&apos;ll change the &ldquo;Last updated&rdquo;
              date at the top of this page. Material changes will be announced via a banner on the site for at least
              30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black tracking-tight text-ink">11. Contact</h2>
            <p className="mt-4">
              Questions about this policy or your data? Reach us via{' '}
              <a href="/contact" className="font-bold text-ember underline-offset-4 hover:underline">
                the contact page
              </a>
              . We&apos;ll respond within two business days.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
