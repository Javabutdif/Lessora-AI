import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectionReady } from "@/lib/db";
import { supportDonationWebhookSchema } from "@/lib/schemas/support-donation.schema";
import { recordPaymongoWebhook } from "@/lib/services/support-donation.service";

function getWebhookSecret(): string | null {
  return process.env.PAYMONGO_WEBHOOK_SECRET || null;
}

function hmacHex(secret: string, value: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqualHex(expected: string, received: string): boolean {
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Supports both PayMongo formats:
// - "t=<timestamp>,te=<test sig>,li=<live sig>" signed over "<t>.<rawBody>"
// - a bare hex HMAC of the raw body
function verifyWebhookSignature(rawBody: string, header: string, secret: string): boolean {
  if (!header) return false;

  if (!header.includes("=")) {
    return safeEqualHex(hmacHex(secret, rawBody), header.trim());
  }

  const parts = new Map(
    header.split(",").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, rest.join("=")] as const;
    }),
  );
  const timestamp = parts.get("t");
  if (!timestamp) return false;

  const expected = hmacHex(secret, `${timestamp}.${rawBody}`);
  return [parts.get("li"), parts.get("te")].some(
    (signature) => Boolean(signature) && safeEqualHex(expected, signature as string),
  );
}

export async function POST(request: NextRequest) {
  const secret = getWebhookSecret();
  if (!secret) {
    // Fail closed: without the secret we cannot tell PayMongo from a forger
    console.error("[webhook] PAYMONGO_WEBHOOK_SECRET not set — rejecting webhook");
    return NextResponse.json(
      { data: null, error: { code: "SERVER_ERROR", message: "Webhook not configured" } },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("paymongo-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    console.warn("[webhook] invalid PayMongo signature");
    return NextResponse.json(
      { data: null, error: { code: "FORBIDDEN", message: "Invalid webhook signature" } },
      { status: 401 },
    );
  }

  try {
    await connectionReady;
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
    console.error("[webhook] failed to process PayMongo webhook:", error);
    return NextResponse.json(
      { data: null, error: { code: "VALIDATION_ERROR", message: "Invalid webhook payload" } },
      { status: 400 },
    );
  }
}
