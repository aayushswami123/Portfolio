/**
 * Rate limiting for /api/ask.
 *
 * Two backends, picked at runtime:
 *   - Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN are set (durable, shared
 *     across serverless instances) — this is what production should use.
 *   - An in-memory map otherwise, so the endpoint still behaves correctly in
 *     development and on a fresh deploy with no Redis configured.
 *
 * Limits come from docs/ASK-ABOUT-ME.md: 10 questions per IP per hour, 40 per
 * day, and a global cap of 1,000 questions a day. Past the global cap everyone
 * is switched to fallback mode rather than being shown an error.
 */

export const LIMITS = {
  perIpHour: 10,
  perIpDay: 40,
  globalDay: 1000,
} as const;

const HOUR = 60 * 60;
const DAY = 24 * 60 * 60;

export type LimitVerdict =
  | { ok: true }
  | { ok: false; reason: "ip-hour" | "ip-day" | "global-day"; retryAfter: number };

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
export const usingRedis = Boolean(url && token);

/** INCR then EXPIRE on first write. Returns the new count, or null on failure. */
async function redisIncrement(key: string, ttl: number): Promise<number | null> {
  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(ttl), "NX"],
      ]),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    if (!Array.isArray(payload) || payload.length === 0) return null;
    const first = payload[0] as { result?: unknown };
    return typeof first.result === "number" ? first.result : null;
  } catch {
    // A rate limiter that is down must not take the whole endpoint with it.
    return null;
  }
}

const memory = new Map<string, { count: number; expires: number }>();

function memoryIncrement(key: string, ttl: number): number {
  const now = Date.now();
  if (memory.size > 5000) {
    for (const [existing, value] of memory) if (value.expires <= now) memory.delete(existing);
  }
  const current = memory.get(key);
  if (!current || current.expires <= now) {
    memory.set(key, { count: 1, expires: now + ttl * 1000 });
    return 1;
  }
  current.count += 1;
  return current.count;
}

async function bump(key: string, ttl: number): Promise<number> {
  if (usingRedis) {
    const count = await redisIncrement(key, ttl);
    if (count !== null) return count;
  }
  return memoryIncrement(key, ttl);
}

function windowKey(prefix: string, seconds: number): string {
  return `${prefix}:${Math.floor(Date.now() / 1000 / seconds)}`;
}

/**
 * Counts one question against every window. All three are incremented even
 * when the first one already fails, so a client cannot stay under the daily
 * cap by hammering past the hourly one.
 */
export async function checkRateLimit(ip: string): Promise<LimitVerdict> {
  const [hour, day, global] = await Promise.all([
    bump(windowKey(`ask:h:${ip}`, HOUR), HOUR),
    bump(windowKey(`ask:d:${ip}`, DAY), DAY),
    bump(windowKey("ask:global", DAY), DAY),
  ]);

  if (global > LIMITS.globalDay) return { ok: false, reason: "global-day", retryAfter: DAY };
  if (day > LIMITS.perIpDay) return { ok: false, reason: "ip-day", retryAfter: DAY };
  if (hour > LIMITS.perIpHour) return { ok: false, reason: "ip-hour", retryAfter: HOUR };
  return { ok: true };
}

/** Best-effort client IP. Vercel sets x-forwarded-for; the first hop is the client. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}
