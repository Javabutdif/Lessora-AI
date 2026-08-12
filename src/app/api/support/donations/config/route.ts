import { NextResponse } from "next/server";
import { getSupportDonationConfig } from "@/lib/services/support-donation.service";

export async function GET() {
  return NextResponse.json({ data: getSupportDonationConfig(), error: null });
}
