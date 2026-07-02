import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SearchItem } from '@/lib/searchIndex';

// searchIndexClient caches at module level (the point of the module), so every
// test imports a fresh copy via vi.resetModules() and stubs fetch with
// vi.stubGlobal, matching the repo's idiom (see src/pages/api/cmdk.test.ts).

type SearchIndexClient = typeof import('./searchIndexClient');

const ITEMS: SearchItem[] = [
  { group: 'Pages', label: 'Home', href: '/' },
  { group: 'Projects', label: 'Agent Rig', href: '/work/agent-rig', sublabel: 'Agents' },
  { group: 'Writing', label: 'Shipping an agent', href: '/writing/shipping-an-agent' },
];

function okResponse(payload: unknown): Response {
  return { ok: true, status: 200, json: () => Promise.resolve(payload) } as unknown as Response;
}

function errorResponse(status: number): Response {
  return { ok: false, status, json: () => Promise.resolve({}) } as unknown as Response;
}

async function loadClient(): Promise<SearchIndexClient> {
  vi.resetModules();
  return import('./searchIndexClient');
}

function freshSignal(): AbortSignal {
  return new AbortController().signal;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loadSearchIndex', () => {
  it('fetches /search-index.json with the abort signal and keeps only well-formed items', async () => {
    const malformed = [
      null,
      'nope',
      { group: 'Elsewhere', label: 'x', href: '/x' },
      { group: 'Pages', label: 42, href: '/' },
      { group: 'Pages', label: 'No href' },
    ];
    const fetchMock = vi.fn().mockResolvedValue(okResponse([...ITEMS, ...malformed]));
    vi.stubGlobal('fetch', fetchMock);
    const client = await loadClient();
    const controller = new AbortController();

    await expect(client.loadSearchIndex(controller.signal)).resolves.toEqual(ITEMS);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/search-index.json', { signal: controller.signal });
  });

  it('caches a successful load across calls and exposes it synchronously', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse(ITEMS));
    vi.stubGlobal('fetch', fetchMock);
    const client = await loadClient();
    expect(client.getCachedSearchIndex()).toBeNull();

    const first = await client.loadSearchIndex(freshSignal());
    const second = await client.loadSearchIndex(freshSignal());

    expect(second).toBe(first); // same cached array, no refetch
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(client.getCachedSearchIndex()).toBe(first);
  });

  it('dedupes concurrent loads into a single request', async () => {
    let resolveFetch: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const client = await loadClient();

    const first = client.loadSearchIndex(freshSignal());
    const second = client.loadSearchIndex(freshSignal());
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveFetch?.(okResponse(ITEMS));
    await expect(first).resolves.toEqual(ITEMS);
    await expect(second).resolves.toEqual(ITEMS);
  });

  it('rejects with the status message on a non-OK response and retries on the next call', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(errorResponse(500))
      .mockResolvedValueOnce(okResponse(ITEMS));
    vi.stubGlobal('fetch', fetchMock);
    const client = await loadClient();

    await expect(client.loadSearchIndex(freshSignal())).rejects.toThrow(
      'Search index request failed (500).',
    );
    expect(client.getCachedSearchIndex()).toBeNull(); // the failure is not cached

    await expect(client.loadSearchIndex(freshSignal())).resolves.toEqual(ITEMS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('rejects on a malformed (non-array) payload without caching it', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse({ items: [] }));
    vi.stubGlobal('fetch', fetchMock);
    const client = await loadClient();

    await expect(client.loadSearchIndex(freshSignal())).rejects.toThrow(
      'Search index payload is malformed.',
    );
    expect(client.getCachedSearchIndex()).toBeNull();
  });

  it('propagates an abort as AbortError and leaves the cache empty for a retry', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'))
      .mockResolvedValueOnce(okResponse(ITEMS));
    vi.stubGlobal('fetch', fetchMock);
    const client = await loadClient();

    const error = await client.loadSearchIndex(freshSignal()).then(
      () => null,
      (reason: unknown) => reason,
    );
    expect(error).toBeInstanceOf(DOMException);
    expect((error as DOMException).name).toBe('AbortError');
    expect(client.getCachedSearchIndex()).toBeNull();

    await expect(client.loadSearchIndex(freshSignal())).resolves.toEqual(ITEMS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('rejects on a network error without caching the failure', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(okResponse(ITEMS));
    vi.stubGlobal('fetch', fetchMock);
    const client = await loadClient();

    await expect(client.loadSearchIndex(freshSignal())).rejects.toThrow('fetch failed');
    expect(client.getCachedSearchIndex()).toBeNull();

    await expect(client.loadSearchIndex(freshSignal())).resolves.toEqual(ITEMS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
