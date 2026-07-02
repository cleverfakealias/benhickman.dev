import type { SearchItem } from '@/lib/searchIndex';

// Client-side fetch/cache for the prerendered /search-index.json consumed by
// the ⌘K palette. The index is a static per-deploy asset, so one successful
// fetch serves every open (module-level cache — survives island remounts and
// view transitions). A failed or aborted load leaves the cache empty so the
// next open retries; until then the palette degrades to the Ask row only.
let indexCache: SearchItem[] | null = null;
let indexInFlight: Promise<SearchItem[]> | null = null;

/** Synchronous cache read for initial island state (null until a load succeeds). */
export function getCachedSearchIndex(): SearchItem[] | null {
  return indexCache;
}

function isSearchItem(value: unknown): value is SearchItem {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.group === 'Pages' || v.group === 'Projects' || v.group === 'Writing') &&
    typeof v.label === 'string' &&
    typeof v.href === 'string'
  );
}

export function loadSearchIndex(signal: AbortSignal): Promise<SearchItem[]> {
  if (indexCache) return Promise.resolve(indexCache);
  if (!indexInFlight) {
    indexInFlight = (async () => {
      const res = await fetch('/search-index.json', { signal });
      if (!res.ok) throw new Error(`Search index request failed (${res.status}).`);
      const payload: unknown = await res.json();
      if (!Array.isArray(payload)) throw new Error('Search index payload is malformed.');
      indexCache = payload.filter(isSearchItem);
      return indexCache;
    })();
    indexInFlight.catch(() => {
      indexInFlight = null;
    });
  }
  return indexInFlight;
}
