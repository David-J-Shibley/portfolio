/**
 * Simple in-memory sliding-window rate limiter for chat API.
 * Resets on process restart; for multi-instance production use Redis etc.
 */

const WINDOW_MS = Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS ?? 60_000);
const MAX_REQUESTS = Number(process.env.CHAT_RATE_LIMIT_MAX ?? 24);

const buckets = new Map<string, number[]>();

export class ChatRateLimitError extends Error {
  constructor() {
    super("CHAT_RATE_LIMIT_EXCEEDED");
    this.name = "ChatRateLimitError";
  }
}

function pruneAndCount(timestamps: number[], now: number): number[] {
  const cutoff = now - WINDOW_MS;
  return timestamps.filter((t) => t > cutoff);
}

export function consumeChatRateToken(clientKey: string): void {
  const now = Date.now();
  const prev = buckets.get(clientKey) ?? [];
  const next = pruneAndCount(prev, now);
  if (next.length >= MAX_REQUESTS) {
    throw new ChatRateLimitError();
  }
  next.push(now);
  buckets.set(clientKey, next);
}

/** Prefer forwarded IP when behind a proxy (Docker / ALB / Vercel). */
export function getClientKeyFromIncoming(
  headers: NodeJS.Dict<string | string[] | undefined>,
  remoteAddress?: string | null,
): string {
  const xff = headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = headers["x-real-ip"];
  if (typeof xri === "string" && xri.length > 0) return xri.trim();
  if (remoteAddress && remoteAddress.length > 0) return remoteAddress;
  return "unknown";
}
