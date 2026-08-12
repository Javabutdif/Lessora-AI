import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Session } from "../schemas/session.schema";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type AnonymousSession = {
  _id: string;
  sessionId: string;
  ip: string;
  aiResponseCredits: number;
};

type AuthTokenPayload = {
  user?: AuthenticatedUser;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL: JWT_SECRET environment variable is not set.");
    process.exit(1);
  }
  return secret;
}

export function authenticateToken(request: NextRequest): AuthenticatedUser {
  const authHeader = request.headers.get("authorization");
  const cookieToken = request.cookies.get("lessora-admin-token")?.value;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken;

  if (!token) throw new Error("Missing token");

  const payload = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  if (!payload.user?.id) throw new Error("Invalid token payload");

  return payload.user;
}

export async function authenticateSession(request: NextRequest): Promise<AnonymousSession | null> {
  const sessionId = request.headers.get("x-session-token") as string | undefined;
  if (!sessionId) return null;

  const session = await Session.findOne({ sessionId }).lean();
  if (!session) return null;

  await Session.updateOne({ _id: session._id }, { $set: { lastActivityAt: new Date() } });

  return {
    _id: session._id.toString(),
    sessionId: session.sessionId,
    ip: session.ip || "",
    aiResponseCredits: session.aiResponseCredits,
  };
}

export async function requireAuthOrSession(
  request: NextRequest,
): Promise<{ user: AuthenticatedUser; isAnonymous: false } | { session: AnonymousSession; isAnonymous: true } | null> {
  try {
    const user = authenticateToken(request);
    return { user, isAnonymous: false };
  } catch {
    // fall through to session
  }

  const session = await authenticateSession(request);
  if (!session) return null;

  return { session, isAnonymous: true };
}

export function requireAdmin(request: NextRequest): AuthenticatedUser | NextResponse {
  try {
    const user = authenticateToken(request);
    if (user.role !== "admin") {
      return NextResponse.json(
        { data: null, error: { code: "FORBIDDEN", message: "Admin access is required" } },
        { status: 403 },
      );
    }
    return user;
  } catch {
    return NextResponse.json(
      { data: null, error: { code: "UNAUTHORIZED", message: "Invalid or expired session" } },
      { status: 401 },
    );
  }
}

export { handleApiError } from "./error-handler";
