import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import "@/lib/db";

type AuthTokenPayload = {
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL: JWT_SECRET environment variable is not set.");
    process.exit(1);
  }
  return secret;
}

export function authenticateToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cookieToken = request.cookies.get("lessora-admin-token")?.value;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken;

  if (!token) {
    throw new Error("Missing token");
  }

  const payload = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;

  if (!payload.user?.id) {
    throw new Error("Invalid token payload");
  }

  return payload.user;
}

const ADMIN_ROUTE_PREFIX = "/admin";

function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith(ADMIN_ROUTE_PREFIX);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const cookieToken = request.cookies.get("lessora-admin-token")?.value;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken;

  if (!token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
    if (!payload.user?.id) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
    if (payload.user.role !== "admin") {
      return NextResponse.json(
        { data: null, error: { code: "FORBIDDEN", message: "Admin access is required" } },
        { status: 403 },
      );
    }
    return NextResponse.next();
  } catch {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|images).*)"],
  runtime: "nodejs",
};
