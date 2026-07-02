import type { SearchItem } from '@/lib/searchIndex';

// Ranking for the ⌘K palette's local fuzzy search. Tiers, best first:
// label prefix (100) > label substring (80) > substring anywhere in the
// label+sublabel+keywords haystack (50) > in-order character subsequence
// across the haystack (20). Returns null for no match; an empty query
// matches everything at 0 so the full index renders grouped.
export function scoreItem(item: SearchItem, q: string): number | null {
  if (!q) return 0;
  const needle = q.toLowerCase();
  const label = item.label.toLowerCase();
  if (label.startsWith(needle)) return 100;
  if (label.includes(needle)) return 80;
  const hay = `${label} ${item.sublabel ?? ''} ${item.keywords ?? ''}`.toLowerCase();
  if (hay.includes(needle)) return 50;
  let i = 0;
  for (const ch of hay) {
    if (ch === needle[i]) i++;
    if (i === needle.length) return 20;
  }
  return null;
}
