// Client-side Cloudflare Turnstile machinery for the ⌘K palette's ask flow.
// The component owns the widget container (rendered inside the pending
// assistant bubble) and passes a getter for it; this module owns the api.js
// script promise and the widget lifecycle: script load → container mount-poll
// → widget render → single-use token via callbacks → immediate widget removal.

export const TURNSTILE_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
export const TURNSTILE_TIMEOUT_MS = 30_000;
// How long getTurnstileToken waits for React to commit the widget container.
export const TURNSTILE_MOUNT_TIMEOUT_MS = 2_000;

// Cloudflare Turnstile global (loaded via the api.js script tag), used by the
// CommandPalette (interaction-only) island. The ContactForm island uses
// hCaptcha + Formspree instead (see HCaptchaApi in env.d.ts).
export interface TurnstileApi {
  render(
    el: HTMLElement | string,
    opts: {
      sitekey: string;
      theme?: 'auto' | 'light' | 'dark';
      size?: 'normal' | 'compact' | 'flexible';
      execution?: 'render' | 'execute';
      appearance?: 'always' | 'execute' | 'interaction-only';
      action?: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'timeout-callback'?: () => void;
      'error-callback'?: (errorCode?: string) => void;
    },
  ): string;
  reset(id?: string): void;
  remove(id?: string): void;
  execute(el?: HTMLElement | string, opts?: { callback?: (token: string) => void }): void;
  getResponse(id?: string): string | undefined;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;
// The single live widget id — only one token is ever minted at a time.
let widgetId: string | null = null;

export async function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return;
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      // A failed tag must be removed before rejecting: if it stayed in the DOM,
      // a retry would find it via `existing` and wait on load/error events that
      // already fired — hanging the promise (and the ask) forever.
      const fail = (script: HTMLScriptElement) => {
        script.remove();
        reject(new Error('Chat verification could not load.'));
      };
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => fail(existing), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => fail(script);
      document.head.appendChild(script);
    });
  }
  try {
    await scriptPromise;
  } catch (error) {
    scriptPromise = null;
    throw error;
  }
  if (!window.turnstile) throw new Error('Chat verification is unavailable.');
}

export interface TurnstileTokenRequest {
  /** Site key (an empty string means Turnstile is not configured). */
  siteKey: string;
  /** Turnstile action label attached to the minted token. */
  action: string;
  /** Aborting rejects the token promise with a DOMException named AbortError. */
  signal: AbortSignal;
  /** Returns the widget container once React commits it (null until then). */
  getContainer: () => HTMLElement | null;
}

// Mint one single-use token per ask, then remove the widget immediately.
export async function getTurnstileToken({
  siteKey,
  action,
  signal,
  getContainer,
}: TurnstileTokenRequest): Promise<string> {
  if (!siteKey) throw new Error('Chat verification is not configured.');
  await loadTurnstileScript();
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  // The container is rendered by the pending bubble appended just before this
  // call — React may not have committed it yet, so poll a frame at a time.
  const mountDeadline = performance.now() + TURNSTILE_MOUNT_TIMEOUT_MS;
  while (!getContainer()) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    if (performance.now() > mountDeadline) throw new Error('Chat verification is unavailable.');
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
  const container = getContainer();
  const turnstile = window.turnstile;
  if (!container || !turnstile) throw new Error('Chat verification is unavailable.');

  if (widgetId) {
    try {
      turnstile.remove(widgetId);
    } catch {
      // The previous widget is already gone.
    }
    widgetId = null;
  }
  container.replaceChildren();

  return new Promise<string>((resolve, reject) => {
    let finished = false;
    const finish = (result: { token?: string; error?: string }) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeoutId);
      signal.removeEventListener('abort', onAbort);
      if (widgetId) {
        try {
          turnstile.remove(widgetId);
        } catch {
          // Turnstile may remove a failed widget itself.
        }
        widgetId = null;
      }
      if (result.error === 'aborted') reject(new DOMException('Aborted', 'AbortError'));
      else if (result.error) reject(new Error(result.error));
      else resolve(result.token ?? '');
    };
    const onAbort = () => finish({ error: 'aborted' });
    const timeoutId = window.setTimeout(
      () => finish({ error: 'Chat verification timed out. Please try again.' }),
      TURNSTILE_TIMEOUT_MS,
    );
    signal.addEventListener('abort', onAbort, { once: true });
    widgetId = turnstile.render(container, {
      sitekey: siteKey,
      action,
      size: 'flexible',
      appearance: 'interaction-only',
      callback: (token) => finish({ token }),
      'expired-callback': () => finish({ error: 'Chat verification expired. Please try again.' }),
      'timeout-callback': () =>
        finish({ error: 'Chat verification timed out. Please try again.' }),
      'error-callback': () => finish({ error: 'Chat verification failed. Please try again.' }),
    });
  });
}
