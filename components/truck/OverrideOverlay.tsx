'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { getSupabase, supabaseConfigured } from '@/lib/supabase/client';
import { useSession } from '@/lib/supabase/hooks';
import type { TruckOverride } from '@/lib/supabase/types';

interface Props {
  truckSlug: string;
}

/**
 * Fetches the owner-edited override for this truck (if any) and visibly
 * patches the rendered page. The original page is server-rendered from
 * trucks.json — this client component hydrates the owner edits on top.
 *
 * Patches by selector so we don't need to refactor the whole detail page
 * into a client component (keeps SSR-first behavior for SEO).
 */
export default function OverrideOverlay({ truckSlug }: Props) {
  const { user } = useSession();
  const [override, setOverride] = useState<TruckOverride | null>(null);
  const [isOwner, setIsOwner]   = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('truck_overrides')
        .select('*')
        .eq('truck_slug', truckSlug)
        .eq('is_published', true)
        .maybeSingle();
      if (!cancelled && data) setOverride(data as TruckOverride);
    })();
    return () => { cancelled = true; };
  }, [truckSlug]);

  // Detect whether the signed-in user is the owner of this truck (lets us
  // show an "Edit" pill on top so they don't have to navigate to /owner/).
  useEffect(() => {
    if (!user || !supabaseConfigured) { setIsOwner(false); return; }
    let cancelled = false;
    (async () => {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('claims')
        .select('id')
        .eq('truck_slug', truckSlug)
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .maybeSingle();
      if (!cancelled) setIsOwner(Boolean(data));
    })();
    return () => { cancelled = true; };
  }, [truckSlug, user]);

  // Patch the DOM with override data once we have it
  useEffect(() => {
    if (!override) return;
    if (override.display_name) {
      document.querySelectorAll<HTMLElement>('[data-override="name"]').forEach((el) => {
        el.textContent = override.display_name as string;
      });
    }
    if (override.description) {
      document.querySelectorAll<HTMLElement>('[data-override="description"]').forEach((el) => {
        el.textContent = override.description as string;
      });
    }
    if (override.phone) {
      document.querySelectorAll<HTMLElement>('[data-override="phone"]').forEach((el) => {
        el.textContent = override.phone as string;
      });
      document.querySelectorAll<HTMLAnchorElement>('[data-override="phone-link"]').forEach((el) => {
        el.href = `tel:${override.phone}`;
      });
    }
    if (override.website) {
      document.querySelectorAll<HTMLAnchorElement>('[data-override="website-link"]').forEach((el) => {
        el.href = override.website as string;
        const visible = el.querySelector('[data-override="website"]') as HTMLElement | null;
        if (visible) visible.textContent = (override.website as string).replace(/^https?:\/\//, '');
      });
    }
  }, [override]);

  if (!isOwner) return null;

  return (
    <Link
      href="/owner/"
      className="fixed right-4 top-24 z-50 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-cream shadow-[0_14px_30px_-12px_rgba(26,22,20,0.6)] transition-transform hover:-translate-y-0.5"
    >
      <Pencil className="h-3.5 w-3.5" />
      Edit your listing
    </Link>
  );
}
