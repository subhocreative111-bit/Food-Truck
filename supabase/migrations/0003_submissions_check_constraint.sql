-- ============================================================================
-- Move submissions payload-size enforcement from RLS WITH CHECK to a regular
-- CHECK constraint. Cleaner design: RLS handles authorization, constraints
-- handle shape. Avoids a PostgREST quirk where evaluating char_length() in
-- a WITH CHECK clause was failing inserts under specific request patterns.
-- (Applied via Supabase MCP during initial setup; this file syncs the repo.)
-- ============================================================================

DROP POLICY IF EXISTS submissions_public_insert ON public.submissions;

ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_payload_size;

ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_payload_size CHECK (
    char_length(message) BETWEEN 1 AND 20000
    AND char_length(coalesce(kind, '')) BETWEEN 1 AND 64
  );

CREATE POLICY submissions_public_insert ON public.submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- The admin SELECT/UPDATE policies are unchanged from 0002 — they reference
-- private.is_current_user_admin() and still work correctly.
