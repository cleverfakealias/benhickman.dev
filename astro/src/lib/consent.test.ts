// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

// consent.ts carries module-level state (the store is seeded from the cookie at
// import time, and a BroadcastChannel is wired up), so every test loads a fresh
// copy via resetModules after arranging document.cookie.
type ConsentModule = typeof import('./consent');

const COOKIE_NAME = 'benhickman_consent_v1';

async function loadConsent(): Promise<ConsentModule> {
  vi.resetModules();
  return import('./consent');
}

function setCookie(value: string): void {
  // biome-ignore lint/suspicious/noDocumentCookie: seeding the jar for the code under test.
  document.cookie = value;
}

// happy-dom keeps one cookie jar per test file; expire everything between tests.
// (Epoch Expires, not Max-Age=0 — happy-dom's jar only deletes on the former.)
function clearAllCookies(): void {
  for (const pair of document.cookie.split('; ')) {
    const name = pair.split('=')[0];
    if (name) setCookie(`${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`);
  }
}

beforeEach(() => {
  clearAllCookies();
  delete window.__grantAnalytics;
  delete window.__denyAnalytics;
});

describe('consent cookie parsing (store seed)', () => {
  it('seeds the store from a granted cookie', async () => {
    setCookie(`${COOKIE_NAME}=granted; Path=/`);
    const consent = await loadConsent();
    expect(consent.consentStore.get()).toBe('granted');
  });

  it('seeds the store from a denied cookie', async () => {
    setCookie(`${COOKIE_NAME}=denied; Path=/`);
    const consent = await loadConsent();
    expect(consent.consentStore.get()).toBe('denied');
  });

  it('treats a missing cookie as unknown', async () => {
    const consent = await loadConsent();
    expect(consent.consentStore.get()).toBe('unknown');
  });

  it('treats an unrecognized cookie value as unknown', async () => {
    setCookie(`${COOKIE_NAME}=wat; Path=/`);
    const consent = await loadConsent();
    expect(consent.consentStore.get()).toBe('unknown');
  });
});

describe('setConsent', () => {
  it('persists granted, updates the store, and calls the grant hook', async () => {
    const consent = await loadConsent();
    const grant = vi.fn();
    window.__grantAnalytics = grant;

    consent.setConsent('granted');

    expect(document.cookie).toContain(`${COOKIE_NAME}=granted`);
    expect(consent.consentStore.get()).toBe('granted');
    expect(grant).toHaveBeenCalled();
  });

  it('expires the consent cookie when reset to unknown', async () => {
    setCookie(`${COOKIE_NAME}=granted; Path=/`);
    const consent = await loadConsent();

    consent.setConsent('unknown');

    expect(document.cookie).not.toContain(COOKIE_NAME);
    expect(consent.consentStore.get()).toBe('unknown');
  });

  it('on deny: persists, calls the deny hook, and removes GA cookies', async () => {
    setCookie('_ga=GA1.1.123456789.987654321; Path=/');
    setCookie('_ga_ABC123XYZ=GS1.1.1111.2222; Path=/');
    setCookie('unrelated=keep-me; Path=/');
    const consent = await loadConsent();
    const deny = vi.fn();
    window.__denyAnalytics = deny;

    consent.setConsent('denied');

    expect(deny).toHaveBeenCalled();
    expect(document.cookie).toContain(`${COOKIE_NAME}=denied`);
    expect(consent.consentStore.get()).toBe('denied');
    expect(document.cookie).not.toContain('_ga=');
    expect(document.cookie).not.toContain('_ga_ABC123XYZ=');
    expect(document.cookie).toContain('unrelated=keep-me');
  });

  it('deny still cleans up GA cookies when no deny hook is installed', async () => {
    setCookie('_ga=GA1.1.1.1; Path=/');
    const consent = await loadConsent();

    consent.setConsent('denied');

    expect(document.cookie).not.toContain('_ga=');
  });
});

describe('expireAnalyticsCookies', () => {
  it('expires _ga and _ga_<stream> cookies and leaves everything else', async () => {
    setCookie('_ga=GA1.1.1.1; Path=/');
    setCookie('_ga_STREAMID=GS1.1.1.1; Path=/');
    setCookie('theme=dark; Path=/');
    const { expireAnalyticsCookies } = await loadConsent();

    expireAnalyticsCookies();

    expect(document.cookie).not.toContain('_ga');
    expect(document.cookie).toContain('theme=dark');
  });

  it('is a no-op when no analytics cookies exist', async () => {
    setCookie('theme=dark; Path=/');
    const { expireAnalyticsCookies } = await loadConsent();

    expect(() => expireAnalyticsCookies()).not.toThrow();
    expect(document.cookie).toContain('theme=dark');
  });
});
