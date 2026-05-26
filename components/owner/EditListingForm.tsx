'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, CheckCircle2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase/client';
import type { TruckOverride } from '@/lib/supabase/types';
import type { Cuisine, Hours } from '@/lib/types';

interface Props {
  truckSlug: string;
  truckName: string;
  ownerId: string;
}

const DAYS: Array<{ key: keyof Hours; label: string }> = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

const CUISINE_OPTIONS: Cuisine[] = [
  'American', 'BBQ', 'Mexican', 'Tacos', 'Asian', 'Thai', 'Chinese', 'Korean',
  'Japanese', 'Vietnamese', 'Indian', 'Mediterranean', 'Italian', 'Pizza',
  'Seafood', 'Soul Food', 'Vegan', 'Desserts', 'Coffee', 'Breakfast',
  'Sandwiches', 'Burgers', 'Halal', 'Caribbean', 'Cajun', 'Tex-Mex', 'Other',
];

/**
 * Owner-side editor for the dynamic-overlay fields on a claimed truck.
 * Reads any existing override on mount; upserts on save. RLS makes sure
 * only the verified owner of an approved claim can write to this slug.
 */
export default function EditListingForm({ truckSlug, truckName, ownerId }: Props) {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [savedAt, setSavedAt]   = useState<Date | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone]             = useState('');
  const [website, setWebsite]         = useState('');
  const [instagram, setInstagram]     = useState('');
  const [hours, setHours]             = useState<Hours>({});
  const [cuisines, setCuisines]       = useState<Set<Cuisine>>(new Set());
  const [isPublished, setIsPublished] = useState(true);

  // Initial load — pull any existing override from Supabase
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = getSupabase();
      const { data, error: err } = await supabase
        .from('truck_overrides')
        .select('*')
        .eq('truck_slug', truckSlug)
        .maybeSingle();
      if (cancelled) return;
      if (err) {
        setError(err.message);
      } else if (data) {
        const o = data as TruckOverride;
        setDisplayName(o.display_name ?? '');
        setDescription(o.description ?? '');
        setPhone(o.phone ?? '');
        setWebsite(o.website ?? '');
        setInstagram(o.instagram ?? '');
        setHours((o.hours_json ?? {}) as Hours);
        setCuisines(new Set((o.cuisines ?? []) as Cuisine[]));
        setIsPublished(o.is_published);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [truckSlug]);

  const toggleCuisine = (c: Cuisine) => {
    const next = new Set(cuisines);
    if (next.has(c)) next.delete(c); else next.add(c);
    setCuisines(next);
  };
  const setDayHours = (day: keyof Hours, value: string) =>
    setHours((h) => ({ ...h, [day]: value || undefined }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const supabase = getSupabase();
      // Empty strings → null so we don't persist whitespace overrides
      const clean = <T extends string>(v: T) => (v.trim() === '' ? null : v.trim());
      const hoursClean = Object.fromEntries(
        Object.entries(hours).filter(([, v]) => v && String(v).trim() !== ''),
      );

      const payload = {
        truck_slug:   truckSlug,
        owner_id:     ownerId,
        display_name: clean(displayName),
        description:  clean(description),
        phone:        clean(phone),
        website:      clean(website),
        instagram:    clean(instagram),
        hours_json:   Object.keys(hoursClean).length > 0 ? hoursClean : null,
        cuisines:     cuisines.size > 0 ? [...cuisines] : null,
        is_published: isPublished,
        updated_at:   new Date().toISOString(),
      };

      const { error: err } = await supabase
        .from('truck_overrides')
        .upsert(payload, { onConflict: 'truck_slug' });
      if (err) throw err;
      setSavedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-ink/10 bg-cream-50 p-8 text-sm text-ink/60">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your listing…
      </div>
    );
  }

  return (
    <form onSubmit={save} className="rounded-3xl border border-ink/10 bg-cream-50 p-6 md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black tracking-tight">Edit listing</h3>
          <p className="mt-1 text-sm text-ink/55">
            Your changes appear on{' '}
            <Link href={`/truck/${truckSlug}/`} className="font-bold text-ember underline-offset-4 hover:underline" target="_blank">
              the public page <ExternalLink className="inline h-3 w-3" />
            </Link>{' '}
            within a few seconds.
          </p>
        </div>
        {savedAt && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-saffron/15 px-3 py-1 text-xs font-bold text-saffron-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Saved {savedAt.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label={`Display name (default: "${truckName}")`} value={displayName} onChange={setDisplayName} placeholder={truckName} />
        <Field label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="+1 555 123 4567" />
        <Field label="Website" value={website} onChange={setWebsite} placeholder="https://yourtruck.com" />
        <Field label="Instagram" value={instagram} onChange={setInstagram} placeholder="https://instagram.com/yourtruck" />
      </div>

      <label className="mt-5 grid gap-2">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">Description</span>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          placeholder="Signature dishes, regular parking spots, what makes you you."
          className="rounded-2xl border border-ink/15 bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
        />
        <span className="text-right text-[10px] text-ink/40 tabular">{description.length}/1000</span>
      </label>

      <fieldset className="mt-6">
        <legend className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">Cuisines</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map((c) => {
            const on = cuisines.has(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCuisine(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors
                            ${on
                              ? 'border-ember bg-ember text-cream'
                              : 'border-ink/15 text-ink/75 hover:border-ink'}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">Hours</legend>
        <p className="mt-1 text-xs text-ink/45">Free text per day. Leave blank for "unknown", type "Closed" for closed.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {DAYS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wider text-ink/55">{label.slice(0, 3)}</span>
              <input
                value={hours[key] ?? ''}
                onChange={(e) => setDayHours(key, e.target.value)}
                placeholder="11 AM – 9 PM"
                className="flex-1 rounded-full border border-ink/15 bg-cream px-4 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-cream/60 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={isPublished}
            onChange={() => setIsPublished((p) => !p)}
          />
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-ink/25 peer-checked:border-ember peer-checked:bg-ember">
            {isPublished && (
              <svg viewBox="0 0 16 16" className="h-3 w-3 text-cream"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
          <span>
            <span className="block text-sm font-bold">Publish to public listing</span>
            <span className="block text-xs text-ink/55">Uncheck to temporarily hide your overrides while you tweak.</span>
          </span>
        </label>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-ember/30 bg-ember-50 px-4 py-3 text-sm text-ember-700">{error}</div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-ink/45">
          The default photo, address, and location come from the directory data. Your edits override them.
        </span>
        <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
      />
    </label>
  );
}
