'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useSession } from '@/lib/supabase/hooks';
import { getSupabase, supabaseConfigured } from '@/lib/supabase/client';

/**
 * Header avatar / sign-in trigger. Renders nothing if Supabase isn't
 * configured yet (so the public site doesn't show broken UI).
 */
export default function UserMenu() {
  const { user, loading } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!supabaseConfigured) return null;
  if (loading) return <span className="hidden h-10 w-10 animate-pulse rounded-full bg-ink/10 md:inline-block" />;

  if (!user) {
    return (
      <Link
        href="/sign-in/"
        className="hidden items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-bold text-ink/80 transition-colors hover:border-ink hover:text-ink md:inline-flex"
      >
        <User className="h-3.5 w-3.5" />
        Owner sign in
      </Link>
    );
  }

  const initial = (user.user_metadata?.full_name?.[0] || user.email?.[0] || '?').toUpperCase();

  const signOut = async () => {
    await getSupabase().auth.signOut();
    setOpen(false);
    router.refresh();
    router.push('/');
  };

  return (
    <div className="relative hidden md:inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-ink/15 bg-cream px-2 py-1.5 text-sm font-bold transition-colors hover:border-ink"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ember text-xs font-black text-cream">
          {initial}
        </span>
        <span className="hidden lg:inline">{user.user_metadata?.full_name || user.email}</span>
        <ChevronDown className="h-3.5 w-3.5 text-ink/55" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-[0_24px_50px_-20px_rgba(26,22,20,0.25)]"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="border-b border-ink/8 px-4 py-3 text-xs text-ink/55">
            Signed in as
            <div className="mt-0.5 truncate text-sm font-bold text-ink">{user.email}</div>
          </div>
          <Link
            href="/owner/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-ink/85 hover:bg-cream-50 hover:text-ember"
          >
            <LayoutDashboard className="h-4 w-4" />
            Owner dashboard
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 border-t border-ink/8 px-4 py-3 text-left text-sm font-bold text-ink/85 hover:bg-cream-50 hover:text-ember"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
