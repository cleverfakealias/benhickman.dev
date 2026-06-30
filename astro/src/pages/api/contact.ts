import type { APIRoute } from 'astro';

// SERVER endpoint (Cloudflare Worker). Verifies the Turnstile token server-side,
// then forwards the message. Secrets are read from the Worker env via
// `cloudflare:workers` and NEVER reach the client:
//   TURNSTILE_SECRET  — required, Turnstile server verify
//   RESEND_API_KEY    — optional, email via Resend
//   CONTACT_TO        — optional, destination address for Resend
//   CONTACT_FROM      — optional, verified Resend sender
//   CONTACT_FORWARD_URL — optional, server-side Formspree fallback
export const prerender = false;

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  turnstileToken?: string;
}

// Worker secrets (set via `wrangler secret put`; not in wrangler.jsonc, so not
// in the generated Env type). All optional — the endpoint fails closed.
interface ContactEnv {
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  CONTACT_FORWARD_URL?: string;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const { env } = await import('cloudflare:workers');
  const e = env as unknown as ContactEnv;

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const name = payload.name?.trim() ?? '';
  const email = payload.email?.trim() ?? '';
  const phone = payload.phone?.trim() ?? '';
  const message = payload.message?.trim() ?? '';

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return json({ error: 'Please fill in your name, a valid email, and a message.' }, 400);
  }
  if (message.length > 5000) {
    return json({ error: 'Message is too long.' }, 400);
  }

  // Turnstile verification (required — fail closed if the secret is missing).
  const secret = e.TURNSTILE_SECRET;
  if (!secret) {
    return json({ error: 'Contact form is not configured yet. Please reach out via social.' }, 503);
  }
  const ip = request.headers.get('cf-connecting-ip');
  const ok = await verifyTurnstile(payload.turnstileToken ?? '', secret, ip);
  if (!ok) {
    return json({ error: 'Verification failed. Please try again.' }, 403);
  }

  // Forward the message. Prefer Resend; fall back to a server-side Formspree POST.
  const subject = `New contact from ${name} — benhickman.dev`;
  const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\n\n${message}`;

  try {
    if (e.RESEND_API_KEY && e.CONTACT_TO && e.CONTACT_FROM) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${e.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: e.CONTACT_FROM,
          to: e.CONTACT_TO,
          reply_to: email,
          subject,
          text,
        }),
      });
      if (!res.ok) return json({ error: 'Could not send right now. Please try again later.' }, 502);
    } else if (e.CONTACT_FORWARD_URL) {
      const res = await fetch(e.CONTACT_FORWARD_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ name, email, phone, message, _subject: subject }),
      });
      if (!res.ok) return json({ error: 'Could not send right now. Please try again later.' }, 502);
    } else {
      // Verified but no delivery target configured yet — accept without storing.
      return json(
        { error: 'Message verified, but delivery is not configured yet. Please reach out via social.' },
        503,
      );
    }
  } catch {
    return json({ error: 'Could not send right now. Please try again later.' }, 502);
  }

  return json({ ok: true }, 200);
};
