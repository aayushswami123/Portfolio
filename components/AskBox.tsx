"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ask, fallbackAnswers, site } from "@/content/site";

/**
 * The one bold element on the page (docs/DESIGN.md).
 *
 * A precise input field, not a chat app: no bubbles, no avatars, no typing
 * dots. The answer streams in below as plain body text, and a thin Accent line
 * grows under the input while it streams.
 *
 * Every failure path lands in `fallback` — the hero must never look broken.
 */

type Turn = { role: "user" | "assistant"; content: string };

type State =
  | { kind: "empty" }
  | { kind: "loading"; question: string }
  | { kind: "answering"; question: string; text: string }
  | { kind: "answered"; question: string; text: string }
  | { kind: "fallback"; question: string | null; reason: string };

const REASON_NOTE: Record<string, string> = {
  "ip-hour": "You've asked a few questions in a row. Here are some quick answers meanwhile:",
  "ip-day": "That's the questions for today. Here are some quick answers:",
  "global-day": "The assistant has hit its daily budget. Here are some quick answers:",
};

const DEFAULT_NOTE = "The assistant is taking a break. Here are quick answers:";

/** Turn the model's "Read more: /path" closing line into a real link. */
function splitAnswer(text: string): { body: string; paths: string[] } {
  const paths: string[] = [];
  const body = text
    .replace(/Read more:\s*([^\s.,;]+)/gi, (_match, path: string) => {
      // Only real pages: the model sometimes invents a plausible-looking path.
      if (path in PATH_LABELS) paths.push(path);
      return "";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { body, paths: [...new Set(paths)].slice(0, 2) };
}

const PATH_LABELS: Record<string, string> = {
  "/#work": "Selected work",
  "/#hackathons": "Hackathons",
  "/#experience": "Experience",
  "/#contact": "Contact",
  "/resume": "Resume",
  "/work/agentic-trading": "Agentic trading case study",
  "/work/crdt-engine": "Collaborative editing case study",
  "/work/nestulabs-ai-visibility": "NestuLabs case study",
};

export function AskBox() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>({ kind: "empty" });
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const historyRef = useRef<Turn[]>([]);

  // DESIGN.md: `/` focuses the box, Esc clears it.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const submit = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (trimmed.length === 0 || trimmed.length > ask.maxLength) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ kind: "loading", question: trimmed });

    let response: Response;
    try {
      response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, history: historyRef.current }),
        signal: controller.signal,
      });
    } catch {
      if (!controller.signal.aborted) {
        setState({ kind: "fallback", question: trimmed, reason: "network" });
      }
      return;
    }

    const isStream = response.headers.get("content-type")?.startsWith("text/plain");
    if (!response.ok || !response.body || !isStream) {
      let reason = "unavailable";
      try {
        const payload = (await response.json()) as { reason?: string };
        if (payload.reason) reason = payload.reason;
      } catch {
        // Non-JSON error body; the generic note is right.
      }
      setState({ kind: "fallback", question: trimmed, reason });
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = "";

    try {
      for (;;) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        text += decoder.decode(chunk, { stream: true });
        setState({ kind: "answering", question: trimmed, text });
      }
    } catch {
      if (controller.signal.aborted) return;
      if (text.length === 0) {
        setState({ kind: "fallback", question: trimmed, reason: "interrupted" });
        return;
      }
    }

    if (controller.signal.aborted) return;

    if (text.trim().length === 0) {
      setState({ kind: "fallback", question: trimmed, reason: "empty" });
      return;
    }

    const turns: Turn[] = [
      ...historyRef.current,
      { role: "user", content: trimmed },
      { role: "assistant", content: text },
    ];
    historyRef.current = turns.slice(-8);

    setState({ kind: "answered", question: trimmed, text });
  }, []);

  const busy = state.kind === "loading" || state.kind === "answering";

  return (
    // One Card panel holds the box, its suggestions, the answer and the note,
    // so the hero's bold element reads as a single object. Inside it, only the
    // input carries a border.
    <div className="panel hover:border-rule">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(value);
        }}
      >
        <label htmlFor="ask-input" className="block text-base font-semibold text-ink">
          Ask about my work
        </label>
        <div className="mt-3 flex gap-2">
          <div className="relative min-w-0 flex-1">
            <input
              id="ask-input"
              ref={inputRef}
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setValue("");
                  setState({ kind: "empty" });
                  abortRef.current?.abort();
                }
              }}
              placeholder={ask.placeholder}
              maxLength={ask.maxLength}
              autoComplete="off"
              enterKeyHint="send"
              aria-describedby="ask-note"
              className="h-12 w-full rounded-btn border border-rule bg-card px-4 text-base text-ink placeholder:text-graphite focus:border-accent focus:outline-none focus-visible:outline-none"
            />
            {/* An Accent line grows under the input while the answer streams. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-2 -bottom-px h-0.5 overflow-hidden rounded-full"
            >
              {busy ? <div className="ask-progress h-full w-full bg-accent" /> : null}
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className={`btn btn-primary h-12 shrink-0 px-5 ${busy ? "cursor-wait opacity-60" : ""}`}
          >
            {busy ? "Thinking" : ask.button}
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-col items-start gap-y-2">
        {ask.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setValue(suggestion);
              void submit(suggestion);
            }}
            className="text-button"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div aria-live="polite" aria-atomic="false">
        {state.kind === "answering" || state.kind === "answered" ? (
          <Answer text={state.text} streaming={state.kind === "answering"} />
        ) : null}
        {state.kind === "fallback" ? (
          <Fallback reason={state.reason} question={state.question} />
        ) : null}
      </div>

      <p id="ask-note" className="mt-5 text-xs text-graphite">
        {ask.note}
      </p>
    </div>
  );
}

function Answer({ text, streaming }: { text: string; streaming: boolean }) {
  const { body, paths } = splitAnswer(text);
  return (
    <div className="well mt-5 p-4">
      <p className="max-w-measure whitespace-pre-wrap text-base text-ink">
        {body}
      </p>
      {!streaming && paths.length > 0 ? (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {paths.map((path) => (
            <Link key={path} href={path} className="link">
              {PATH_LABELS[path] ?? path}
            </Link>
          ))}
        </p>
      ) : null}
    </div>
  );
}

function Fallback({ reason, question }: { reason: string; question: string | null }) {
  // The answer to the question just asked, if there is one, comes first.
  const answers = [...fallbackAnswers].sort(
    (a, b) => Number(b.question === question) - Number(a.question === question),
  );
  return (
    <div className="well mt-5 p-4">
      <p className="max-w-measure text-base text-ink">{REASON_NOTE[reason] ?? DEFAULT_NOTE}</p>
      <dl className="mt-4 space-y-4">
        {answers.map((item) => (
          <div key={item.question}>
            <dt className="text-sm font-medium text-ink">{item.question}</dt>
            <dd className="mt-1 max-w-measure text-sm text-graphite">
              {item.answer}{" "}
              <Link href={item.link.href} className="link">
                {item.link.label}
              </Link>
            </dd>
          </div>
        ))}
      </dl>
      <a href={`mailto:${site.email}`} className="btn btn-primary mt-5">
        Email me
      </a>
    </div>
  );
}
