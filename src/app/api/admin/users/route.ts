import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "@/middleware";
import { handleApiError } from "@/lib/middleware/error-handler";
import { getAllUsers } from "@/lib/services/admin-users.service";

export async function GET(request: NextRequest) {
  try {
    let user;
    try {
      user = authenticateToken(request);
    } catch {
      return NextResponse.json(
        { data: null, error: { code: "UNAUTHORIZED", message: "Invalid or expired session" } },
        { status: 401 },
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { data: null, error: { code: "FORBIDDEN", message: "Admin access is required" } },
        { status: 403 },
      );
    }

    const users = await getAllUsers();
    return NextResponse.json({ data: users, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
