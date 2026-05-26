import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'List your truck',
  description: 'Get your food truck listed on FoodTrucksNearMeUSA. Free basic listing or upgrade to Featured for priority placement.',
};

const PLAN_FREE = {
  name: 'Basic',
  price: 'Free',
  blurb: 'Get listed across all 50 states.',
  cta: 'List for free',
  href: '#apply',
  features: [
    { label: 'Listing on your state & city pages', on: true },
    { label: 'Hours, address, phone, website', on: true },
    { label: 'Up to 3 photos', on: true },
    { label: 'Cuisine tags', on: true },
    { label: 'Priority placement', on: false },
    { label: 'Featured badge', on: false },
    { label: 'Weekly analytics email', on: false },
    { label: 'Editorial photography slot', on: false },
  ],
};

const PLAN_FEATURED = {
  name: 'Featured',
  price: '$29',
  blurb: 'Top placement, more photos, more traffic.',
  cta: 'Upgrade to Featured',
  href: '#apply',
  features: [
    { label: 'Listing on your state & city pages', on: true },
    { label: 'Hours, address, phone, website', on: true },
    { label: 'Up to 12 photos', on: true },
    { label: 'Cuisine tags', on: true },
    { label: 'Priority placement (top of state)', on: true },
    { label: 'Featured badge on every card', on: true },
    { label: 'Weekly analytics email', on: true },
    { label: 'Editorial photography slot (per quarter)', on: true },
  ],
};

export default function ListYourTruckPage() {
  return (
    <>
      <section className="grain relative isolate overflow-hidden px-6 pb-12 pt-12 md:px-10 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— For owners</span>
          <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,8.5rem)] font-black leading-[0.92] tracking-tightest">
            Get found by
            <br />
            hungry locals.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl">
            Free basic listing — no credit card. Upgrade to Featured for top placement on your city and state pages,
            extra photo slots, and weekly traffic analytics.
          </p>
        </div>
      </section>

      <section id="featured" className="px-6 pb-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <PlanCard plan={PLAN_FREE} />
          <PlanCard plan={PLAN_FEATURED} accent />
        </div>
      </section>

      <section id="apply" className="px-6 pb-32 md:px-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-ink/10 bg-cream-50 p-8 md:p-12">
          <h2 className="text-4xl font-black tracking-tightest md:text-5xl">Apply for a listing.</h2>
          <p className="mt-4 text-base text-ink/65 md:text-lg">
            Tell us about your truck. We&apos;ll review and reach out within two business days.
          </p>
          <form className="mt-10 grid gap-5">
            <Field label="Truck name" name="name" required />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="City" name="city" required />
              <Field label="State" name="state" required />
            </div>
            <Field label="Primary cuisine" name="cuisine" required />
            <Field label="Owner email" name="email" type="email" required />
            <Field label="Instagram / website (optional)" name="link" />
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">Tell us about the truck</span>
              <textarea
                rows={5}
                className="rounded-2xl border border-ink/15 bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
                placeholder="What's your signature dish, where do you usually park, anything you want us to know?"
              />
            </label>
            <fieldset className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="plan" defaultChecked className="accent-ember" />
                <span className="text-sm font-bold">Basic — free</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="plan" className="accent-ember" />
                <span className="text-sm font-bold">Featured — $29/mo</span>
              </label>
            </fieldset>
            <button type="button" className="btn-primary mt-2 w-full text-base">Submit application</button>
            <p className="text-center text-xs text-ink/45">No payment required to apply.</p>
          </form>
        </div>
      </section>
    </>
  );
}

function PlanCard({ plan, accent }: { plan: typeof PLAN_FREE; accent?: boolean }) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 md:p-10
                  ${accent
                    ? 'border-ember bg-ink text-cream shadow-[0_40px_80px_-30px_rgba(200,70,58,0.45)]'
                    : 'border-ink/10 bg-cream-50 text-ink'}`}
    >
      {accent && <span className="featured-pill absolute right-6 top-6">Most popular</span>}
      <h3 className={`text-3xl font-black tracking-tight ${accent ? 'text-cream' : 'text-ink'}`}>{plan.name}</h3>
      <p className={`mt-1 text-sm ${accent ? 'text-cream/65' : 'text-ink/60'}`}>{plan.blurb}</p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="tabular text-6xl font-black tracking-tightest">{plan.price}</span>
        {plan.price !== 'Free' && <span className={`text-sm font-bold ${accent ? 'text-cream/60' : 'text-ink/55'}`}>/month</span>}
      </div>
      <ul className="mt-8 space-y-3">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-center gap-3 text-sm">
            <span
              className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full
                          ${f.on
                            ? accent ? 'bg-saffron text-ink' : 'bg-ember text-cream'
                            : accent ? 'bg-cream/10 text-cream/45' : 'bg-ink/8 text-ink/40'}`}
            >
              {f.on ? <Check className="h-3 w-3" strokeWidth={3.5} /> : <X className="h-3 w-3" strokeWidth={3.5} />}
            </span>
            <span className={f.on ? '' : accent ? 'text-cream/40 line-through' : 'text-ink/40 line-through'}>{f.label}</span>
          </li>
        ))}
      </ul>
      <Link
        href={plan.href}
        className={`mt-10 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black
                    transition-all duration-300
                    ${accent
                      ? 'bg-saffron text-ink hover:bg-cream'
                      : 'bg-ink text-cream hover:bg-ember'}`}
      >
        {plan.cta}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Field({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">
        {label}{required && <span className="ml-1 text-ember">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
      />
    </label>
  );
}
