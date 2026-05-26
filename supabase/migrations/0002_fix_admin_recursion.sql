-- ============================================================================
-- Fix infinite recursion in admin RLS policies + tighten security.
-- (Applied via Supabase MCP during initial setup.)
--
-- Root cause: `profiles_admin_read` had EXISTS(SELECT FROM profiles WHERE is_admin),
-- which re-enters profiles RLS forever.
--
-- Fix: extract the admin check into a SECURITY DEFINER helper in a private
-- schema that PostgREST doesn't expose, so it bypasses RLS and doesn't leak
-- as an RPC endpoint.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$;
REVOKE EXECUTE ON FUNCTION private.is_current_user_admin() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION private.is_current_user_admin() TO authenticated;

-- Repoint every admin policy at the new helper
DROP POLICY IF EXISTS profiles_admin_read      ON public.profiles;
DROP POLICY IF EXISTS claims_admin_read        ON public.claims;
DROP POLICY IF EXISTS claims_admin_update      ON public.claims;
DROP POLICY IF EXISTS overrides_admin_write    ON public.truck_overrides;
DROP POLICY IF EXISTS photos_admin_write       ON public.photos;
DROP POLICY IF EXISTS submissions_admin_read   ON public.submissions;
DROP POLICY IF EXISTS submissions_admin_update ON public.submissions;

CREATE POLICY profiles_admin_read      ON public.profiles        FOR SELECT TO authenticated USING (private.is_current_user_admin());
CREATE POLICY claims_admin_read        ON public.claims          FOR SELECT TO authenticated USING (private.is_current_user_admin());
CREATE POLICY claims_admin_update      ON public.claims          FOR UPDATE TO authenticated USING (private.is_current_user_admin());
CREATE POLICY overrides_admin_write    ON public.truck_overrides FOR ALL    TO authenticated USING (private.is_current_user_admin()) WITH CHECK (private.is_current_user_admin());
CREATE POLICY photos_admin_write       ON public.photos          FOR ALL    TO authenticated USING (private.is_current_user_admin()) WITH CHECK (private.is_current_user_admin());
CREATE POLICY submissions_admin_read   ON public.submissions     FOR SELECT TO authenticated USING (private.is_current_user_admin());
CREATE POLICY submissions_admin_update ON public.submissions     FOR UPDATE TO authenticated USING (private.is_current_user_admin());

-- ============================================================================
-- Other security hardening from the same setup pass:
-- ============================================================================

-- Tighten submissions_public_insert: require non-empty message under 20KB.
DROP POLICY IF EXISTS submissions_public_insert ON public.submissions;
CREATE POLICY submissions_public_insert ON public.submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(message) BETWEEN 1 AND 20000
    AND char_length(coalesce(kind, '')) BETWEEN 1 AND 64
  );

-- Drop the broad bucket-listing policy on storage.objects. Public buckets
-- serve files via public URL without needing storage.objects SELECT access.
DROP POLICY IF EXISTS truck_photos_public_read ON storage.objects;

-- handle_new_user() is a trigger function — block direct RPC invocation.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
