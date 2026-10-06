import { NextResponse } from "next/server";
import { systemPrompt } from "@/content/generated/knowledge";
import { ask as askConfig, site } from "@/content/site";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { activityAsKnowledge, getGitHubActivity } from "@/lib/github-activity";

/**
 * The "Ask about me" endpoint.
 *
 * Written against a plain OpenAI-compatible chat API with `fetch` — no SDK, no
 * LangChain. Provider is three environment variables, so moving off Qualcomm
 * Cloud AI 100 is a config change, not a rewrite.
 *
 * Failure is never an error page: every refusal returns `{ fallback: true }`
 * and the box shows its prewritten answers instead. docs/DESIGN.md — the hero
 * must never look broken.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUESTION_CHARS = askConfig.maxLength;
const MAX_TOKENS = 350;
const TEMPERATURE = 0.2;
/** Keep the last 4 turns of the conversation only. */
const MAX_HISTORY_TURNS = 4;
const UPSTREAM_TIMEOUT_MS = 20_000;
/** Longest wait for the next chunk once streaming, and for the whole answer. */
const IDLE_TIMEOUT_MS = 15_000;
const TOTAL_TIMEOUT_MS = 40_000;

const TIMED_OUT = Symbol("timed-out");

/** Races a read against a timer. Abort signals do not reliably break a stalled read. */
function readWithin<T>(read: Promise<T>, ms: number): Promise<T | typeof TIMED_OUT> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<typeof TIMED_OUT>((resolve) => {
    timer = setTimeout(() => resolve(TIMED_OUT), ms);
  });
  return Promise.race([read, timeout]).finally(() => clearTimeout(timer));
}

type Turn = { role: "user" | "assistant"; content: string };

function fallback(reason: string, status = 200) {
  return NextResponse.json({ fallback: true, reason }, { status });
}

/** Only this site may call the endpoint. */
function originAllowed(request: Request): boolean {
  const allowed = new Set([process.env.SITE_ORIGIN ?? site.url, "https://www.aayushswami.com"]);
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }

  const origin = request.headers.get("origin");
  if (origin) return allowed.has(origin);

  // Some browsers omit Origin on same-origin POSTs; fall back to Referer.
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return allowed.has(new URL(referer).origin);
    } catch {
      return false;
    }
  }
  return false;
}

function parseTurns(value: unknown): Turn[] {
  if (!Array.isArray(value)) return [];
  const turns: Turn[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string" || content.length === 0) continue;
    turns.push({ role, content: content.slice(0, 2000) });
  }
  return turns.slice(-MAX_HISTORY_TURNS * 2);
}

export async function POST(request: Request) {
  if (!originAllowed(request)) return fallback("origin", 403);

  const baseUrl = process.env.AI_BASE_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!baseUrl || !apiKey || !model) return fallback("not-configured");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fallback("bad-request", 400);
  }

  const { question, history } = (body ?? {}) as { question?: unknown; history?: unknown };
  if (typeof question !== "string") return fallback("bad-request", 400);

  const trimmed = question.trim();
  if (trimmed.length === 0) return fallback("bad-request", 400);
  if (trimmed.length > MAX_QUESTION_CHARS) return fallback("too-long", 400);

  const verdict = await checkRateLimit(clientIp(request.headers));
  if (!verdict.ok) {
    return NextResponse.json(
      { fallback: true, reason: verdict.reason },
      { status: 429, headers: { "Retry-After": String(verdict.retryAfter) } },
    );
  }

  // Recent GitHub activity rides along as extra knowledge. It comes from the
  // hourly cache, so it adds no GitHub or model calls to a normal request.
  const activity = activityAsKnowledge(await getGitHubActivity().catch(() => []));
  const system = activity
    ? systemPrompt.replace("</knowledge>", `\n${activity}\n</knowledge>`)
    : systemPrompt;

  const messages = [
    { role: "system", content: system },
    ...parseTurns(history),
    // The question is data. The system prompt already tells the model to
    // ignore instructions inside it; wrapping it keeps the boundary obvious.
    { role: "user", content: trimmed },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      }),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch {
    clearTimeout(timeout);
    return fallback("upstream-unreachable");
  }

  if (!upstream.ok || !upstream.body) {
    clearTimeout(timeout);
    return fallback(`upstream-${upstream.status}`);
  }

  // Re-shape the provider's SSE into a plain text stream. The client only ever
  // sees answer text, so swapping providers cannot change the wire format.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = upstream.body.getReader();
  const parseSse = createSseParser();
  const startedAt = Date.now();
  let closed = false;

  const finish = (controllerOut: ReadableStreamDefaultController<Uint8Array>) => {
    if (closed) return;
    closed = true;
    clearTimeout(timeout);
    controllerOut.close();
    void reader.cancel().catch(() => undefined);
  };

  const stream = new ReadableStream<Uint8Array>({
    async pull(controllerOut) {
      try {
        const budget = Math.min(IDLE_TIMEOUT_MS, TOTAL_TIMEOUT_MS - (Date.now() - startedAt));
        const result = await readWithin(reader.read(), Math.max(budget, 0));
        if (result === TIMED_OUT || result.done) {
          finish(controllerOut);
          return;
        }
        const { pieces, done } = parseSse(decoder.decode(result.value, { stream: true }));
        for (const piece of pieces) controllerOut.enqueue(encoder.encode(piece));
        // Close on the end-of-answer signal (finish_reason or [DONE]), not on
        // EOF: inside a route handler the upstream body does not always end
        // when the provider is done.
        if (done) finish(controllerOut);
      } catch {
        finish(controllerOut);
      }
    },
    cancel() {
      clearTimeout(timeout);
      void reader.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

/**
 * SSE frames can split across reads, so the parser keeps a tail. It is built
 * per request — module-level state would mix two visitors' streams together
 * whenever the same instance serves both at once.
 */
function createSseParser() {
  let tail = "";

  return function parse(text: string): { pieces: string[]; done: boolean } {
    const out: string[] = [];
    const lines = (tail + text).split("\n");
    tail = lines.pop() ?? "";
    // A final frame can arrive without its trailing newline.
    if (tail.trim() === "data: [DONE]") {
      lines.push(tail);
      tail = "";
    }

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") {
        tail = "";
        return { pieces: out, done: true };
      }
      try {
        const parsed = JSON.parse(payload) as {
          choices?: { delta?: { content?: string }; text?: string; finish_reason?: string | null }[];
        };
        const choice = parsed.choices?.[0];
        const piece = choice?.delta?.content ?? choice?.text;
        if (piece) out.push(piece);
        if (choice?.finish_reason) {
          tail = "";
          return { pieces: out, done: true };
        }
      } catch {
        // A partial frame; the tail will pick it up on the next read.
      }
    }
    return { pieces: out, done: false };
  };
}
