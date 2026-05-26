-- ============================================================================
-- FoodTrucksNearMeUSA — Phase 1 schema
-- Paste this whole file into the Supabase SQL Editor and click "Run".
-- Idempotent: safe to run multiple times.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles — public user info, mirrors auth.users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  is_admin    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto-create a profile row whenever a new auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- claims — owner submits a request to claim a static truck listing
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.claims (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_slug    TEXT        NOT NULL,         -- references the static slug in data/trucks.json
  truck_name    TEXT        NOT NULL,         -- denormalized for display in admin
  city          TEXT,
  state         TEXT,
  cuisine       TEXT,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  applicant_email TEXT      NOT NULL,
  applicant_name  TEXT,
  applicant_phone TEXT,
  message       TEXT,
  status        TEXT        NOT NULL DEFAULT 'pending'  -- pending | approved | rejected
                            CHECK (status IN ('pending','approved','rejected')),
  reviewed_at   TIMESTAMPTZ,
  reviewed_by   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_note TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS claims_user_idx        ON public.claims (user_id);
CREATE INDEX IF NOT EXISTS claims_truck_slug_idx  ON public.claims (truck_slug);
CREATE INDEX IF NOT EXISTS claims_status_idx      ON public.claims (status);
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- truck_overrides — once a claim is approved, the owner edits land here.
-- The static site reads trucks.json + overlays approved overrides.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.truck_overrides (
  truck_slug    TEXT        PRIMARY KEY,
  owner_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  description   TEXT,
  phone         TEXT,
  website       TEXT,
  instagram     TEXT,
  hours_json    JSONB,                        -- { mon: "...", tue: "...", ... }
  cuisines      TEXT[],
  is_featured   BOOLEAN     NOT NULL DEFAULT FALSE,
  is_published  BOOLEAN     NOT NULL DEFAULT TRUE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS overrides_owner_idx ON public.truck_overrides (owner_id);
ALTER TABLE public.truck_overrides ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- photos — owner-uploaded photos. The actual files live in Storage; this
-- table tracks which truck they belong to + display order.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.photos (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_slug    TEXT        NOT NULL,
  owner_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path  TEXT        NOT NULL,         -- bucket-relative path
  public_url    TEXT        NOT NULL,
  caption       TEXT,
  sort_order    INT         NOT NULL DEFAULT 0,
  is_approved   BOOLEAN     NOT NULL DEFAULT FALSE,  -- admin moderation
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS photos_truck_idx  ON public.photos (truck_slug);
CREATE INDEX IF NOT EXISTS photos_owner_idx  ON public.photos (owner_id);
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- submissions — generic inbox for contact forms, applications, anything that
-- doesn't fit elsewhere. Allows anonymous inserts.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.submissions (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        TEXT         NOT NULL,           -- 'contact' | 'press' | 'feedback' | etc.
  name        TEXT,
  email       TEXT,
  subject     TEXT,
  message     TEXT         NOT NULL,
  meta        JSONB,                           -- arbitrary { source: '...', ua: '...' }
  handled     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS submissions_kind_idx     ON public.submissions (kind);
CREATE INDEX IF NOT EXISTS submissions_handled_idx  ON public.submissions (handled);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Row-Level Security policies
-- ============================================================================

-- profiles: a user can read/update their own profile; admins can read all
DROP POLICY IF EXISTS profiles_self_read  ON public.profiles;
DROP POLICY IF EXISTS profiles_self_write ON public.profiles;
DROP POLICY IF EXISTS profiles_admin_read ON public.profiles;
CREATE POLICY profiles_self_read  ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY profiles_self_write ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY profiles_admin_read ON public.profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- claims: a user reads / inserts their own claims; admins read + update all
DROP POLICY IF EXISTS claims_self_read    ON public.claims;
DROP POLICY IF EXISTS claims_self_insert  ON public.claims;
DROP POLICY IF EXISTS claims_admin_read   ON public.claims;
DROP POLICY IF EXISTS claims_admin_update ON public.claims;
CREATE POLICY claims_self_read    ON public.claims FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY claims_self_insert  ON public.claims FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY claims_admin_read   ON public.claims FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));
CREATE POLICY claims_admin_update ON public.claims FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- truck_overrides: public can READ approved/published overrides; only the
-- owner can write to their own truck after an approved claim
DROP POLICY IF EXISTS overrides_public_read    ON public.truck_overrides;
DROP POLICY IF EXISTS overrides_owner_write    ON public.truck_overrides;
DROP POLICY IF EXISTS overrides_owner_upsert   ON public.truck_overrides;
DROP POLICY IF EXISTS overrides_admin_write    ON public.truck_overrides;
CREATE POLICY overrides_public_read  ON public.truck_overrides FOR SELECT TO anon, authenticated
  USING (is_published = TRUE);
CREATE POLICY overrides_owner_upsert ON public.truck_overrides FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.claims c
      WHERE c.truck_slug = truck_overrides.truck_slug
        AND c.user_id = auth.uid()
        AND c.status = 'approved'
    )
  );
CREATE POLICY overrides_owner_write  ON public.truck_overrides FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id);
CREATE POLICY overrides_admin_write  ON public.truck_overrides FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- photos: public reads approved photos; owner reads/inserts/deletes own photos
DROP POLICY IF EXISTS photos_public_read    ON public.photos;
DROP POLICY IF EXISTS photos_owner_read     ON public.photos;
DROP POLICY IF EXISTS photos_owner_insert   ON public.photos;
DROP POLICY IF EXISTS photos_owner_delete   ON public.photos;
DROP POLICY IF EXISTS photos_admin_write    ON public.photos;
CREATE POLICY photos_public_read  ON public.photos FOR SELECT TO anon, authenticated
  USING (is_approved = TRUE);
CREATE POLICY photos_owner_read   ON public.photos FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);
CREATE POLICY photos_owner_insert ON public.photos FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.claims c
      WHERE c.truck_slug = photos.truck_slug
        AND c.user_id = auth.uid()
        AND c.status = 'approved'
    )
  );
CREATE POLICY photos_owner_delete ON public.photos FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);
CREATE POLICY photos_admin_write  ON public.photos FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- submissions: anyone (anon or authed) can INSERT; only admins read
DROP POLICY IF EXISTS submissions_public_insert ON public.submissions;
DROP POLICY IF EXISTS submissions_admin_read    ON public.submissions;
DROP POLICY IF EXISTS submissions_admin_update  ON public.submissions;
CREATE POLICY submissions_public_insert ON public.submissions FOR INSERT TO anon, authenticated
  WITH CHECK (TRUE);
CREATE POLICY submissions_admin_read    ON public.submissions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));
CREATE POLICY submissions_admin_update  ON public.submissions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- ============================================================================
-- Storage bucket for owner photo uploads
-- Run this section in the SQL editor AFTER creating the bucket in the
-- Storage UI (named exactly "truck-photos", set "Public" = true).
-- ============================================================================
-- These policies assume the bucket "truck-photos" exists.

DROP POLICY IF EXISTS truck_photos_public_read   ON storage.objects;
DROP POLICY IF EXISTS truck_photos_owner_insert  ON storage.objects;
DROP POLICY IF EXISTS truck_photos_owner_delete  ON storage.objects;

CREATE POLICY truck_photos_public_read  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'truck-photos');

-- Filename convention: {user_id}/{truck_slug}/{random-uuid}.{ext}
CREATE POLICY truck_photos_owner_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'truck-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY truck_photos_owner_delete ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'truck-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- Done. Verify in Table Editor that you see: profiles, claims, truck_overrides,
-- photos, submissions. Verify each has RLS enabled (lock icon next to name).
-- ============================================================================
