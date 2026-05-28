import type { Metadata } from 'next';
import AuthForm from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to claim or edit your food truck listing.',
  alternates: { canonical: '/sign-in' },
};

export default function SignInPage() {
  return (
    <section className="grain relative isolate min-h-[80vh] px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— For owners</span>
          <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,7rem)] font-black leading-[0.92] tracking-tightest">
            Run a truck?
            <br />
            Claim it.
          </h1>
          <p className="mt-6 max-w-md text-base text-ink/65 md:text-lg">
            One free account lets you claim your listing, upload real photos, and update your hours.
            We&apos;ll add live check-in and analytics in the coming weeks.
          </p>
          <ul className="mt-8 grid gap-3 text-sm text-ink/75">
            {['Claim your listing — free, always', 'Upload your own photos', 'Edit hours, cuisines, contact info', 'Show as Featured on your city page (coming soon)'].map((s) => (
              <li key={s} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember text-cream">
                  <svg viewBox="0 0 16 16" className="h-2.5 w-2.5"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-cream-50 p-8 md:p-10">
          <AuthForm defaultMode="sign-in" redirectTo="/owner/" />
        </div>
      </div>
    </section>
  );
}
