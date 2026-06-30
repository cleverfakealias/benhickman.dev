import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';

// Contact form island (client:visible). Ports the SPA's field set + validation +
// 15s timeout + error/success UX, swapping hCaptcha → Cloudflare Turnstile and
// Formspree-direct → the /api/contact Worker (which verifies Turnstile server-side).

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}
type Errors = Partial<Record<keyof FormData, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

// Self-contained Turnstile widget — renders on mount, removes on unmount. Remount
// (via a changing `key`) gives a fresh challenge after submit/error.
function TurnstileWidget({
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
      if (cancelled || !window.turnstile || !ref.current || idRef.current) return;
      idRef.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme: 'auto',
        callback: (t) => onToken(t),
        'expired-callback': () => onToken(null),
        'error-callback': () => onToken(null),
      });
    };
    let timer: ReturnType<typeof setInterval> | undefined;
    if (window.turnstile) {
      render();
    } else if (!document.querySelector(`script[src="${TURNSTILE_SRC}"]`)) {
      const s = document.createElement('script');
      s.src = TURNSTILE_SRC;
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      timer = setInterval(() => {
        if (window.turnstile) {
          clearInterval(timer);
          render();
        }
      }, 200);
    }
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      if (window.turnstile && idRef.current) {
        try {
          window.turnstile.remove(idRef.current);
        } catch {
          /* already gone */
        }
        idRef.current = null;
      }
    };
  }, [siteKey, onToken]);

  return <div ref={ref} className="turnstile-widget" />;
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

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';

export default function ContactForm() {
  const [data, setData] = useState<FormData>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [token, setToken] = useState<string | null>(null);
  // Bumping this remounts TurnstileWidget for a fresh challenge.
  const [widgetKey, setWidgetKey] = useState(0);

  const onToken = useCallback((t: string | null) => setToken(t), []);

  const onChange = (field: keyof FormData) => (e: { target: { value: string } }) => {
    setData((d) => ({ ...d, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate(data);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    if (TURNSTILE_SITE_KEY && !token) {
      setErrorMsg('Please complete the verification.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken: token }),
        signal: controller.signal,
      });
      if (res.ok) {
        setStatus('success');
        return;
      }
      let msg = `Submission failed (${res.status}).`;
      try {
        const j = (await res.json()) as { error?: string };
        if (j?.error) msg = j.error;
      } catch {
        /* ignore */
      }
      setErrorMsg(msg);
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
      <div className="contact-success">
        <h2>Thank you.</h2>
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

      {TURNSTILE_SITE_KEY ? (
        <TurnstileWidget key={widgetKey} siteKey={TURNSTILE_SITE_KEY} onToken={onToken} />
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
