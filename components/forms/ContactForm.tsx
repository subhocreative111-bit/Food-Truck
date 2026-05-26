'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { getSupabase, supabaseConfigured } from '@/lib/supabase/client';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (!supabaseConfigured) {
        throw new Error('Contact form isn\'t live yet. Email hello@foodtrucksnearmeusa.com directly.');
      }
      const supabase = getSupabase();
      const { error: e1 } = await supabase.from('submissions').insert({
        kind: 'contact',
        name: name || null,
        email: email || null,
        subject: subject || null,
        message,
        meta: { source: 'contact_page', ua: typeof navigator !== 'undefined' ? navigator.userAgent : null },
      });
      if (e1) throw e1;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send. Please email directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-saffron/30 bg-saffron/10 p-12 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-saffron-700" />
        <h2 className="mt-4 text-3xl font-black tracking-tight">Message sent.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/65">
          We&apos;ll reply to <strong className="font-bold text-ink">{email}</strong> within a couple of days.
        </p>
        <button onClick={() => { setDone(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }} className="btn-ghost mt-6 text-sm">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-ink/10 bg-cream-50 p-8 md:p-12">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Your name" required value={name} onChange={setName} />
        <Field label="Email" type="email" required value={email} onChange={setEmail} />
      </div>
      <Field label="Subject" required value={subject} onChange={setSubject} />
      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">Message <span className="text-ember">*</span></span>
        <textarea
          rows={6}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-2xl border border-ink/15 bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
          placeholder="What's on your mind?"
        />
      </label>
      {error && (
        <div className="rounded-2xl border border-ember/30 bg-ember-50 px-4 py-3 text-sm text-ember-700">{error}</div>
      )}
      <button type="submit" disabled={submitting} className="btn-primary mt-2 justify-center text-base disabled:opacity-60">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

function Field({
  label, value, onChange, required, type = 'text',
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">
        {label}{required && <span className="ml-1 text-ember">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
      />
    </label>
  );
}
