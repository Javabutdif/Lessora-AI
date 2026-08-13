import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "@/middleware";
import { handleApiError } from "@/lib/middleware/error-handler";
import { getDashboardMetrics } from "@/lib/services/admin.service";

function requireAdmin(request: NextRequest): ReturnType<typeof authenticateToken> | NextResponse {
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

export async function GET(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    if (admin instanceof NextResponse) return admin;

    const metrics = await getDashboardMetrics();
    return NextResponse.json({ success: true, data: metrics, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
