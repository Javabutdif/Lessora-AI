import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/services/admin-auth.service";
import { loginAdmin } from "@/lib/services/admin-auth.service";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function POST(request: NextRequest) {
  try {
    const input = loginSchema.parse(await request.json());
    const adminSession = await loginAdmin(input);

    const response = NextResponse.json({ data: adminSession, error: null });
    response.cookies.set("lessora-admin-token", adminSession.token, {
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
