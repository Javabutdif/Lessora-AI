import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { loginAdmin } from "@/lib/services/admin-auth.service";
import { handleApiError } from "@/lib/middleware/error-handler";
import { authenticateToken } from "@/middleware";

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

export async function DELETE(request: NextRequest) {
  try {
    authenticateToken(request);
    const response = NextResponse.json({ data: { success: true }, error: null });
    response.cookies.delete("lessora-admin-token");
    return response;
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
