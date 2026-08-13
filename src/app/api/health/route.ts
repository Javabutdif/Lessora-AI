import { NextResponse } from "next/server";
import { isConnected as dbConnected } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongo: dbConnected ? "connected" : "disconnected",
  });
}
