'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, UploadCloud, X, ImageIcon } from 'lucide-react';
import { getSupabase, SUPABASE_PHOTO_BUCKET } from '@/lib/supabase/client';
import type { Photo } from '@/lib/supabase/types';

interface Props {
  truckSlug: string;
  ownerId: string;
  /** Maximum total photos for this truck. */
  maxPhotos?: number;
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export default function PhotoUploader({ truckSlug, ownerId, maxPhotos = 6 }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supabase = getSupabase();

  const refresh = async () => {
    setLoading(true);
    const { data, error: e1 } = await supabase
      .from('photos')
      .select('*')
      .eq('truck_slug', truckSlug)
      .eq('owner_id', ownerId)
      .order('sort_order', { ascending: true });
    if (e1) setError(e1.message);
    else setPhotos((data as Photo[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { refresh(); /* eslint-disable-line react-hooks/exhaustive-deps */ }, [truckSlug, ownerId]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    if (photos.length + files.length > maxPhotos) {
      setError(`Max ${maxPhotos} photos per truck. You already have ${photos.length}.`);
      return;
    }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!ALLOWED.includes(file.type)) {
          throw new Error(`${file.name}: must be JPEG, PNG, WebP, or AVIF.`);
        }
        if (file.size > MAX_BYTES) {
          throw new Error(`${file.name}: max 5 MB per photo.`);
        }
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${ownerId}/${truckSlug}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(SUPABASE_PHOTO_BUCKET)
          .upload(path, file, { cacheControl: '604800', upsert: false, contentType: file.type });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from(SUPABASE_PHOTO_BUCKET).getPublicUrl(path);
        const { error: rowErr } = await supabase.from('photos').insert({
          truck_slug: truckSlug,
          owner_id: ownerId,
          storage_path: path,
          public_url: pub.publicUrl,
          sort_order: photos.length,
        });
        if (rowErr) throw rowErr;
      }
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async (photo: Photo) => {
    setError(null);
    try {
      await supabase.storage.from(SUPABASE_PHOTO_BUCKET).remove([photo.storage_path]);
      await supabase.from('photos').delete().eq('id', photo.id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.');
    }
  };

  return (
    <div className="rounded-3xl border border-ink/10 bg-cream-50 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black tracking-tight">Photos</h3>
          <p className="mt-1 text-sm text-ink/55">
            JPEG / PNG / WebP up to 5 MB. {photos.length}/{maxPhotos} uploaded.
            Photos are reviewed before going live on your listing.
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading || photos.length >= maxPhotos}
          className="btn-primary shrink-0 text-sm disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-ember/30 bg-ember-50 px-4 py-3 text-sm text-ember-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-2xl bg-ink/8" />
        ))}

        {!loading && photos.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 p-12 text-center">
            <ImageIcon className="h-8 w-8 text-ink/30" />
            <p className="mt-3 text-sm text-ink/55">No photos yet — upload your first one.</p>
          </div>
        )}

        {!loading && photos.map((p) => (
          <div key={p.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-ink/10 bg-cream-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.public_url} alt="Truck" className="absolute inset-0 h-full w-full object-cover" />
            {!p.is_approved && (
              <span className="featured-pill absolute left-2 top-2 bg-ink/85 text-cream">Pending</span>
            )}
            <button
              onClick={() => remove(p)}
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/85 text-cream opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
