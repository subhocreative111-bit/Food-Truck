# Supabase setup — Phase 1

Step-by-step. ~15 minutes if you follow it exactly.

## 1. Create the Supabase project

1. Go to https://supabase.com → **Sign up** (use GitHub login for speed)
2. **New project** → fill in:
   - **Name:** `foodtrucksnearmeusa`
   - **Database password:** generate a strong one, **save it in a password manager**
   - **Region:** pick the one geographically nearest your audience (`East US` for US-East, `India` for South Asia, etc.)
   - **Pricing plan:** **Free** (covers everything in Phase 1)
3. Click **Create new project**. Wait ~2 min for provisioning.

## 2. Run the schema migration

1. In the new project's left sidebar, click **SQL Editor**
2. Click **New query**
3. Open [`supabase/migrations/0001_initial.sql`](./migrations/0001_initial.sql) from this repo
4. Copy the entire contents → paste into the SQL editor
5. Click **Run** (or Ctrl+Enter). You should see "Success. No rows returned."
6. Sidebar → **Table Editor** → confirm you see: `profiles`, `claims`, `truck_overrides`, `photos`, `submissions`. Each should show a 🔒 (RLS enabled).

## 3. Create the Storage bucket

1. Sidebar → **Storage** → **New bucket**
2. **Name:** `truck-photos` (must be exactly this)
3. **Public bucket:** ON (toggle the switch)
4. **File size limit:** `5 MB`
5. **Allowed MIME types:** `image/jpeg, image/png, image/webp, image/avif`
6. Click **Save**

The storage policies were already created by the SQL migration — they reference this bucket by name.

## 4. Configure auth

1. Sidebar → **Authentication** → **Providers**
2. **Email** is on by default. Leave it on.
3. **Disable** "Confirm email" temporarily (for testing — turn it back on for production):
   - Authentication → Providers → Email → toggle "Confirm email" OFF → Save
   - When you're ready to launch, turn this back ON
4. Sidebar → **Authentication** → **URL Configuration**
   - **Site URL:** `https://foodtrucksnearmeusa.com`
   - **Redirect URLs (allow list):**
     - `http://localhost:3000/**`
     - `https://foodtrucksnearmeusa.com/**`
   - Save

## 5. Make yourself an admin

After signing in once (via your site, see step 7), run this in SQL Editor to give yourself moderation rights:

```sql
-- Replace with your email
UPDATE public.profiles
SET is_admin = TRUE
WHERE email = 'YOUR_EMAIL_HERE';
```

## 6. Copy your project credentials

1. Sidebar → **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g. `https://abcdefghijklmnop.supabase.co`)
   - **anon / public** key (long `eyJ...` JWT — NOT the `service_role` key!)

## 7. Add them to your local environment

In your project folder, create a file called `.env.local` (next to `package.json`):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

Then restart your dev server (`npm run dev`) — the auth-related UI will start working.

Test it:
1. Open http://localhost:3000/sign-in/
2. Create an account
3. Check Supabase → Authentication → Users — you should see your row
4. Now run the SQL in step 5 to make yourself admin
5. http://localhost:3000/owner/ should load your dashboard

## 8. Add the env vars to Hostinger

Hostinger's deployment page → **Settings and redeploy** → **Environment Variables** → **Add**:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | the URL from step 6 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the anon key from step 6 |

Save and redeploy. The live site will now have working auth + forms.

## 9. Where to find submitted forms

Sidebar → **Table Editor** in Supabase:

- **`claims`** — owner applications. Filter `status = 'pending'`. To approve a claim:
  ```sql
  UPDATE public.claims
  SET status = 'approved', reviewed_at = NOW(), reviewed_by = auth.uid()
  WHERE id = 'CLAIM_ID_HERE';
  ```
  (or use the Table Editor UI to flip the `status` cell to `approved`)

- **`submissions`** — contact form messages + everything else. Filter `handled = false` to see new ones.

- **`photos`** — uploaded photos. Filter `is_approved = false` to moderate.
  To approve a photo:
  ```sql
  UPDATE public.photos SET is_approved = TRUE WHERE id = 'PHOTO_ID';
  ```

You can wire a Discord / Slack / email webhook later via Supabase Database Webhooks if you want push notifications when new submissions arrive.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Owner accounts aren't configured yet` banner | env vars not set or wrong. Check `.env.local` has the two `NEXT_PUBLIC_*` vars and dev server was restarted. |
| `Auth session missing!` after sign-up | "Confirm email" is on — check your inbox for the confirmation link. Or disable it in Authentication → Providers → Email. |
| Claim form submits but row doesn't appear | RLS policy is rejecting. Verify the SQL migration ran without errors. Check **Authentication → Logs** in Supabase. |
| Photo upload fails | Bucket wasn't created or isn't named exactly `truck-photos`, or wasn't set Public. |
| `permission denied for schema public` | The `auth.users` trigger didn't install. Re-run the migration. |
