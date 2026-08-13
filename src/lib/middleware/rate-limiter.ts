import { NextRequest, NextResponse } from "next/server";

const IP_RATE_LIMIT = 20;
const SESSION_RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

const ipWindow = new Map<string, { count: number; resetAt: number }>();
const sessionWindow = new Map<string, { count: number; resetAt: number }>();

export function getSessionId(request: NextRequest): string | null {
  return request.headers.get("x-session-token") as string | null;
}

export function checkRateLimit(request: NextRequest): NextResponse | null {
  const sessionId = getSessionId(request);
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") ?? "unknown";

  const now = Date.now();

  // Per-IP check
  let ipEntry = ipWindow.get(ip);
  if (!ipEntry || now > ipEntry.resetAt) {
    ipEntry = { count: 0, resetAt: now + WINDOW_MS };
    ipWindow.set(ip, ipEntry);
  }
  ipEntry.count++;
  if (ipEntry.count > IP_RATE_LIMIT) {
    return NextResponse.json(
      { data: null, error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } },
      { status: 429 },
    );
  }

  // Per-sessionId AI check
  if (sessionId) {
    let sessionEntry = sessionWindow.get(sessionId);
    if (!sessionEntry || now > sessionEntry.resetAt) {
      sessionEntry = { count: 0, resetAt: now + WINDOW_MS };
      sessionWindow.set(sessionId, sessionEntry);
    }
    sessionEntry.count++;
    if (sessionEntry.count > SESSION_RATE_LIMIT) {
      return NextResponse.json(
        { data: null, error: { code: "RATE_LIMITED", message: "AI requests limit exceeded. Try again in a minute." } },
        { status: 429 },
      );
    }
  }

  return null;
}
