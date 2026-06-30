import { useStore } from '@nanostores/react';
import { consentStore, setConsent, openSettings } from '@/lib/consent';

// Shown only while consent is 'unknown'. All-or-nothing (Reject / Accept all),
// with a link into the granular settings modal. Offset above the mobile bottom
// nav via CSS. client:idle.
export default function ConsentBanner() {
  const consent = useStore(consentStore);
  if (consent !== 'unknown') return null;

  return (
    <div className="consent-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <p className="consent-text">
        We use cookies to improve this site and measure traffic. Choose what you're okay with.{' '}
        <button type="button" className="consent-link" onClick={openSettings}>
          Privacy &amp; cookie settings
        </button>
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-btn ghost" onClick={() => setConsent('denied')}>
          Reject
        </button>
        <button type="button" className="consent-btn primary" onClick={() => setConsent('granted')}>
          Accept all
        </button>
      </div>
    </div>
  );
}
