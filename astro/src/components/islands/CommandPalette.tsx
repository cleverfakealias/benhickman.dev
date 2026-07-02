import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { scoreItem } from '@/lib/scoreItem';
import type { SearchItem, SearchGroup } from '@/lib/searchIndex';

// ⌘K "ask my work" palette (client:idle). v1 is local: fuzzy search over the
// prerendered /search-index.json (pages · projects · writing) fetched on first
// open, navigate on select. The "Ask" row streams from /api/cmdk (projects-led/
// stubbed until the LLM key lands) to prove the streaming boundary. Opens from
// ⌘K / "/" and any [data-cmdk-trigger].

const GROUP_ORDER: SearchGroup[] = ['Pages', 'Projects', 'Writing'];
const TURNSTILE_SITE_KEY =
  import.meta.env.PUBLIC_CMDK_TURNSTILE_SITE_KEY ??
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ??
  '';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TURNSTILE_TIMEOUT_MS = 30_000;
// How long getToken waits for React to commit the in-bubble widget container.
const TURNSTILE_MOUNT_TIMEOUT_MS = 2_000;
const CHAT_ACTION = 'portfolio-chat';

// The index is a static per-deploy asset, so one successful fetch serves every
// open (module-level cache — survives island remounts and view transitions).
// A failed or aborted load leaves the cache empty so the next open retries;
// until then search degrades to the Ask row only.
let indexCache: SearchItem[] | null = null;
let indexInFlight: Promise<SearchItem[]> | null = null;

function isSearchItem(value: unknown): value is SearchItem {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.group === 'Pages' || v.group === 'Projects' || v.group === 'Writing') &&
    typeof v.label === 'string' &&
    typeof v.href === 'string'
  );
}

function loadSearchIndex(signal: AbortSignal): Promise<SearchItem[]> {
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

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

// Lifecycle of the single pending assistant bubble: Turnstile verification
// (widget rendered inline), waiting on the model (optionally relabelled by
// server `status` events), then token streaming. `null` = no ask in flight.
type PendingPhase = 'verifying' | 'thinking' | 'streaming';

function messageId(): string {
  return crypto.randomUUID();
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SearchItem[]>(() => indexCache ?? []);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  // Phase of the in-flight ask plus an optional server-sent status label
  // ("Searching the site…") shown in place of "Thinking…" while tools run.
  const [pendingPhase, setPendingPhase] = useState<PendingPhase | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  // Last fully streamed answer — fed to a polite status region so screen
  // readers hear completed responses once, not every token of the stream.
  const [announcedAnswer, setAnnouncedAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Element focused before the palette opened — restored on close (a11y).
  const returnFocusRef = useRef<HTMLElement | null>(null);
  // Turnstile is rendered only while minting a fresh token for an ask. The
  // container lives inside the pending assistant bubble (phase 'verifying'),
  // so getToken must await its mount before rendering into it.
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | null>(null);
  const tsScriptPromise = useRef<Promise<void> | null>(null);
  const resetPending = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelected(0);
    setChatError(null);
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: `query` is a trigger-only dep — resets selection on change without reading its value
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

  // Fetch the search index on first open (instant resolve once cached). On
  // failure the palette stays usable for chat; the next open retries.
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    loadSearchIndex(controller.signal).then(
      (loaded) => setItems(loaded),
      () => {
        // Degrade to the Ask row only.
      },
    );
    return () => {
      controller.abort();
    };
  }, [open]);

  // Restore the server-backed thread once per page load.
  useEffect(() => {
    if (!open || historyLoaded) return;
    const controller = new AbortController();
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/cmdk', {
          headers: { accept: 'application/json' },
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { messages?: unknown };
        if (!Array.isArray(payload.messages)) return;
        const restored = payload.messages.flatMap<ChatMessage>((message) => {
          if (
            typeof message !== 'object' ||
            message === null ||
            !('role' in message) ||
            !('content' in message) ||
            (message.role !== 'user' && message.role !== 'assistant') ||
            typeof message.content !== 'string'
          ) {
            return [];
          }
          return [{ id: messageId(), role: message.role, content: message.content }];
        });
        // An ask may have started while this fetch was in flight — replacing the
        // array would orphan the pending bubbles and drop the streamed answer.
        setMessages((current) => (current.length > 0 ? current : restored));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setChatError('The previous conversation could not be restored. You can still start a new one.');
        }
      } finally {
        if (!controller.signal.aborted) setHistoryLoaded(true);
      }
    };
    void loadHistory();
    return () => {
      controller.abort();
    };
  }, [open, historyLoaded]);

  const loadTurnstileScript = useCallback(async (): Promise<void> => {
    if (window.turnstile) return;
    if (!tsScriptPromise.current) {
      tsScriptPromise.current = new Promise<void>((resolve, reject) => {
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
      await tsScriptPromise.current;
    } catch (error) {
      tsScriptPromise.current = null;
      throw error;
    }
    if (!window.turnstile) throw new Error('Chat verification is unavailable.');
  }, []);

  // Mint one single-use token per ask, then remove the widget immediately.
  const getToken = useCallback(async (signal: AbortSignal): Promise<string> => {
    if (!TURNSTILE_SITE_KEY) throw new Error('Chat verification is not configured.');
    await loadTurnstileScript();
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    // The container is rendered by the pending bubble appended just before this
    // call — React may not have committed it yet, so poll a frame at a time.
    const mountDeadline = performance.now() + TURNSTILE_MOUNT_TIMEOUT_MS;
    while (!tsRef.current) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      if (performance.now() > mountDeadline) throw new Error('Chat verification is unavailable.');
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
    const container = tsRef.current;
    const turnstile = window.turnstile;
    if (!container || !turnstile) throw new Error('Chat verification is unavailable.');

    if (tsId.current) {
      try {
        turnstile.remove(tsId.current);
      } catch {
        // The previous widget is already gone.
      }
      tsId.current = null;
    }
    container.replaceChildren();

    return new Promise<string>((resolve, reject) => {
      let finished = false;
      const finish = (result: { token?: string; error?: string }) => {
        if (finished) return;
        finished = true;
        clearTimeout(timeoutId);
        signal.removeEventListener('abort', onAbort);
        if (tsId.current) {
          try {
            turnstile.remove(tsId.current);
          } catch {
            // Turnstile may remove a failed widget itself.
          }
          tsId.current = null;
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
      tsId.current = turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        action: CHAT_ACTION,
        size: 'flexible',
        appearance: 'interaction-only',
        callback: (token) => finish({ token }),
        'expired-callback': () => finish({ error: 'Chat verification expired. Please try again.' }),
        'timeout-callback': () => finish({ error: 'Chat verification timed out. Please try again.' }),
        'error-callback': () => finish({ error: 'Chat verification failed. Please try again.' }),
      });
    });
  }, [loadTurnstileScript]);

  const clearConversation = useCallback(async () => {
    abortRef.current?.abort();
    resetPending.current = true;
    setMessages([]);
    setChatError(null);
    setStreaming(false);
    setQuery('');
    try {
      const response = await fetch('/api/cmdk', { method: 'DELETE' });
      if (response.ok) resetPending.current = false;
    } catch {
      // The next POST carries reset=true as a reliable fallback.
    }
    inputRef.current?.focus();
  }, []);

  const runAsk = useCallback(async () => {
    const q = query.trim();
    if (!q || streaming) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const userId = messageId();
    const assistantId = messageId();
    const userMessage: ChatMessage = { id: userId, role: 'user', content: q };
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
    };
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setQuery('');
    setChatError(null);
    setStreaming(true);
    // The pending bubble opens on the verify step; its container is what
    // getToken (below) renders the Turnstile widget into.
    setPendingPhase('verifying');
    setStatusText(null);
    let answer = '';

    const updateAssistant = (content: string, isStreaming: boolean) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId ? { ...message, content, streaming: isStreaming } : message,
        ),
      );
    };

    try {
      const turnstileToken = await getToken(controller.signal);
      setPendingPhase('thinking');
      const shouldReset = resetPending.current;
      const res = await fetch('/api/cmdk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, turnstileToken, reset: shouldReset }),
        signal: controller.signal,
      });
      if (shouldReset) resetPending.current = false;
      if (!res.ok) {
        let message = `The assistant request failed (${res.status}).`;
        try {
          const payload = (await res.json()) as { error?: unknown };
          if (typeof payload.error === 'string') message = payload.error;
        } catch {
          // Keep the status-based fallback.
        }
        throw new Error(message);
      }
      if (!res.body) throw new Error('The assistant returned no response stream.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let serverError = '';
      const consumeLine = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) return;
        const payload = trimmed.slice(5).trim();
        if (!payload) return;
        try {
          const event = JSON.parse(payload) as { type?: unknown; text?: unknown; message?: unknown };
          if (event.type === 'token' && typeof event.text === 'string') {
            if (!answer) {
              // First token ends the thinking/tool-status step.
              setPendingPhase('streaming');
              setStatusText(null);
            }
            answer += event.text;
            updateAssistant(answer, true);
          } else if (event.type === 'status' && typeof event.text === 'string') {
            // Tool-progress label ("Searching the site…") shown until tokens arrive.
            setStatusText(event.text);
          } else if (event.type === 'error' && typeof event.message === 'string') {
            serverError = event.message;
          }
        } catch {
          // Ignore malformed keepalive frames.
        }
      };

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) consumeLine(line);
      }
      if (buffer) consumeLine(buffer);
      if (serverError) throw new Error(serverError);
      if (!answer.trim()) throw new Error('The assistant returned an empty answer. Please try again.');
      updateAssistant(answer.trim(), false);
      setAnnouncedAnswer(answer.trim());
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages((current) =>
          current.flatMap((message) => {
            if (message.id !== assistantId) return [message];
            return message.content ? [{ ...message, streaming: false }] : [];
          }),
        );
        return;
      }
      setMessages((current) =>
        current.filter((message) => message.id !== userId && message.id !== assistantId),
      );
      setQuery(q);
      setChatError(err instanceof Error ? err.message : 'The assistant request failed.');
    } finally {
      // Clear the phase/status so restored or finished messages (and any error
      // retry) never render the verify widget or a stale tool label.
      setPendingPhase(null);
      setStatusText(null);
      setStreaming(false);
      abortRef.current = null;
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [query, streaming, getToken]);

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
    // Arrow/Enter selection is a combobox affordance of the input (expressed
    // via aria-activedescendant). When focus sits on a real button — "New
    // chat", "stop", or a result row — native activation must win, otherwise
    // Enter on "stop" mid-stream would navigate to the highlighted result.
    const inInput = document.activeElement === inputRef.current;
    if (e.key === 'ArrowDown' && inInput) {
      e.preventDefault();
      // Clamp low as well as high: on an empty list, min(s+1, -1) would drive
      // selection negative and point aria-activedescendant at a ghost id.
      setSelected((s) => Math.max(0, Math.min(s + 1, flat.length - 1)));
    } else if (e.key === 'ArrowUp' && inInput) {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && inInput) {
      e.preventDefault();
      // The input is readOnly (not disabled) mid-stream so focus survives, but
      // Enter must not navigate away from a streaming answer.
      if (streaming) return;
      const row = flat[selected];
      if (row) activate(row);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      // Trap focus within the panel.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
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

  const resultCount = flat.length - (askRow ? 1 : 0);
  const resultsAnnouncement =
    resultCount > 0
      ? `${resultCount} ${resultCount === 1 ? 'result' : 'results'} available.`
      : askRow
        ? 'No matching results. Press Enter to ask instead.'
        : 'No matches.';
  let rowIndex = -1;
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss; the dialog is fully keyboard-operable (Escape, onListKey) without this element
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
        {messages.length > 0 && (
          <div className="cmdk-chat-header">
            <span>Conversation</span>
            <button type="button" onClick={() => void clearConversation()} disabled={streaming}>
              New chat
            </button>
          </div>
        )}
        <div className="cmdk-input-row">
          <span className="cmdk-prompt" aria-hidden="true">⌘K</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            type="text"
            placeholder={messages.length > 0 ? 'Ask a follow-up…' : 'Search — or ask about Ben’s work…'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search or ask"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls="cmdk-listbox"
            aria-activedescendant={flat.length > 0 ? `cmdk-option-${selected}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            // readOnly, not disabled: a disabled input drops keyboard focus to
            // <body>, escaping the modal focus trap mid-stream. Enter-to-
            // activate is separately guarded while streaming in onListKey.
            readOnly={streaming}
            // Mirrors the server's MAX_QUERY_CHARS so an over-long paste fails
            // before minting (and wasting) a Turnstile token.
            maxLength={500}
          />
          {streaming ? (
            <button type="button" className="cmdk-stop" onClick={() => abortRef.current?.abort()}>
              stop
            </button>
          ) : (
            <kbd className="cmdk-esc">esc</kbd>
          )}
        </div>

        <div className="cmdk-list" ref={listRef}>
          {messages.length > 0 && (
            <div className="cmdk-thread" aria-busy={streaming}>
              {messages.map((message) => {
                // The single in-flight assistant bubble (content arrives later).
                const isPending = message.role === 'assistant' && message.streaming && !message.content;
                return (
                  <div className={`cmdk-message ${message.role}`} key={message.id}>
                    <p className="cmdk-message-label">{message.role === 'user' ? 'You' : 'Ben’s assistant'}</p>
                    {isPending && pendingPhase === 'verifying' ? (
                      <div className="cmdk-verify">
                        {/* role="status" announces the verify step once, politely. */}
                        <p className="cmdk-verify-label" role="status">
                          Verifying you’re human…
                        </p>
                        <div ref={tsRef} className="cmdk-verify-widget" />
                      </div>
                    ) : (
                      <p className={message.content ? 'cmdk-message-text' : 'cmdk-message-text cmdk-thinking'}>
                        {message.content || (isPending ? (statusText ?? 'Thinking…') : 'Thinking…')}
                        {message.streaming && <span className="cmdk-cursor">▍</span>}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {chatError && <p className="cmdk-answer-error" role="alert">{chatError}</p>}

          <div id="cmdk-listbox" role="listbox" aria-label="Results">
            {askRow &&
              (() => {
                rowIndex++;
                const idx = rowIndex;
                return (
                  <button
                    type="button"
                    id={`cmdk-option-${idx}`}
                    role="option"
                    aria-selected={selected === idx}
                    data-row={idx}
                    className={`cmdk-row ask${selected === idx ? ' selected' : ''}`}
                    onMouseEnter={() => setSelected(idx)}
                    onClick={() => activate({ kind: 'ask' })}
                  >
                    <span className="cmdk-row-icon" aria-hidden="true">›_</span>
                    <span className="cmdk-row-label">
                      {messages.length > 0 ? 'Ask a follow-up' : 'Ask my work'}:{' '}
                      <strong>{query.trim()}</strong>
                    </span>
                  </button>
                );
              })()}

            {groups.map((g) => (
              // biome-ignore lint/a11y/useSemanticElements: ARIA group is the correct child of a listbox for labelled option sections; <fieldset> is a form control
              <div
                className="cmdk-group"
                key={g.group}
                role="group"
                aria-labelledby={`cmdk-group-${g.group}`}
              >
                <p className="cmdk-group-label" id={`cmdk-group-${g.group}`}>
                  {g.group}
                </p>
                {g.items.map((item) => {
                  rowIndex++;
                  const idx = rowIndex;
                  return (
                    <button
                      type="button"
                      key={item.href + item.label}
                      id={`cmdk-option-${idx}`}
                      role="option"
                      aria-selected={selected === idx}
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
          </div>

          {flat.length === 0 && <p className="cmdk-empty">No matches.</p>}
        </div>

        {/* Hidden polite announcers: result counts for the combobox, and each
            completed assistant answer (the thread itself is NOT live — streaming
            token-by-token would re-announce chaotically). */}
        <div className="sr-only" role="status">
          {resultsAnnouncement}
        </div>
        <div className="sr-only" role="status">
          {announcedAnswer}
        </div>
      </div>
    </div>
  );
}
