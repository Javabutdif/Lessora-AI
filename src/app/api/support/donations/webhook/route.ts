import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supportDonationWebhookSchema } from "@/lib/schemas/support-donation.schema";
import { recordPaymongoWebhook } from "@/lib/services/support-donation.service";

function getWebhookSecret(): string | null {
  return process.env.PAYMONGO_WEBHOOK_SECRET ?? null;
}

function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = getWebhookSecret();
  if (!secret) {
    console.warn("[webhook] PAYMONGO_WEBHOOK_SECRET not set — skipping signature verification");
    return true;
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paymongo-signature");

    if (!verifyWebhookSignature(rawBody, signature ?? "")) {
      return NextResponse.json(
        { data: null, error: { code: "FORBIDDEN", message: "Invalid webhook signature" } },
        { status: 401 },
      );
    }

    const payload = supportDonationWebhookSchema.parse(JSON.parse(rawBody));

    if (payload.data.type !== "checkout_session.payment.paid") {
      return NextResponse.json({ data: { received: true, ignored: true }, error: null });
    }

    const session = payload.data.data;
    const referenceNumber = session.attributes?.reference_number;
    const payment = session.attributes?.payments?.[0];
    const paymentStatus = payment?.attributes?.status === "paid" ? "paid" : "failed";

    await recordPaymongoWebhook({
      referenceNumber,
      checkoutSessionId: session.id,
      paymentId: payment?.id,
      status: paymentStatus,
      amount: payment?.attributes?.amount,
      currency: payment?.attributes?.currency || "PHP",
    });

    return NextResponse.json({ data: { received: true }, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: { code: "VALIDATION_ERROR", message: "Invalid webhook payload" } },
      { status: 400 },
    );
  }
}
