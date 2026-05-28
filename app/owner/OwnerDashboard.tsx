'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Loader2, Plus, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useSession } from '@/lib/supabase/hooks';
import { getSupabase, supabaseConfigured } from '@/lib/supabase/client';
import AuthForm from '@/components/auth/AuthForm';
import PhotoUploader from '@/components/owner/PhotoUploader';
import EditListingForm from '@/components/owner/EditListingForm';
import type { Claim } from '@/lib/supabase/types';

export default function OwnerDashboard() {
  const { user, loading: sessionLoading } = useSession();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const supabase = getSupabase();
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('claims')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!cancelled) {
        setClaims((data as Claim[]) ?? []);
        const firstApproved = (data as Claim[] | null)?.find((c) => c.status === 'approved');
        setActiveSlug(firstApproved?.truck_slug ?? null);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (!supabaseConfigured) {
    return (
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-ink/15 bg-cream-50 p-12 text-center">
          <h1 className="text-3xl font-black tracking-tight">Owner dashboard isn&apos;t live yet.</h1>
          <p className="mt-3 text-sm text-ink/65">
            The site admin needs to configure Supabase credentials before owner accounts work.
          </p>
        </div>
      </section>
    );
  }

  if (sessionLoading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink/40" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="grain relative isolate px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Owner dashboard</span>
            <h1 className="mt-4 break-words text-[clamp(2.5rem,10vw,6rem)] font-black leading-[0.92] tracking-tightest">
              Sign in to manage your truck.
            </h1>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-cream-50 p-8 md:p-10">
            <AuthForm redirectTo="/owner/" />
          </div>
        </div>
      </section>
    );
  }

  const approved = claims.filter((c) => c.status === 'approved');
  const pending  = claims.filter((c) => c.status === 'pending');
  const rejected = claims.filter((c) => c.status === 'rejected');

  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-16">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Owner dashboard</span>
        <h1 className="mt-4 break-words text-[clamp(2.5rem,10vw,6rem)] font-black leading-[0.92] tracking-tightest">
          Hi, {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}.
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink/65 md:text-lg">
          Your claimed trucks and pending applications.
        </p>

        {loading && (
          <div className="mt-12 flex items-center gap-3 text-sm text-ink/45">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your trucks…
          </div>
        )}

        {!loading && claims.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-ink/15 bg-cream-50 p-12 text-center">
            <h2 className="text-2xl font-black tracking-tight">No claims yet.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-ink/65">
              Submit a claim application from the <Link href="/list-your-truck/" className="font-bold text-ember underline-offset-4 hover:underline">Get listed</Link> page.
              We&apos;ll review within two business days.
            </p>
            <Link href="/list-your-truck/" className="btn-primary mt-6 text-sm">
              <Plus className="h-4 w-4" /> New application
            </Link>
          </div>
        )}

        {!loading && claims.length > 0 && (
          <div className="mt-12 grid gap-10 lg:grid-cols-[300px_1fr]">
            <aside className="space-y-6">
              {approved.length > 0 && (
                <ClaimSection title="Approved" claims={approved} active={activeSlug} onPick={setActiveSlug} icon={<CheckCircle2 className="h-4 w-4 text-ember" />} />
              )}
              {pending.length > 0 && (
                <ClaimSection title="Pending review" claims={pending} active={null} icon={<Clock className="h-4 w-4 text-saffron-700" />} />
              )}
              {rejected.length > 0 && (
                <ClaimSection title="Not approved" claims={rejected} active={null} icon={<XCircle className="h-4 w-4 text-ink/45" />} />
              )}
              <Link href="/list-your-truck/" className="btn-ghost w-full justify-center text-sm">
                <Plus className="h-4 w-4" /> Add another claim
              </Link>
            </aside>

            <div className="min-w-0">
              {!activeSlug && approved.length === 0 && pending.length > 0 && (
                <div className="rounded-3xl border border-saffron/30 bg-saffron/10 p-8">
                  <h2 className="text-2xl font-black tracking-tight">Application under review.</h2>
                  <p className="mt-3 text-sm text-ink/70">
                    Once approved, you&apos;ll be able to edit your listing and upload photos here.
                  </p>
                </div>
              )}

              {activeSlug && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-ink/10 bg-cream-50 p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-2xl font-black tracking-tight md:text-3xl">
                          {claims.find((c) => c.truck_slug === activeSlug)?.truck_name}
                        </h2>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
                          slug: {activeSlug}
                        </p>
                      </div>
                      <Link
                        href={`/truck/${activeSlug}/`}
                        className="btn-ghost shrink-0 text-xs"
                        target="_blank"
                      >
                        View live <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  <EditListingForm
                    truckSlug={activeSlug}
                    truckName={claims.find((c) => c.truck_slug === activeSlug)?.truck_name ?? activeSlug}
                    ownerId={user.id}
                  />

                  <PhotoUploader truckSlug={activeSlug} ownerId={user.id} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ClaimSection({
  title, claims, active, onPick, icon,
}: {
  title: string;
  claims: Claim[];
  active: string | null;
  onPick?: (slug: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-ink/45">
        {icon} {title} <span className="tabular text-ink/30">({claims.length})</span>
      </h3>
      <ul className="mt-3 space-y-2">
        {claims.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onPick?.(c.truck_slug)}
              disabled={!onPick}
              className={`flex w-full items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left transition-colors
                ${active === c.truck_slug ? 'border-ember bg-cream' : 'border-ink/10 bg-cream-50'}
                ${onPick ? 'hover:border-ember/60' : 'cursor-default opacity-75'}`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{c.truck_name}</span>
                {(c.city || c.state) && (
                  <span className="block truncate text-xs text-ink/45">{c.city}{c.city && c.state ? ', ' : ''}{c.state}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
