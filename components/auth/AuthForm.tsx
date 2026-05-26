'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { getSupabase, supabaseConfigured } from '@/lib/supabase/client';

type Mode = 'sign-in' | 'sign-up';

interface Props {
  defaultMode?: Mode;
  redirectTo?: string;
  /** Called on successful sign-in/sign-up, before the redirect fires. */
  onSuccess?: () => void;
}

export default function AuthForm({ defaultMode = 'sign-in', redirectTo = '/owner/', onSuccess }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!supabaseConfigured) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 bg-cream-50 p-6 text-sm text-ink/65">
        Owner accounts aren&apos;t configured yet. The site admin needs to set up Supabase
        credentials before sign-in works.
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = getSupabase();
    try {
      if (mode === 'sign-up') {
        const { error: e1 } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name || undefined } },
        });
        if (e1) throw e1;
        setMessage('Check your email to confirm your account, then sign in.');
        setMode('sign-in');
      } else {
        const { error: e1 } = await supabase.auth.signInWithPassword({ email, password });
        if (e1) throw e1;
        onSuccess?.();
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="flex gap-2 rounded-full bg-cream-100 p-1 text-sm font-bold">
        <button
          type="button"
          onClick={() => { setMode('sign-in'); setError(null); setMessage(null); }}
          className={`flex-1 rounded-full px-4 py-2 transition-colors ${
            mode === 'sign-in' ? 'bg-cream text-ink shadow-sm' : 'text-ink/55'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => { setMode('sign-up'); setError(null); setMessage(null); }}
          className={`flex-1 rounded-full px-4 py-2 transition-colors ${
            mode === 'sign-up' ? 'bg-cream text-ink shadow-sm' : 'text-ink/55'
          }`}
        >
          Create account
        </button>
      </div>

      {mode === 'sign-up' && (
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maria from Tico Taco"
            className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
          />
        </label>
      )}

      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">
          Email <span className="text-ember">*</span>
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">
          Password <span className="text-ember">*</span>
        </span>
        <input
          type="password"
          required
          minLength={8}
          autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'sign-up' ? 'At least 8 characters' : ''}
          className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
        />
      </label>

      {error && (
        <div className="rounded-2xl border border-ember/30 bg-ember-50 px-4 py-3 text-sm text-ember-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-2xl border border-saffron/40 bg-saffron/15 px-4 py-3 text-sm text-saffron-700">
          {message}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary justify-center text-base disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {loading ? 'Working…' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
      </button>

      <p className="text-center text-xs text-ink/45">
        {mode === 'sign-up'
          ? 'By creating an account you agree to receive emails about your listings.'
          : 'Forgot your password? Email hello@foodtrucksnearmeusa.com'}
      </p>
    </form>
  );
}
