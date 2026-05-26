'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client. Use only inside 'use client' components.
 * In static-export mode there is no server runtime — all auth + data
 * operations run from the browser through this client.
 *
 * The anon key is public on purpose; security is enforced by Row-Level
 * Security policies on the Postgres side (see supabase/migrations).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anon);

let singleton: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (!supabaseConfigured) {
    throw new Error(
      'Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
    );
  }
  if (!singleton) {
    singleton = createBrowserClient(url!, anon!);
  }
  return singleton;
}

export const SUPABASE_PHOTO_BUCKET = 'truck-photos';
