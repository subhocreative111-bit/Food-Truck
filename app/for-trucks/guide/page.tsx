import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'How to Claim Your Food Truck Listing — A Step Guide' },
  description:
    'A practical walkthrough of claiming your truck listing on FoodTrucksNearMeUSA, what happens after, and the tactics that actually drive customer traffic to your page.',
  alternates: { canonical: '/for-trucks/guide' },
};

export default function GuidePage() {
  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
      <div className="mx-auto max-w-3xl">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
          <Link href="/" className="hover:text-ember">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/for-trucks" className="hover:text-ember">For Trucks</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink">Guide</span>
        </nav>

        <span className="mt-8 inline-block text-xs font-black uppercase tracking-[0.22em] text-ember">
          — Owner guide
        </span>
        <h1 className="mt-4 break-words text-[clamp(2.5rem,9vw,5.5rem)] font-black leading-[0.95] tracking-tightest">
          How to claim &amp; grow your listing.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75 md:text-xl">
          A practical walkthrough. Takes about ten minutes to read, fifteen minutes to action. Then you&apos;re
          live and findable.
        </p>

        <div className="prose-blog mt-14">
          <h2>Step 1 — Find your truck</h2>
          <p>
            Open the <Link href="/search">search page</Link> and type your truck name. Three possibilities:
          </p>
          <ul>
            <li>
              <strong>You&apos;re listed and unclaimed.</strong> Most common case. We&apos;ve aggregated your
              listing from public sources (Google Maps, public business records). Click into your truck&apos;s page
              and look for the &ldquo;Claim this listing&rdquo; CTA on the right side.
            </li>
            <li>
              <strong>You&apos;re listed and someone&apos;s already claimed it.</strong> If you didn&apos;t do it, it&apos;s
              not authorized — contact us and we&apos;ll investigate within 48 hours. We&apos;ve had this happen
              maybe once across the directory and we resolved it quickly.
            </li>
            <li>
              <strong>You&apos;re not in the directory at all.</strong> Go to{' '}
              <Link href="/list-your-truck">Get listed</Link> and submit a new listing. We review every
              submission within 48 hours.
            </li>
          </ul>

          <h2>Step 2 — Submit the claim form</h2>
          <p>The claim form asks for:</p>
          <ul>
            <li>
              <strong>Your name and role at the truck</strong> — owner, operator, manager, partner. Be honest.
            </li>
            <li>
              <strong>A verifiable contact email</strong> — ideally your business domain email
              (you@yourtruck.com). If you don&apos;t have one, your personal email works but verification takes
              longer because we need an additional check.
            </li>
            <li>
              <strong>A second proof point</strong> — your Instagram handle, your Google Business Profile URL,
              your website, or a phone number we can verify against your public business listing.
            </li>
          </ul>
          <p>
            The form takes 3-5 minutes. Don&apos;t overthink the personal note field — a sentence is fine. We
            mostly want to confirm you&apos;re a real person who runs this truck, not a competitor or scraper.
          </p>

          <h2>Step 3 — Wait for verification (up to 48 hours, usually faster)</h2>
          <p>
            We manually review every claim. The review is fast — typically the same day if you submit during US
            business hours, next business day if you submit overnight or on a weekend. You&apos;ll get an email
            either way:
          </p>
          <ul>
            <li>
              <strong>Approved.</strong> You receive a magic-link to sign in and access your dashboard. The link
              expires in 48 hours — use it sooner rather than later.
            </li>
            <li>
              <strong>Needs more info.</strong> We&apos;ll email you back asking for one additional verification
              proof. Usually a quick photo of your truck or a confirmation from your Instagram DM.
            </li>
            <li>
              <strong>Rejected.</strong> Rare. Happens if the truck has permanently closed, if there&apos;s a
              naming conflict, or if the email domain looks fake. We&apos;ll explain why and how to resolve.
            </li>
          </ul>

          <h2>Step 4 — Update everything that&apos;s wrong</h2>
          <p>
            Once you sign in, the dashboard shows your truck&apos;s current public-facing data. The first thing
            most operators do — and you should too — is audit it for accuracy. Common things to fix:
          </p>
          <ul>
            <li>
              <strong>Hours.</strong> Our auto-pulled hours are from Google Maps, which is right ~75% of the
              time. If you operate on a rotating schedule, set up the &ldquo;weekly schedule&rdquo; field
              instead of fixed daily hours.
            </li>
            <li>
              <strong>Location.</strong> If you&apos;re a mobile-only operation that moves daily, set your
              primary address to your commissary or home base, then use the &ldquo;today&apos;s location&rdquo;
              live-update field to tell customers where you&apos;ll be.
            </li>
            <li>
              <strong>Photos.</strong> Replace the auto-pulled Google Maps photos with your own. Six photos
              maximum — make them count. The first photo is the &ldquo;hero&rdquo; that appears across the
              directory wherever your truck is listed.
            </li>
            <li>
              <strong>Menu / description.</strong> Three sentences about what makes your truck worth visiting.
              Don&apos;t copy your Instagram bio. Write like you&apos;re talking to a customer in line.
            </li>
            <li>
              <strong>Cuisine tags.</strong> Pick up to three. These determine which cuisine directory pages you
              appear on. Be honest — &ldquo;Korean BBQ&rdquo; if you really do Korean BBQ, not &ldquo;Korean&rdquo;
              if you just put kimchi on a burger.
            </li>
            <li>
              <strong>Contact links.</strong> Phone, website, Instagram, Facebook, TikTok. The more ways
              customers can reach you, the better.
            </li>
          </ul>

          <h2>Step 5 — Tactics for getting more customers from your listing</h2>
          <p>
            Once your listing is live and accurate, the practical question is: how do you actually convert it
            into customers? Here&apos;s what we&apos;ve seen work for the operators who use us most successfully.
          </p>

          <h3>1. Update your &ldquo;today&apos;s location&rdquo; daily</h3>
          <p>
            This is the single highest-leverage tactic. The dashboard has a free-text field for &ldquo;where I&apos;ll
            be today.&rdquo; Operators who update this daily get 3-4x more profile views than operators who set it
            once and forget. It&apos;s a five-second action that pays off every time.
          </p>

          <h3>2. Use your truck page URL in your social media bios</h3>
          <p>
            Most truck operators have one Instagram, one Facebook, one TikTok. The bio link slot on each is
            valuable real estate. Pointing it at your FoodTrucksNearMeUSA page (which is mobile-friendly,
            includes your hours, links to call you, and links to your social) is a cleaner conversion path than
            pointing at &ldquo;linktr.ee/yourtruck&rdquo;.
          </p>

          <h3>3. Encourage reviews — on Google, not on us</h3>
          <p>
            We don&apos;t currently host reviews directly (we aggregate Google ratings). The trucks that get the
            most clicks are the ones with the highest review counts. Encourage customers to leave a Google review
            — the rating shows up on your listing and helps you rank higher.
          </p>

          <h3>4. Add a UTM parameter when you link to your truck page</h3>
          <p>
            If you have a website with Google Analytics, link to your truck page using a UTM like{' '}
            <code>?utm_source=ftnm&amp;utm_medium=referral</code>. This lets you measure how much traffic
            FoodTrucksNearMeUSA sends you. Real data beats anecdote.
          </p>

          <h3>5. Reply to customer questions fast</h3>
          <p>
            We&apos;re building a customer-question feature later this year. When it ships, response time matters
            — operators who reply within an hour get noticeably better visibility in the directory rankings. Plan
            for it.
          </p>

          <h2>Common mistakes new owners make</h2>
          <ul>
            <li>
              <strong>Setting hours and never updating them.</strong> Food trucks have variable schedules. A
              static &ldquo;Mon-Fri 11am-2pm&rdquo; listing that&apos;s wrong half the time loses customer trust.
            </li>
            <li>
              <strong>Uploading too-dark or too-cluttered photos.</strong> The best truck photos are taken in
              daylight, show the food clearly, and have minimal text overlay. Phone cameras are fine.
            </li>
            <li>
              <strong>Stuffing the description with keywords.</strong> &ldquo;Best taco truck Houston Texas
              authentic mexican tacos al pastor carnitas&rdquo; reads like spam to both humans and Google. Write
              like a human.
            </li>
            <li>
              <strong>Not picking the right cuisine tags.</strong> A truck that picks 8 cuisines (we cap at 3)
              doesn&apos;t rank well on any cuisine page. Pick what you&apos;re actually known for.
            </li>
            <li>
              <strong>Forgetting about it for six months.</strong> Listings need light maintenance. Five minutes
              a week — update location, replace a photo, fix a closed day — keeps your ranking signals strong.
            </li>
          </ul>

          <h2>What to do next</h2>
          <p>
            If you&apos;ve read this far, you&apos;re ready. Two paths:
          </p>
          <ul>
            <li>
              If your truck is already in our directory: search for it on{' '}
              <Link href="/search">the search page</Link>, click into your truck&apos;s page, and hit{' '}
              <em>Claim this listing</em>.
            </li>
            <li>
              If your truck isn&apos;t listed yet: <Link href="/list-your-truck">Get listed</Link>.
            </li>
          </ul>
          <p>
            Have questions? Read the <Link href="/for-trucks/faq">FAQ</Link> or{' '}
            <Link href="/contact">email us</Link>. We answer every owner email within two business days.
          </p>
        </div>
      </div>
    </section>
  );
}
