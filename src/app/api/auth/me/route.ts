import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "@/middleware";

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    return NextResponse.json({ data: { user }, error: null });
  } catch {
    return NextResponse.json({ data: null, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
  }
}
