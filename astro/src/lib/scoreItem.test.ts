import { describe, expect, it } from 'vitest';
import { scoreItem } from '@/lib/scoreItem';
import type { SearchItem } from '@/lib/searchIndex';

const item = (overrides: Partial<SearchItem> = {}): SearchItem => ({
  group: 'Projects',
  label: 'Agent Spec Lab',
  sublabel: 'AI · shipped',
  href: '/work/agent-spec-lab',
  keywords: 'langgraph faq tracing',
  ...overrides,
});

describe('scoreItem', () => {
  it('matches everything at 0 for an empty query', () => {
    expect(scoreItem(item(), '')).toBe(0);
  });

  it('scores a label prefix highest (100)', () => {
    expect(scoreItem(item(), 'agent')).toBe(100);
  });

  it('is case-insensitive', () => {
    expect(scoreItem(item(), 'AGENT')).toBe(100);
  });

  it('scores a non-prefix label substring at 80', () => {
    expect(scoreItem(item(), 'spec')).toBe(80);
  });

  it('scores sublabel/keyword substrings at 50', () => {
    expect(scoreItem(item(), 'shipped')).toBe(50);
    expect(scoreItem(item(), 'langgraph')).toBe(50);
  });

  it('scores an in-order character subsequence at 20', () => {
    // "asl" is not a substring anywhere but appears in order across the haystack.
    expect(scoreItem(item(), 'asl')).toBe(20);
  });

  it('returns null when characters cannot be matched in order', () => {
    expect(scoreItem(item(), 'zzzz')).toBeNull();
  });

  it('ranks prefix > substring > haystack > subsequence for the same query', () => {
    const q = 'rag';
    const prefix = scoreItem(item({ label: 'RAG pipeline' }), q);
    const substring = scoreItem(item({ label: 'Local RAG demo' }), q);
    const haystack = scoreItem(item({ label: 'Chat app', keywords: 'rag retrieval' }), q);
    const subsequence = scoreItem(
      item({ label: 'Report all gaps', sublabel: undefined, keywords: undefined }),
      q,
    );
    expect(prefix).toBe(100);
    expect(substring).toBe(80);
    expect(haystack).toBe(50);
    expect(subsequence).toBe(20);
  });

  it('handles items with no sublabel or keywords', () => {
    const bare = item({ sublabel: undefined, keywords: undefined });
    expect(scoreItem(bare, 'agent')).toBe(100);
    expect(scoreItem(bare, 'missing')).toBeNull();
  });
});
