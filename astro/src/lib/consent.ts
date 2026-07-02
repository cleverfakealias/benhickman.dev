import { atom } from 'nanostores';

// Consent is a single all-or-nothing choice (ported from the SPA): analytics on
// or off. Persisted in the `benhickman_consent_v1` cookie (365d, SameSite=Lax)
// and synced across tabs via BroadcastChannel. The actual gtag wiring lives in
// the inline analytics script in BaseLayout; this store drives the UI, calls
// the global grant/deny hooks it exposes, and on deny also expires the _ga*
// cookies gtag already wrote (Consent Mode alone leaves them behind).

export type ConsentStatus = 'granted' | 'denied' | 'unknown';

const COOKIE_NAME = 'benhickman_consent_v1';
const COOKIE_DAYS = 365;
const CHANNEL_NAME = 'benhickman_consent_updates';
// Deletions send Max-Age=0 AND an epoch Expires — some cookie jars (incl.
// happy-dom in tests) only honor one of the two.
const EXPIRE_ATTRS = 'Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT';

declare global {
  interface Window {
    __grantAnalytics?: () => void;
    __denyAnalytics?: () => void;
  }
}

function readCookie(): ConsentStatus {
  if (typeof document === 'undefined') return 'unknown';
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  const value = match?.split('=')[1];
  return value === 'granted' || value === 'denied' ? value : 'unknown';
}

function writeCookie(status: ConsentStatus): void {
  if (typeof document === 'undefined') return;
  if (status === 'unknown') {
    // biome-ignore lint/suspicious/noDocumentCookie: CookieStore has no Safari/Firefox support; this must work synchronously everywhere
    document.cookie = `${COOKIE_NAME}=; ${EXPIRE_ATTRS}; Path=/; SameSite=Lax`;
    return;
  }
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  // biome-ignore lint/suspicious/noDocumentCookie: see above.
  document.cookie = `${COOKIE_NAME}=${status}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

export const consentStore = atom<ConsentStatus>(readCookie());
export const settingsOpen = atom<boolean>(false);

let channel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = (e: MessageEvent<{ consent?: ConsentStatus }>) => {
    const next = e.data?.consent;
    if (next === 'granted' || next === 'denied' || next === 'unknown') {
      consentStore.set(next);
      applyAnalytics(next);
    }
  };
}

// Withdrawal must actually remove GA's identifiers, not just flip Consent Mode:
// gtag stays loaded, so the _ga / _ga_<stream> cookies it already wrote would
// otherwise outlive the user's "deny". GA sets them host-wide (Domain=.host),
// so expire each name against no domain, the bare host, and .host — a cookie
// only dies when the Domain attribute matches how it was set.
export function expireAnalyticsCookies(): void {
  if (typeof document === 'undefined') return;
  const names = new Set(
    document.cookie
      .split('; ')
      .map((c) => c.split('=')[0])
      .filter((name): name is string => Boolean(name?.startsWith('_ga'))),
  );
  const host = location.hostname;
  for (const name of names) {
    const expired = `${name}=; ${EXPIRE_ATTRS}; Path=/; SameSite=Lax`;
    // biome-ignore lint/suspicious/noDocumentCookie: CookieStore has no Safari/Firefox support; this must work synchronously everywhere
    document.cookie = expired;
    // biome-ignore lint/suspicious/noDocumentCookie: see above.
    document.cookie = `${expired}; Domain=${host}`;
    // biome-ignore lint/suspicious/noDocumentCookie: see above.
    document.cookie = `${expired}; Domain=.${host}`;
  }
}

function applyAnalytics(status: ConsentStatus): void {
  if (typeof window === 'undefined') return;
  if (status === 'granted') {
    window.__grantAnalytics?.();
  } else if (status === 'denied') {
    window.__denyAnalytics?.();
    expireAnalyticsCookies();
  }
}

export function setConsent(status: ConsentStatus): void {
  consentStore.set(status);
  writeCookie(status);
  applyAnalytics(status);
  channel?.postMessage({ consent: status });
}

export function openSettings(): void {
  settingsOpen.set(true);
}

export function closeSettings(): void {
  settingsOpen.set(false);
}
