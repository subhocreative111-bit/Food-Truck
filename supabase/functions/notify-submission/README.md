# notify-submission edge function

Sends an email to the admin whenever a new row lands in `public.claims` or
`public.submissions`. Wired by the database trigger in
[`migrations/0005_notify_submission_webhooks.sql`](../../migrations/0005_notify_submission_webhooks.sql).

## How it gets called

1. A user submits the contact form / claim form on the public site.
2. The row lands in Postgres via RLS-gated `INSERT`.
3. `AFTER INSERT` trigger calls `pg_net.http_post` against this function.
4. The function reads the row, formats an HTML + text email, sends via
   Resend → admin inbox.

## Function Secrets you must set in Supabase

Go to: **Supabase → Edge Functions → notify-submission → Secrets**

| Key | Value | How to get it |
|---|---|---|
| `RESEND_API_KEY` | `re_...` | https://resend.com → API Keys → Create. Free tier = 100 emails/day. |
| `NOTIFY_TOKEN` | `80e753277dd3479a052714a6515de29cf1da1c8684d2977c` | Already in Supabase Vault (`notify_submission_token`). Paste the value into Function Secrets too. |
| `ADMIN_EMAIL` *(optional)* | `subho.creative111@gmail.com` | Defaults to this. Override to send notifications elsewhere. |
| `NOTIFY_FROM` *(optional)* | `FoodTrucksNearMeUSA <hello@yourdomain.com>` | Defaults to `onboarding@resend.dev` (Resend test sender). Once your domain is verified in Resend you can use a real `@foodtrucksnearmeusa.com` sender. |

Until `RESEND_API_KEY` is set, the function logs the email payload and returns
`{"ok":true,"sent":false,"reason":"no api key"}` — the trigger is happy, no
email goes out. Once you add the key, emails start flowing immediately.

## Deploy

Already deployed at `https://tqgaeqdcilvtqhslonyk.supabase.co/functions/v1/notify-submission`.

To redeploy after edits via the Supabase CLI:

```bash
supabase functions deploy notify-submission --no-verify-jwt
```

Or via this project's MCP integration — see chat history.

## Quick test

```bash
curl -X POST 'https://tqgaeqdcilvtqhslonyk.supabase.co/functions/v1/notify-submission' \
  -H "Content-Type: application/json" \
  -H "x-webhook-token: <NOTIFY_TOKEN>" \
  -d '{
    "type":"INSERT",
    "table":"submissions",
    "schema":"public",
    "record":{"kind":"contact","name":"Test","email":"test@example.com","subject":"Hi","message":"From cURL"},
    "old_record":null
  }'
```

Should return `{"id":"..."}` from Resend (or `{"ok":true,"sent":false}` if the key isn't set yet).
