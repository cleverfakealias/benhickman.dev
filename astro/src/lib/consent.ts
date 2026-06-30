import { atom } from 'nanostores';

// Consent is a single all-or-nothing choice (ported from the SPA): analytics on
// or off. Persisted in the `benhickman_consent_v1` cookie (365d, SameSite=Lax)
// and synced across tabs via BroadcastChannel. The actual gtag wiring lives in
// the inline analytics script in BaseLayout; this store just drives the UI and
// calls the global grant/deny hooks it exposes.

export type ConsentStatus = 'granted' | 'denied' | 'unknown';

const COOKIE_NAME = 'benhickman_consent_v1';
const COOKIE_DAYS = 365;
const CHANNEL_NAME = 'benhickman_consent_updates';

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
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
    return;
  }
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';
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

function applyAnalytics(status: ConsentStatus): void {
  if (typeof window === 'undefined') return;
  if (status === 'granted') window.__grantAnalytics?.();
  else if (status === 'denied') window.__denyAnalytics?.();
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
