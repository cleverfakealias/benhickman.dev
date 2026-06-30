import { useEffect, useRef, useState, type FormEvent } from 'react';

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

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      theme?: 'auto' | 'light' | 'dark';
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ) => string;
  reset: (id?: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
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
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Load + render the Turnstile widget once.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

    function renderWidget() {
      if (!window.turnstile || !widgetRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'auto',
        callback: (t) => setToken(t),
        'expired-callback': () => setToken(null),
        'error-callback': () => setToken(null),
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else if (!document.querySelector(`script[src="${SRC}"]`)) {
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      s.onload = renderWidget;
      document.head.appendChild(s);
    } else {
      const t = setInterval(() => {
        if (window.turnstile) {
          clearInterval(t);
          renderWidget();
        }
      }, 200);
      return () => clearInterval(t);
    }
  }, []);

  const resetTurnstile = () => {
    setToken(null);
    if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
  };

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
      resetTurnstile();
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.name === 'AbortError'
          ? 'The request timed out. Please check your connection and try again.'
          : 'A network error occurred. Please try again.',
      );
      setStatus('error');
      resetTurnstile();
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
            resetTurnstile();
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
          autoComplete="name"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input
          id="cf-email"
          type="email"
          value={data.email}
          onChange={onChange('email')}
          aria-invalid={!!errors.email}
          autoComplete="email"
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
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
        />
        {errors.message && <span className="field-error">{errors.message}</span>}
      </div>

      {TURNSTILE_SITE_KEY ? (
        <div ref={widgetRef} className="turnstile-widget" />
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
