import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TurnstileApi, TurnstileTokenRequest } from './turnstileClient';

// turnstileClient owns module-level state (the api.js script promise and the
// live widget id), so every test imports a fresh copy via vi.resetModules().
// The suite runs under the default node environment: the small DOM surface the
// module touches (document.createElement/querySelector/head, window.turnstile,
// window.setTimeout, requestAnimationFrame, performance.now) is stubbed with
// vi.stubGlobal, matching the repo's idiom (see src/pages/api/cmdk.test.ts).

type TurnstileClient = typeof import('./turnstileClient');
type RenderOptions = Parameters<TurnstileApi['render']>[1];

interface FakeScriptTag {
  src: string;
  async: boolean;
  defer: boolean;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  remove: () => void;
  addEventListener: (
    type: 'load' | 'error',
    listener: () => void,
    options?: { once?: boolean },
  ) => void;
  /** Test hook: fires the on* handler plus any addEventListener listeners. */
  fire: (type: 'load' | 'error') => void;
}

interface FakeWindow {
  turnstile?: TurnstileApi;
  setTimeout: (handler: () => void, timeout?: number) => unknown;
}

function makeFakeScriptTag(head: FakeScriptTag[]): FakeScriptTag {
  const listeners: { load: (() => void)[]; error: (() => void)[] } = { load: [], error: [] };
  const tag: FakeScriptTag = {
    src: '',
    async: false,
    defer: false,
    onload: null,
    onerror: null,
    remove: () => {
      const index = head.indexOf(tag);
      if (index >= 0) head.splice(index, 1);
    },
    addEventListener: (type, listener) => {
      listeners[type].push(listener);
    },
    fire: (type) => {
      if (type === 'load') tag.onload?.();
      else tag.onerror?.();
      const queued = listeners[type];
      listeners[type] = [];
      for (const listener of queued) listener();
    },
  };
  return tag;
}

interface DomStub {
  /** Script tags currently appended to the fake document head. */
  head: FakeScriptTag[];
  win: FakeWindow;
}

function stubDom(turnstile?: TurnstileApi): DomStub {
  const head: FakeScriptTag[] = [];
  const win: FakeWindow = {
    turnstile,
    setTimeout: (handler, timeout) => globalThis.setTimeout(handler, timeout),
  };
  vi.stubGlobal('document', {
    createElement: (tagName: string) => {
      if (tagName !== 'script') throw new Error(`unexpected createElement(${tagName})`);
      return makeFakeScriptTag(head);
    },
    querySelector: (selector: string) =>
      head.find((tag) => selector === `script[src="${tag.src}"]`) ?? null,
    head: {
      appendChild: (tag: FakeScriptTag) => {
        head.push(tag);
        return tag;
      },
    },
  });
  vi.stubGlobal('window', win);
  vi.stubGlobal('requestAnimationFrame', (callback: (time: number) => void): number => {
    globalThis.setTimeout(() => callback(performance.now()), 0);
    return 0;
  });
  return { head, win };
}

function makeFakeTurnstile() {
  const renders: { container: HTMLElement | string; options: RenderOptions }[] = [];
  const api: TurnstileApi = {
    render: vi.fn((container: HTMLElement | string, options: RenderOptions) => {
      renders.push({ container, options });
      return `widget-${renders.length}`;
    }),
    reset: vi.fn(),
    remove: vi.fn(),
    execute: vi.fn(),
    getResponse: vi.fn(() => undefined),
  };
  return { api, renders };
}

function makeContainer() {
  const replaceChildren = vi.fn();
  const container = { replaceChildren } as unknown as HTMLElement;
  return { container, replaceChildren };
}

async function loadClient(): Promise<TurnstileClient> {
  vi.resetModules();
  return import('./turnstileClient');
}

function tokenRequest(overrides: Partial<TurnstileTokenRequest> = {}): TurnstileTokenRequest {
  return {
    siteKey: 'test-site-key',
    action: 'portfolio-chat',
    signal: new AbortController().signal,
    getContainer: () => null,
    ...overrides,
  };
}

async function rejectionOf(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => null,
    (reason: unknown) => reason,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('loadTurnstileScript', () => {
  it('resolves without injecting a script when window.turnstile already exists', async () => {
    const { api } = makeFakeTurnstile();
    const { head } = stubDom(api);
    const client = await loadClient();

    await expect(client.loadTurnstileScript()).resolves.toBeUndefined();

    expect(head).toHaveLength(0);
  });

  it('removes a failed script tag before rejecting so a retry re-creates it', async () => {
    const { head, win } = stubDom();
    const client = await loadClient();

    const first = client.loadTurnstileScript();
    expect(head).toHaveLength(1);
    const firstTag = head[0];
    expect(firstTag.src).toBe(client.TURNSTILE_SRC);
    firstTag.fire('error');
    await expect(first).rejects.toThrow('Chat verification could not load.');
    // The dead tag must be gone: if it stayed, a retry would find it via the
    // `existing` branch and wait forever on load/error events that already fired.
    expect(head).toHaveLength(0);

    const second = client.loadTurnstileScript();
    expect(head).toHaveLength(1);
    const secondTag = head[0];
    expect(secondTag).not.toBe(firstTag);
    win.turnstile = makeFakeTurnstile().api;
    secondTag.fire('load');
    await expect(second).resolves.toBeUndefined();
  });

  it('shares one in-flight script load across concurrent callers', async () => {
    const { head, win } = stubDom();
    const client = await loadClient();

    const first = client.loadTurnstileScript();
    const second = client.loadTurnstileScript();
    expect(head).toHaveLength(1);

    win.turnstile = makeFakeTurnstile().api;
    head[0].fire('load');
    await expect(first).resolves.toBeUndefined();
    await expect(second).resolves.toBeUndefined();
  });

  it('waits on an existing tag rather than duplicating it, and still removes it on error', async () => {
    const { head } = stubDom();
    const stale = (await loadClient()).loadTurnstileScript();
    stale.catch(() => {
      // Settles via the shared tag's error event below; assertions are on `retry`.
    });
    expect(head).toHaveLength(1);

    // A fresh module copy (no script promise yet) sees the tag already in the DOM.
    const client = await loadClient();
    const retry = client.loadTurnstileScript();
    expect(head).toHaveLength(1);

    head[0].fire('error');
    await expect(retry).rejects.toThrow('Chat verification could not load.');
    expect(head).toHaveLength(0);
  });

  it('rejects when the script loads but the turnstile global never appears', async () => {
    const { head } = stubDom();
    const client = await loadClient();

    const promise = client.loadTurnstileScript();
    head[0].fire('load');

    await expect(promise).rejects.toThrow('Chat verification is unavailable.');
  });
});

describe('getTurnstileToken', () => {
  it('rejects when Turnstile is not configured (empty site key)', async () => {
    const { head } = stubDom();
    const client = await loadClient();

    await expect(client.getTurnstileToken(tokenRequest({ siteKey: '' }))).rejects.toThrow(
      'Chat verification is not configured.',
    );
    // Rejected before ever touching the script loader.
    expect(head).toHaveLength(0);
  });

  it('rejects with AbortError when the signal is already aborted after script load', async () => {
    const { api } = makeFakeTurnstile();
    stubDom(api);
    const client = await loadClient();
    const controller = new AbortController();
    controller.abort();

    const error = await rejectionOf(
      client.getTurnstileToken(tokenRequest({ signal: controller.signal })),
    );

    expect(error).toBeInstanceOf(DOMException);
    expect((error as DOMException).name).toBe('AbortError');
    expect(api.render).not.toHaveBeenCalled();
  });

  it('rejects with AbortError when aborted during the container mount poll', async () => {
    const { api } = makeFakeTurnstile();
    stubDom(api);
    const client = await loadClient();
    const controller = new AbortController();

    const promise = client.getTurnstileToken(
      tokenRequest({ signal: controller.signal, getContainer: () => null }),
    );
    // Let the poll enter its first requestAnimationFrame wait, then abort.
    await new Promise((resolve) => globalThis.setTimeout(resolve, 0));
    controller.abort();

    const error = await rejectionOf(promise);
    expect(error).toBeInstanceOf(DOMException);
    expect((error as DOMException).name).toBe('AbortError');
    expect(api.render).not.toHaveBeenCalled();
  });

  it('rejects when the container never mounts before the deadline', async () => {
    const { api } = makeFakeTurnstile();
    stubDom(api);
    const client = await loadClient();
    const now = vi.spyOn(performance, 'now');
    now.mockReturnValueOnce(0); // sets mountDeadline = TURNSTILE_MOUNT_TIMEOUT_MS
    now.mockReturnValue(client.TURNSTILE_MOUNT_TIMEOUT_MS + 1);

    await expect(
      client.getTurnstileToken(tokenRequest({ getContainer: () => null })),
    ).rejects.toThrow('Chat verification is unavailable.');
    expect(api.render).not.toHaveBeenCalled();
  });

  it('renders into the cleared container, resolves the token, and removes the widget', async () => {
    const { api, renders } = makeFakeTurnstile();
    stubDom(api);
    const client = await loadClient();
    const { container, replaceChildren } = makeContainer();

    const promise = client.getTurnstileToken(
      tokenRequest({ siteKey: 'site-key', action: 'portfolio-chat', getContainer: () => container }),
    );
    await vi.waitFor(() => expect(api.render).toHaveBeenCalledTimes(1));

    expect(replaceChildren).toHaveBeenCalledTimes(1);
    const { container: renderedInto, options } = renders[0];
    expect(renderedInto).toBe(container);
    expect(options.sitekey).toBe('site-key');
    expect(options.action).toBe('portfolio-chat');
    expect(options.size).toBe('flexible');
    expect(options.appearance).toBe('interaction-only');

    options.callback?.('token-1');
    await expect(promise).resolves.toBe('token-1');
    // Single-use: the widget is removed as soon as the token is minted.
    expect(api.remove).toHaveBeenCalledWith('widget-1');
  });

  it.each([
    ['expired-callback', 'Chat verification expired. Please try again.'],
    ['timeout-callback', 'Chat verification timed out. Please try again.'],
    ['error-callback', 'Chat verification failed. Please try again.'],
  ] as const)(
    'rejects with the exact message when the %s fires and removes the widget',
    async (callbackName, message) => {
      const { api, renders } = makeFakeTurnstile();
      stubDom(api);
      const client = await loadClient();
      const { container } = makeContainer();

      const promise = client.getTurnstileToken(tokenRequest({ getContainer: () => container }));
      await vi.waitFor(() => expect(api.render).toHaveBeenCalledTimes(1));

      renders[0].options[callbackName]?.();
      await expect(promise).rejects.toThrow(message);
      expect(api.remove).toHaveBeenCalledWith('widget-1');
    },
  );

  it('rejects with AbortError and removes the widget when aborted mid-challenge', async () => {
    const { api } = makeFakeTurnstile();
    stubDom(api);
    const client = await loadClient();
    const { container } = makeContainer();
    const controller = new AbortController();

    const promise = client.getTurnstileToken(
      tokenRequest({ signal: controller.signal, getContainer: () => container }),
    );
    await vi.waitFor(() => expect(api.render).toHaveBeenCalledTimes(1));
    controller.abort();

    const error = await rejectionOf(promise);
    expect(error).toBeInstanceOf(DOMException);
    expect((error as DOMException).name).toBe('AbortError');
    expect(api.remove).toHaveBeenCalledWith('widget-1');
  });

  it('times out with the exact message when no callback ever fires', async () => {
    vi.useFakeTimers();
    const { api } = makeFakeTurnstile();
    stubDom(api);
    const client = await loadClient();
    const { container } = makeContainer();

    const promise = client.getTurnstileToken(tokenRequest({ getContainer: () => container }));
    await vi.advanceTimersByTimeAsync(0); // flush the async run-up to render
    expect(api.render).toHaveBeenCalledTimes(1);

    const rejection = expect(promise).rejects.toThrow(
      'Chat verification timed out. Please try again.',
    );
    await vi.advanceTimersByTimeAsync(client.TURNSTILE_TIMEOUT_MS);
    await rejection;
    expect(api.remove).toHaveBeenCalledWith('widget-1');
  });
});
