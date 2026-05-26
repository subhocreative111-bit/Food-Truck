'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/supabase/hooks';
import { getSupabase, supabaseConfigured } from '@/lib/supabase/client';
import { slugify } from '@/lib/slug';

/**
 * Owner-side claim/apply form. Writes one row to public.claims and one
 * row to public.submissions (so admins see it in the unified inbox even
 * if claims slip past the email digest).
 *
 * Requires the user to be signed in — claims.user_id is NOT NULL and the
 * RLS policy needs auth.uid().
 */
export default function ClaimForm() {
  const { user, loading: sessionLoading } = useSession();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState<'basic' | 'featured'>('basic');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!supabaseConfigured) {
    return (
      <div className="rounded-3xl border border-dashed border-ink/15 bg-cream-50 p-8 text-sm text-ink/60">
        Online applications aren&apos;t configured yet. Email us at
        <a href="mailto:hello@foodtrucksnearmeusa.com" className="ml-1 font-bold text-ember underline-offset-4 hover:underline">
          hello@foodtrucksnearmeusa.com
        </a>
        and we&apos;ll get you listed.
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-ink/10 bg-cream-50 p-8 text-sm text-ink/60">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-cream-50 p-8 md:p-12">
        <h2 className="text-2xl font-black tracking-tight">First, create your owner account.</h2>
        <p className="mt-3 max-w-md text-sm text-ink/65">
          Sign in or create a free account so we can attach the application to you and let you
          edit your listing later.
        </p>
        <Link href="/sign-in/" className="btn-primary mt-6 text-base">
          Sign in to continue
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-saffron/30 bg-saffron/10 p-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-saffron-700" />
        <h2 className="mt-4 text-3xl font-black tracking-tight">Application received.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/65">
          We&apos;ll review and reach out within two business days. Once approved, you&apos;ll
          be able to edit your listing and upload photos from the owner dashboard.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/owner/" className="btn-primary text-sm">View my applications</Link>
          <button onClick={() => { setSuccess(false); setName(''); setCity(''); setState(''); setCuisine(''); setLink(''); setMessage(''); setPhone(''); }} className="btn-ghost text-sm">
            Submit another
          </button>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const supabase = getSupabase();
    try {
      // Slug a best-guess truck slug from name + city. Admin can re-link to
      // a specific listing during approval.
      const truckSlug = slugify(`${name}-${city}`);

      const { error: e1 } = await supabase.from('claims').insert({
        truck_slug: truckSlug,
        truck_name: name,
        city: city || null,
        state: state || null,
        cuisine: cuisine || null,
        user_id: user.id,
        applicant_email: user.email!,
        applicant_name: user.user_metadata?.full_name ?? null,
        applicant_phone: phone || null,
        message: [
          plan === 'featured' ? '[FEATURED PLAN REQUESTED]' : null,
          link ? `Link: ${link}` : null,
          message || null,
        ].filter(Boolean).join('\n\n') || null,
      });
      if (e1) throw e1;

      // Also drop a submissions row for the unified inbox
      await supabase.from('submissions').insert({
        kind: 'claim',
        name: user.user_metadata?.full_name ?? null,
        email: user.email,
        subject: `Claim: ${name} — ${city || '?'}, ${state || '?'}`,
        message: message || `${name} in ${city}, ${state} (${cuisine || 'cuisine TBD'}). Plan: ${plan}.`,
        meta: { truck_slug: truckSlug, plan, link },
      });

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-ink/10 bg-cream-50 p-8 md:p-12">
      <h2 className="text-4xl font-black tracking-tightest md:text-5xl">Apply for a listing.</h2>
      <p className="mt-4 text-base text-ink/65 md:text-lg">
        Signed in as <strong className="font-bold text-ink">{user.email}</strong>. Tell us about
        your truck. We&apos;ll review and reach out within two business days.
      </p>

      <form onSubmit={submit} className="mt-10 grid gap-5">
        <Field label="Truck name" value={name} onChange={setName} required />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="City" value={city} onChange={setCity} required />
          <Field label="State" value={state} onChange={setState} required placeholder="e.g. California" />
        </div>
        <Field label="Primary cuisine" value={cuisine} onChange={setCuisine} required placeholder="Tacos, BBQ, Vegan…" />
        <Field label="Phone (optional)" value={phone} onChange={setPhone} type="tel" />
        <Field label="Instagram or website (optional)" value={link} onChange={setLink} placeholder="https://instagram.com/yourtruck" />

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">Tell us about the truck</span>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-2xl border border-ink/15 bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
            placeholder="Signature dish, regular parking spot, anything we should know."
          />
        </label>

        <fieldset className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="plan" checked={plan === 'basic'} onChange={() => setPlan('basic')} className="accent-ember" />
            <span className="text-sm font-bold">Basic — free</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="plan" checked={plan === 'featured'} onChange={() => setPlan('featured')} className="accent-ember" />
            <span className="text-sm font-bold">Featured — $29/mo</span>
          </label>
        </fieldset>

        {error && (
          <div className="rounded-2xl border border-ember/30 bg-ember-50 px-4 py-3 text-sm text-ember-700">
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full justify-center text-base disabled:opacity-60">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Submitting…' : 'Submit application'}
        </button>
        <p className="text-center text-xs text-ink/45">No payment required to apply. We&apos;ll only charge once you upgrade to Featured.</p>
      </form>
    </div>
  );
}

function Field({
  label, value, onChange, required, type = 'text', placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">
        {label}{required && <span className="ml-1 text-ember">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
      />
    </label>
  );
}
