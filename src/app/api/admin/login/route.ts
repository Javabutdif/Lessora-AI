import { NextRequest, NextResponse } from "next/server";
import { connectionReady } from "@/lib/db";
import { loginSchema } from "@/lib/services/admin-auth.service";
import { loginAdmin } from "@/lib/services/admin-auth.service";
import { checkLimit } from "@/lib/middleware/rate-limiter";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function POST(request: NextRequest) {
  try {
    await connectionReady;
    const rateLimit = await checkLimit(request, {
      bucket: "admin-login",
      limit: 5,
      message: "Too many login attempts. Try again in a minute.",
    });
    if (rateLimit) return rateLimit;

    const input = loginSchema.parse(await request.json());
    const { token, user } = await loginAdmin(input);

    // The token only travels in the HttpOnly cookie; client JS never sees it
    const response = NextResponse.json({ data: { user }, error: null });
    response.cookies.set("lessora-admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });
    return response;
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
