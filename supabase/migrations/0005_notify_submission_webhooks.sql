-- ============================================================================
-- Email notifications on new claims + contact submissions.
--
-- Pipeline:  INSERT row → trigger → pg_net.http_post →
--            Edge Function `notify-submission` → Resend → admin inbox.
--
-- The same NOTIFY_TOKEN is stored both in Supabase Vault (read by the
-- trigger) and as a Function Secret on the Edge Function (read by the
-- function). When neither RESEND_API_KEY nor NOTIFY_TOKEN are set on the
-- function, the trigger still fires successfully and the function 200s
-- as a no-op — useful for initial setup.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Generate the shared token once and store it in Vault.
DO $$
DECLARE
  v_secret_id  uuid;
  v_token      text;
BEGIN
  SELECT id INTO v_secret_id
  FROM vault.secrets WHERE name = 'notify_submission_token' LIMIT 1;

  IF v_secret_id IS NULL THEN
    v_token := encode(extensions.gen_random_bytes(24), 'hex');
    v_secret_id := vault.create_secret(v_token, 'notify_submission_token',
      'Bearer token used by the claim/submission webhook triggers');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.fire_submission_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_token text;
  v_body  jsonb;
BEGIN
  SELECT decrypted_secret INTO v_token
  FROM vault.decrypted_secrets
  WHERE name = 'notify_submission_token'
  LIMIT 1;

  v_body := jsonb_build_object(
    'type',       TG_OP,
    'table',      TG_TABLE_NAME,
    'schema',     TG_TABLE_SCHEMA,
    'record',     to_jsonb(NEW),
    'old_record', NULL
  );

  PERFORM net.http_post(
    url     := 'https://tqgaeqdcilvtqhslonyk.supabase.co/functions/v1/notify-submission',
    headers := jsonb_build_object(
      'Content-Type',     'application/json',
      'x-webhook-token',  COALESCE(v_token, '')
    ),
    body    := v_body
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block an insert because of a webhook error
  RAISE WARNING '[notify-webhook] failed: %', SQLERRM;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.fire_submission_webhook() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS notify_on_new_claim       ON public.claims;
DROP TRIGGER IF EXISTS notify_on_new_submission  ON public.submissions;

CREATE TRIGGER notify_on_new_claim
  AFTER INSERT ON public.claims
  FOR EACH ROW EXECUTE FUNCTION public.fire_submission_webhook();

CREATE TRIGGER notify_on_new_submission
  AFTER INSERT ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.fire_submission_webhook();
