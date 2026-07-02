import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';

// Contact form island (client:visible). Ports the SPA's field set + validation +
// 15s timeout + error/success UX, posting directly to Formspree with hCaptcha —
// the same provider pair the legacy SPA used. Turnstile is reserved for the
// ⌘K chat endpoint; the contact flow needs no Worker code or secrets.

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}
type Errors = Partial<Record<keyof FormData, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const HCAPTCHA_SRC = 'https://js.hcaptcha.com/1/api.js?render=explicit';

// Self-contained hCaptcha widget — renders on mount, removes on unmount. Remount
// (via a changing `key`) gives a fresh challenge after submit/error.
function HCaptchaWidget({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const render = () => {
      if (cancelled || !window.hcaptcha || !ref.current || idRef.current) return;
      idRef.current = window.hcaptcha.render(ref.current, {
        sitekey: siteKey,
        // hCaptcha has no 'auto' theme — match the site's pre-paint data-theme.
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
        callback: (t) => onToken(t),
        'expired-callback': () => onToken(null),
        'error-callback': () => onToken(null),
      });
    };
    let timer: ReturnType<typeof setInterval> | undefined;
    if (window.hcaptcha) {
      render();
    } else if (!document.querySelector(`script[src="${HCAPTCHA_SRC}"]`)) {
      const s = document.createElement('script');
      s.src = HCAPTCHA_SRC;
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      timer = setInterval(() => {
        if (window.hcaptcha) {
          clearInterval(timer);
          render();
        }
      }, 200);
    }
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      if (window.hcaptcha && idRef.current) {
        try {
          window.hcaptcha.remove(idRef.current);
        } catch {
          /* already gone */
        }
        idRef.current = null;
      }
    };
  }, [siteKey, onToken]);

  return <div ref={ref} className="hcaptcha-widget" />;
}

const EMAIL_RE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(data.email)) errors.email = 'Valid email is required';
  if (!data.message.trim()) errors.message = 'Message is required';
  return errors;
}

// Formspree error payloads: { message } or { errors: [{ message }] }.
async function formspreeError(res: Response): Promise<string> {
  let msg = `Submission failed (${res.status}).`;
  try {
    const j = (await res.json()) as { message?: string; errors?: { message?: string }[] };
    if (Array.isArray(j?.errors) && j.errors.length) {
      msg = j.errors.map((e) => e.message).filter(Boolean).join('; ') || msg;
    } else if (j?.message) {
      msg = j.message;
    }
  } catch {
    /* ignore */
  }
  return msg;
}

const FORMSPREE_URL = import.meta.env.PUBLIC_FORMSPREE_URL ?? '';
const HCAPTCHA_SITE_KEY = import.meta.env.PUBLIC_HCAPTCHA_SITEKEY ?? '';

export default function ContactForm() {
  const [data, setData] = useState<FormData>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [token, setToken] = useState<string | null>(null);
  // Bumping this remounts HCaptchaWidget for a fresh challenge.
  const [widgetKey, setWidgetKey] = useState(0);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // Success unmounts the form under the focused submit button; move focus to
  // the confirmation heading so keyboard/SR users aren't dropped on <body>.
  useEffect(() => {
    if (status === 'success') successHeadingRef.current?.focus();
  }, [status]);

  const onToken = useCallback((t: string | null) => setToken(t), []);

  const onChange = (field: keyof FormData) => (e: { target: { value: string } }) => {
    setData((d) => ({ ...d, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(data);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      // Send focus to the first invalid field (document order) so keyboard/SR
      // users land on the problem instead of staying parked on Submit.
      const first = (['name', 'email', 'message'] as const).find((f) => v[f]);
      if (first) document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    if (!FORMSPREE_URL) {
      setErrorMsg('Contact form is not configured yet. Please reach out via social.');
      setStatus('error');
      return;
    }
    if (HCAPTCHA_SITE_KEY && !token) {
      setErrorMsg('Please complete the verification.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    // Urlencoded body (Formspree-friendly); hCaptcha tokens travel under the
    // g-recaptcha-response field — Formspree's expected captcha field name.
    const params = new URLSearchParams();
    params.append('name', data.name);
    params.append('email', data.email);
    params.append('phone', data.phone);
    params.append('message', data.message);
    params.append('_subject', `New contact from ${data.name} — benhickman.dev`);
    if (token) params.append('g-recaptcha-response', token);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: params.toString(),
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        signal: controller.signal,
      });
      if (res.ok) {
        setStatus('success');
        return;
      }
      setErrorMsg(await formspreeError(res));
      setStatus('error');
      setToken(null);
      setWidgetKey((k) => k + 1); // fresh challenge for retry
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.name === 'AbortError'
          ? 'The request timed out. Please check your connection and try again.'
          : 'A network error occurred. Please try again.',
      );
      setStatus('error');
      setToken(null);
      setWidgetKey((k) => k + 1);
    } finally {
      clearTimeout(timeout);
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-success" role="status">
        {/* tabIndex={-1}: programmatic focus target only — never in the tab order. */}
        <h2 ref={successHeadingRef} tabIndex={-1}>
          Thank you.
        </h2>
        <p>Your message has been sent — I'll get back to you soon.</p>
        <button
          type="button"
          className="consent-btn ghost"
          onClick={() => {
            setData({ name: '', email: '', phone: '', message: '' });
            setStatus('idle');
            setToken(null);
            setWidgetKey((k) => k + 1);
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input
          id="cf-name"
          type="text"
          value={data.name}
          onChange={onChange('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'cf-name-error' : undefined}
          autoComplete="name"
        />
        {errors.name && <span id="cf-name-error" className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input
          id="cf-email"
          type="email"
          value={data.email}
          onChange={onChange('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'cf-email-error' : undefined}
          autoComplete="email"
        />
        {errors.email && <span id="cf-email-error" className="field-error">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="cf-phone">Phone <span className="optional">(optional)</span></label>
        <input
          id="cf-phone"
          type="tel"
          value={data.phone}
          onChange={onChange('phone')}
          autoComplete="tel"
        />
      </div>

      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          rows={5}
          value={data.message}
          onChange={onChange('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'cf-message-error' : undefined}
        />
        {errors.message && (
          <span id="cf-message-error" className="field-error">{errors.message}</span>
        )}
      </div>

      {HCAPTCHA_SITE_KEY ? (
        <HCaptchaWidget key={widgetKey} siteKey={HCAPTCHA_SITE_KEY} onToken={onToken} />
      ) : (
        <p className="field-note">Verification will appear here once configured.</p>
      )}

      {status === 'error' && (
        <p className="form-error" role="alert">
          {errorMsg}
        </p>
      )}

      <button type="submit" className="consent-btn primary submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
