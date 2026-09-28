import { NextResponse } from "next/server";
import { systemPrompt } from "@/content/generated/knowledge";
import { ask as askConfig, site } from "@/content/site";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

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

  const messages = [
    { role: "system", content: systemPrompt },
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

  const stream = new ReadableStream<Uint8Array>({
    async pull(controllerOut) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          clearTimeout(timeout);
          controllerOut.close();
          return;
        }
        for (const chunk of parseSse(decoder.decode(value, { stream: true }))) {
          controllerOut.enqueue(encoder.encode(chunk));
        }
      } catch {
        clearTimeout(timeout);
        controllerOut.close();
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

  return function parse(text: string): string[] {
    const out: string[] = [];
    const lines = (tail + text).split("\n");
    tail = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") {
        tail = "";
        continue;
      }
      try {
        const parsed = JSON.parse(payload) as {
          choices?: { delta?: { content?: string }; text?: string }[];
        };
        const piece = parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.text;
        if (piece) out.push(piece);
      } catch {
        // A partial frame; the tail will pick it up on the next read.
      }
    }
    return out;
  };
}
