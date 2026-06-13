// supabase/functions/notify-submission/index.ts
//
// Called by Postgres Database Webhooks on INSERT to public.claims and
// public.submissions. Sends a notification email to the admin via Resend.
//
// verify_jwt is OFF because pg_net triggers from inside the DB can't sign
// new-format Supabase JWTs. Instead the function checks an X-Webhook-Token
// header that must match the NOTIFY_TOKEN function secret. Without that
// secret, the function still 200s with a no-op (so the trigger doesn't
// fail loudly during initial setup).
//
// Deploy via the Supabase MCP:
//   deploy_edge_function({ name: "notify-submission", entrypoint_path: "index.ts" })

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFY_TOKEN   = Deno.env.get('NOTIFY_TOKEN');
const PROJECT_REF    = 'tqgaeqdcilvtqhslonyk';

// Resend is in SANDBOX mode until a domain is verified at resend.com/domains:
// it will ONLY deliver to the account owner's address and 403s anything else.
// So until the domain is verified we force the owner address + the resend.dev
// sender and ignore any ADMIN_EMAIL / NOTIFY_FROM overrides — that way a stale
// ADMIN_EMAIL secret (it was set to hello@…, which 403'd every lead) can't
// silently drop notifications. Leads are persisted in public.submissions
// regardless of email, so nothing is ever lost either way.
//
// AFTER verifying the domain: set the function secret NOTIFY_DOMAIN_VERIFIED=1
// (and optionally ADMIN_EMAIL + NOTIFY_FROM) to deliver to the real inbox from
// your own domain.
const OWNER_EMAIL     = 'subho.creative111@gmail.com';
const DOMAIN_VERIFIED = Deno.env.get('NOTIFY_DOMAIN_VERIFIED') === '1';
const ADMIN_EMAIL     = DOMAIN_VERIFIED ? (Deno.env.get('ADMIN_EMAIL') ?? OWNER_EMAIL) : OWNER_EMAIL;
const FROM_EMAIL      = DOMAIN_VERIFIED
  ? (Deno.env.get('NOTIFY_FROM') ?? 'FoodTrucksNearMeUSA <notify@foodtrucksnearmeusa.com>')
  : 'FoodTrucksNearMeUSA <onboarding@resend.dev>';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: Record<string, unknown>;
  old_record: Record<string, unknown> | null;
}

function escape(v: unknown): string {
  if (v == null) return '';
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderClaim(r: Record<string, unknown>) {
  const name   = String(r.applicant_name ?? r.applicant_email ?? 'someone');
  const truck  = String(r.truck_name ?? r.truck_slug ?? '?');
  const where  = [r.city, r.state].filter(Boolean).join(', ');
  const subject = `New claim: ${truck}${where ? ` — ${where}` : ''}`;
  const dash = `https://supabase.com/dashboard/project/${PROJECT_REF}/editor`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; line-height: 1.6;">
      <h2 style="font-weight: 900; letter-spacing: -0.02em;">${escape(subject)}</h2>
      <p>${escape(name)} just submitted a claim.</p>
      <table style="border-collapse: collapse; margin-top: 12px;">
        <tr><td style="padding: 4px 12px; color: #6b5f5a;">Truck</td><td><strong>${escape(truck)}</strong></td></tr>
        <tr><td style="padding: 4px 12px; color: #6b5f5a;">Slug</td><td><code>${escape(r.truck_slug)}</code></td></tr>
        <tr><td style="padding: 4px 12px; color: #6b5f5a;">Email</td><td>${escape(r.applicant_email)}</td></tr>
        ${r.applicant_phone ? `<tr><td style="padding: 4px 12px; color: #6b5f5a;">Phone</td><td>${escape(r.applicant_phone)}</td></tr>` : ''}
        ${r.cuisine ? `<tr><td style="padding: 4px 12px; color: #6b5f5a;">Cuisine</td><td>${escape(r.cuisine)}</td></tr>` : ''}
      </table>
      ${r.message ? `<blockquote style="margin: 16px 0 0 0; padding: 12px 16px; border-left: 3px solid #C8463A; background: #FAF4E8;">${escape(r.message)}</blockquote>` : ''}
      <p style="margin-top: 24px;">
        <a href="${dash}" style="display: inline-block; background: #C8463A; color: #FAF4E8; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: 700;">Review in Supabase &rarr;</a>
      </p>
    </div>
  `;
  const text = `${name} submitted a claim for ${truck} (${where}).\n\nEmail: ${r.applicant_email}\nMessage: ${r.message ?? '—'}\n\nReview: ${dash}`;
  return { subject, html, text };
}

function renderSubmission(r: Record<string, unknown>) {
  const kind = String(r.kind ?? 'message');
  const from = String(r.name ?? r.email ?? 'someone');
  const subject = `New ${kind}: ${r.subject ?? from}`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; line-height: 1.6;">
      <h2 style="font-weight: 900; letter-spacing: -0.02em;">${escape(subject)}</h2>
      <p>From ${escape(from)}${r.email ? ` (${escape(r.email)})` : ''}.</p>
      ${r.subject ? `<p><strong>Subject:</strong> ${escape(r.subject)}</p>` : ''}
      <blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 3px solid #C8463A; background: #FAF4E8; white-space: pre-wrap;">${escape(r.message)}</blockquote>
    </div>
  `;
  const text = `${from}${r.email ? ` <${r.email}>` : ''}\nKind: ${kind}\nSubject: ${r.subject ?? '—'}\n\n${r.message}`;
  return { subject, html, text };
}

async function send(subject: string, html: string, text: string): Promise<Response> {
  if (!RESEND_API_KEY) {
    console.warn('[notify-submission] RESEND_API_KEY not set; would have sent:', subject);
    return new Response(JSON.stringify({ ok: true, sent: false, reason: 'no api key' }), { headers: { 'Content-Type': 'application/json' } });
  }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to: [ADMIN_EMAIL], subject, html, text }),
  });
  const body = await r.text();
  if (!r.ok) {
    console.error('[notify-submission] Resend error:', r.status, body);
    return new Response(JSON.stringify({ ok: false, status: r.status, body }), { status: r.status, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(body, { headers: { 'Content-Type': 'application/json' } });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  // Defense-in-depth: require a shared token from the trigger
  if (NOTIFY_TOKEN) {
    const got = req.headers.get('x-webhook-token');
    if (got !== NOTIFY_TOKEN) return new Response('Unauthorized', { status: 401 });
  }

  let payload: WebhookPayload;
  try { payload = await req.json(); }
  catch { return new Response('Invalid JSON', { status: 400 }); }

  if (payload.type !== 'INSERT') {
    return new Response(JSON.stringify({ ok: true, skipped: 'not an insert' }), { headers: { 'Content-Type': 'application/json' } });
  }

  const rendered = payload.table === 'claims' ? renderClaim(payload.record)
                  : payload.table === 'submissions' ? renderSubmission(payload.record)
                  : null;

  if (!rendered) {
    return new Response(JSON.stringify({ ok: true, skipped: `unknown table ${payload.table}` }), { headers: { 'Content-Type': 'application/json' } });
  }
  return send(rendered.subject, rendered.html, rendered.text);
});
