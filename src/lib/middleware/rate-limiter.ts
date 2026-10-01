import { NextRequest, NextResponse } from "next/server";
import { RateLimit } from "../schemas/rate-limit.schema";

const IP_RATE_LIMIT = 20;
const SESSION_RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

type RateLimitOptions = {
  bucket: string;
  limit: number;
  windowMs?: number;
  message?: string;
};

export function getSessionId(request: NextRequest): string | null {
  return request.headers.get("x-session-token") as string | null;
}

// Vercel sets x-real-ip and overwrites x-forwarded-for, so neither can be spoofed by the client there.
export function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

function tooManyRequests(message: string, retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { data: null, error: { code: "RATE_LIMITED", message } },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}

async function hitWindow(key: string, windowMs: number): Promise<{ count: number; resetInSeconds: number }> {
  const now = Date.now();
  const windowStart = now - (now % windowMs);
  const expiresAt = new Date(windowStart + windowMs);

  const entry = await RateLimit.findOneAndUpdate(
    { key: `${key}:${windowStart}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
    { new: true, upsert: true },
  ).lean();

  return {
    count: entry?.count ?? 1,
    resetInSeconds: Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)),
  };
}

export async function checkLimit(
  request: NextRequest,
  { bucket, limit, windowMs = WINDOW_MS, message = "Too many requests. Please try again shortly." }: RateLimitOptions,
): Promise<NextResponse | null> {
  const ip = getClientIp(request);

  try {
    const { count, resetInSeconds } = await hitWindow(`${bucket}:ip:${ip}`, windowMs);
    if (count > limit) {
      console.warn(`[rate-limit] ${bucket} limit hit for ip ${ip}`);
      return tooManyRequests(message, resetInSeconds);
    }
    return null;
  } catch (error) {
    // Fail open: a rate limit store hiccup should not block legitimate teachers
    console.error(`[rate-limit] ${bucket} check failed:`, error);
    return null;
  }
}

export async function checkRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const ipLimit = await checkLimit(request, { bucket: "ai", limit: IP_RATE_LIMIT });
  if (ipLimit) return ipLimit;

  const sessionId = getSessionId(request);
  if (!sessionId) return null;

  try {
    const { count, resetInSeconds } = await hitWindow(`ai:session:${sessionId}`, WINDOW_MS);
    if (count > SESSION_RATE_LIMIT) {
      console.warn("[rate-limit] ai session limit hit");
      return tooManyRequests("AI requests limit exceeded. Try again in a minute.", resetInSeconds);
    }
  } catch (error) {
    console.error("[rate-limit] ai session check failed:", error);
  }

  return null;
}
