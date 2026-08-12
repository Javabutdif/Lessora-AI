import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, handleApiError } from "@/lib/middleware/auth-or-session";
import { getDashboardMetrics } from "@/lib/services/admin.service";

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
