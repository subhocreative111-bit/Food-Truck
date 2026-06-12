'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { getSupabase, supabaseConfigured } from '@/lib/supabase/client';

/**
 * Catering lead-capture form. Writes to the existing Supabase `submissions`
 * table with kind='catering' — which means the notify-submission webhook
 * fires and the operator gets an email for every lead, with zero new
 * infrastructure.
 *
 * If the visitor arrived from a truck page's "Book for catering" button the
 * URL carries ?truck=<name>; we read it client-side (no useSearchParams —
 * avoids the Suspense-boundary requirement under static export).
 */
export default function CateringQuoteForm({ defaultCity }: { defaultCity?: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(defaultCity ?? '');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');
  const [message, setMessage] = useState('');
  const [truckRef, setTruckRef] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('truck');
    if (t) setTruckRef(t);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (!supabaseConfigured) {
        throw new Error('The quote form isn\'t live yet — email hello@foodtrucksnearmeusa.com with your event details.');
      }
      const supabase = getSupabase();
      const { error: e1 } = await supabase.from('submissions').insert({
        kind: 'catering',
        name: name || null,
        email: email || null,
        subject: `Catering inquiry — ${city || 'unspecified city'}${truckRef ? ` — ${truckRef}` : ''}`,
        message,
        meta: {
          source: 'catering_form',
          city: city || null,
          phone: phone || null,
          event_date: eventDate || null,
          event_type: eventType || null,
          guest_count: guests || null,
          truck: truckRef,
          ua: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        },
      });
      if (e1) throw e1;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send. Please email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-saffron/30 bg-saffron/10 p-12 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-saffron-700" />
        <h3 className="mt-4 text-3xl font-black tracking-tight">Request received.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/65">
          We&apos;ll match your event with available trucks and reply to{' '}
          <strong className="font-bold text-ink">{email}</strong> within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-ink/10 bg-cream-50 p-8 md:p-10">
      {truckRef && (
        <div className="rounded-2xl border border-saffron/40 bg-saffron/10 px-4 py-3 text-sm font-bold text-ink">
          Booking inquiry for: <span className="text-ember">{truckRef}</span>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Your name" required value={name} onChange={setName} />
        <Field label="Email" type="email" required value={email} onChange={setEmail} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Phone" type="tel" value={phone} onChange={setPhone} />
        <Field label="Event city" required value={city} onChange={setCity} placeholder="e.g. Austin, TX" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Event date" type="date" value={eventDate} onChange={setEventDate} />
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">Event type</span>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-base text-ink focus:border-ember focus:outline-none"
          >
            <option value="">Select…</option>
            <option>Corporate / office</option>
            <option>Wedding</option>
            <option>Birthday / private party</option>
            <option>Festival / community event</option>
            <option>School / campus</option>
            <option>Other</option>
          </select>
        </label>
        <Field label="Guest count" value={guests} onChange={setGuests} placeholder="e.g. 75" />
      </div>
      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">
          Tell us about the event <span className="text-ember">*</span>
        </span>
        <textarea
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-2xl border border-ink/15 bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
          placeholder="Date flexibility, cuisine preferences, budget range, venue details — whatever helps us match you with the right truck."
        />
      </label>
      {error && (
        <div className="rounded-2xl border border-ember/30 bg-ember-50 px-4 py-3 text-sm text-ember-700">{error}</div>
      )}
      <button type="submit" disabled={submitting} className="btn-primary mt-2 justify-center text-base disabled:opacity-60">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? 'Sending…' : 'Get free quotes'}
      </button>
      <p className="text-center text-xs text-ink/45">
        Free to use. No obligation. We connect you with trucks — you book direct.
      </p>
    </form>
  );
}

function Field({
  label, value, onChange, required, type = 'text', placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; type?: string; placeholder?: string;
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
