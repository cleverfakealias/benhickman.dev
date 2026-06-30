import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import type { SearchItem, SearchGroup } from '@/lib/searchIndex';

// ⌘K "ask my work" palette (client:load). v1 is local: fuzzy search over the
// build-time index (pages · projects · writing), navigate on select. The "Ask"
// row streams from /api/cmdk (projects-led/stubbed until the LLM key lands) to
// prove the streaming boundary. Opens from ⌘K / "/" and any [data-cmdk-trigger].

interface Props {
  items: SearchItem[];
}

const GROUP_ORDER: SearchGroup[] = ['Pages', 'Projects', 'Writing'];
const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';

function scoreItem(item: SearchItem, q: string): number | null {
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

type AskState = { status: 'idle' } | { status: 'streaming' | 'done' | 'error'; text: string; error?: string };

export default function CommandPalette({ items }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [ask, setAsk] = useState<AskState>({ status: 'idle' });
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Element focused before the palette opened — restored on close (a11y).
  const returnFocusRef = useRef<HTMLElement | null>(null);
  // Invisible Turnstile, used to mint a fresh token per live-mode ⌘K ask.
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | null>(null);
  const tsResolve = useRef<((t: string) => void) | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelected(0);
    setAsk({ status: 'idle' });
    abortRef.current?.abort();
    returnFocusRef.current?.focus?.();
  }, []);

  // Filtered + grouped results.
  const groups = useMemo(() => {
    const q = query.trim();
    const scored = items
      .map((item) => ({ item, score: scoreItem(item, q) }))
      .filter((r): r is { item: SearchItem; score: number } => r.score !== null)
      .sort((a, b) => b.score - a.score);
    return GROUP_ORDER.map((g) => ({
      group: g,
      items: scored.filter((r) => r.item.group === g).map((r) => r.item),
    })).filter((g) => g.items.length > 0);
  }, [items, query]);

  // Flat selectable rows: optional Ask row first, then results.
  const askRow = query.trim().length > 0;
  const flat = useMemo(() => {
    const rows: ({ kind: 'ask' } | { kind: 'item'; item: SearchItem })[] = [];
    if (askRow) rows.push({ kind: 'ask' });
    for (const g of groups) for (const item of g.items) rows.push({ kind: 'item', item });
    return rows;
  }, [groups, askRow]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  // Open triggers: ⌘K / Ctrl+K, "/" (outside inputs), and [data-cmdk-trigger].
  // Escape closes from anywhere. The click listener runs in CAPTURE phase + stops
  // propagation so it beats Astro's ClientRouter anchor interception (the triggers
  // are <a href="/contact"> fallbacks for the no-JS case).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        close();
      } else if (
        k === '/' &&
        !open &&
        !/^(input|textarea|select)$/i.test((e.target as HTMLElement)?.tagName ?? '') &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement | null)?.closest('[data-cmdk-trigger]');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick, true);
    };
  }, [open, close]);

  // Focus the input, lock scroll, and remember what to focus on close.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Render an invisible Turnstile widget once open (live-mode ask needs a token).
  useEffect(() => {
    if (!open || !TURNSTILE_SITE_KEY) return;
    const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    const render = () => {
      if (!window.turnstile || !tsRef.current || tsId.current) return;
      tsId.current = window.turnstile.render(tsRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        size: 'invisible',
        callback: (t) => {
          tsResolve.current?.(t);
          tsResolve.current = null;
        },
        'error-callback': () => {
          tsResolve.current?.('');
          tsResolve.current = null;
        },
      });
    };
    let iv: ReturnType<typeof setInterval> | undefined;
    if (window.turnstile) render();
    else if (!document.querySelector(`script[src="${SRC}"]`)) {
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    } else {
      iv = setInterval(() => {
        if (window.turnstile) {
          clearInterval(iv);
          render();
        }
      }, 200);
    }
    return () => {
      if (iv) clearInterval(iv);
    };
  }, [open]);

  // Mint a fresh Turnstile token for an ask (empty string if not configured).
  const getToken = useCallback(async (): Promise<string> => {
    if (!TURNSTILE_SITE_KEY) return '';
    const ts = window.turnstile;
    const id = tsId.current;
    if (!ts || !id) return '';
    return new Promise<string>((resolve) => {
      tsResolve.current = resolve;
      try {
        ts.reset(id);
        ts.execute(id);
      } catch {
        tsResolve.current = null;
        resolve('');
      }
      setTimeout(() => {
        if (tsResolve.current) {
          tsResolve.current = null;
          resolve('');
        }
      }, 8000);
    });
  }, []);

  const runAsk = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAsk({ status: 'streaming', text: '' });
    try {
      const turnstileToken = await getToken();
      const res = await fetch('/api/cmdk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, turnstileToken }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let text = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (!payload) continue;
          try {
            const evt = JSON.parse(payload) as { type: string; text?: string };
            if (evt.type === 'token' && evt.text) {
              text += evt.text;
              setAsk({ status: 'streaming', text });
            }
          } catch {
            /* ignore non-JSON keepalives */
          }
        }
      }
      setAsk({ status: 'done', text });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setAsk({ status: 'error', text: '', error: 'Could not reach the assistant. Try the links below.' });
    }
  }, [query, getToken]);

  const activate = useCallback(
    (row: (typeof flat)[number]) => {
      if (row.kind === 'ask') {
        void runAsk();
        return;
      }
      close();
      void navigate(row.item.href);
    },
    [close, runAsk],
  );

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const row = flat[selected];
      if (row) activate(row);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      // Trap focus within the panel.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Keep the selected row in view.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-row="${selected}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  if (!open) return null;

  let rowIndex = -1;
  return (
    <div className="cmdk-overlay" onMouseDown={close}>
      <div
        ref={panelRef}
        className="cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onListKey}
      >
        {TURNSTILE_SITE_KEY && <div ref={tsRef} className="cmdk-turnstile" aria-hidden="true" />}
        <div className="cmdk-input-row">
          <span className="cmdk-prompt" aria-hidden="true">⌘K</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            type="text"
            placeholder="Search pages, projects, writing — or ask my work…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search or ask"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="cmdk-esc">esc</kbd>
        </div>

        <div className="cmdk-list" ref={listRef}>
          {ask.status !== 'idle' && (
            <div
              className="cmdk-answer"
              aria-live="polite"
              aria-busy={ask.status === 'streaming'}
            >
              <p className="cmdk-answer-label">Ask my work</p>
              {ask.status === 'error' ? (
                <p className="cmdk-answer-error">{ask.error}</p>
              ) : ask.status === 'streaming' && ask.text === '' ? (
                <p className="cmdk-answer-text cmdk-thinking">
                  Thinking<span className="cmdk-cursor">…</span>
                </p>
              ) : (
                <p className="cmdk-answer-text">
                  {ask.text}
                  {ask.status === 'streaming' && <span className="cmdk-cursor">▍</span>}
                </p>
              )}
            </div>
          )}

          {askRow &&
            (() => {
              rowIndex++;
              const idx = rowIndex;
              return (
                <button
                  type="button"
                  data-row={idx}
                  className={`cmdk-row ask${selected === idx ? ' selected' : ''}`}
                  onMouseEnter={() => setSelected(idx)}
                  onClick={() => activate({ kind: 'ask' })}
                >
                  <span className="cmdk-row-icon" aria-hidden="true">›_</span>
                  <span className="cmdk-row-label">
                    Ask my work: <strong>{query.trim()}</strong>
                  </span>
                </button>
              );
            })()}

          {groups.map((g) => (
            <div className="cmdk-group" key={g.group}>
              <p className="cmdk-group-label">{g.group}</p>
              {g.items.map((item) => {
                rowIndex++;
                const idx = rowIndex;
                return (
                  <button
                    type="button"
                    key={item.href + item.label}
                    data-row={idx}
                    className={`cmdk-row${selected === idx ? ' selected' : ''}`}
                    onMouseEnter={() => setSelected(idx)}
                    onClick={() => activate({ kind: 'item', item })}
                  >
                    <span className="cmdk-row-label">{item.label}</span>
                    {item.sublabel && <span className="cmdk-row-sub">{item.sublabel}</span>}
                  </button>
                );
              })}
            </div>
          ))}

          {flat.length === 0 && <p className="cmdk-empty">No matches.</p>}
        </div>
      </div>
    </div>
  );
}
