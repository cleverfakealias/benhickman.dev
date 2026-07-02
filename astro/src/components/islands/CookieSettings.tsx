import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { consentStore, settingsOpen, setConsent, openSettings, closeSettings } from '@/lib/consent';

// Granular cookie modal: Essential (locked on) + Analytics (toggle). Also wires
// the footer's [data-consent-settings] button to open. client:idle.
export default function CookieSettings() {
  const open = useStore(settingsOpen);
  const consent = useStore(consentStore);
  const [analytics, setAnalytics] = useState(consent === 'granted');
  const modalRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Footer "Cookie Preferences" trigger (server-rendered button).
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-consent-settings]')) {
        e.preventDefault();
        openSettings();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Sync the toggle to current consent each time the modal opens.
  useEffect(() => {
    if (open) setAnalytics(consent === 'granted');
  }, [open, consent]);

  // Focus management: remember the trigger, focus into the modal, restore on close.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    // Skip the disabled Essential checkbox — focusing a disabled control is a
    // no-op, which would leave focus outside the dialog entirely.
    modalRef.current?.querySelector<HTMLElement>('input:not([disabled]), button')?.focus();
    return () => returnFocusRef.current?.focus?.();
  }, [open]);

  // Close on Escape; trap Tab inside the dialog — aria-modal promises the
  // page behind the overlay is inert, so focus must not walk out of it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSettings();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = active instanceof HTMLElement && modalRef.current?.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const save = () => {
    setConsent(analytics ? 'granted' : 'denied');
    closeSettings();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss; Escape + visible Cancel/Save buttons give full keyboard access
    // biome-ignore lint/a11y/useKeyWithClickEvents: same — closing isn't keyboard-only-dependent on this element
    <div className="cookie-overlay" onClick={closeSettings}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stops the overlay's close-on-click from bubbling; not itself an interactive control */}
      <div
        ref={modalRef}
        className="cookie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="cookie-modal-title">Privacy &amp; cookie settings</h2>
        <p className="cookie-intro">
          Choose what you're okay with. <a href="/privacy">Read the full privacy policy</a>.
        </p>

        <div className="cookie-row">
          <div>
            <p className="cookie-row-title">Essential</p>
            <p className="cookie-row-desc">Required for the site to function.</p>
          </div>
          <input type="checkbox" checked disabled aria-label="Essential cookies (always on)" />
        </div>

        <div className="cookie-row">
          <div>
            <p className="cookie-row-title">Analytics</p>
            <p className="cookie-row-desc">Helps me measure traffic and improve the site.</p>
          </div>
          <label className="cookie-switch">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <span className="cookie-switch-label">{analytics ? 'On' : 'Off'}</span>
          </label>
        </div>

        <div className="cookie-actions">
          <button type="button" className="consent-btn ghost" onClick={closeSettings}>
            Cancel
          </button>
          <button type="button" className="consent-btn primary" onClick={save}>
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
