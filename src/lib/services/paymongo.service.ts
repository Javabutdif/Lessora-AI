import crypto from "crypto";

type PaymongoCheckoutSessionResponse = {
  data?: {
    id: string;
    attributes?: {
      checkout_url?: string;
      reference_number?: string;
    };
  };
};

type CreateCheckoutSessionArgs = {
  amount: number;
  referenceNumber: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

function getPaymongoBaseUrl() {
  return process.env.PAYMONGO_API_BASE_URL || "https://api.paymongo.com";
}

function getPaymongoSecretKey() {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  if (!secretKey) {
    throw new Error("PAYMONGO_SECRET_KEY is not configured");
  }

  return secretKey;
}

function encodeBasicAuth(secretKey: string) {
  return Buffer.from(`${secretKey}:`).toString("base64");
}

export function createSupportDonationReference() {
  return `DON-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function createPaymongoCheckoutSession({
  amount,
  referenceNumber,
  successUrl,
  cancelUrl,
  metadata = {},
}: CreateCheckoutSessionArgs) {
  const response = await fetch(
    `${getPaymongoBaseUrl()}/v2/checkout_sessions`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodeBasicAuth(getPaymongoSecretKey())}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [
              {
                name: "Lessora AI Support Donation",
                amount,
                currency: "PHP",
                quantity: 1,
              },
            ],
            payment_method_types: ["qrph"],
            success_url: successUrl,
            cancel_url: cancelUrl,
            reference_number: referenceNumber,
            send_email_receipt: true,
            metadata,
          },
        },
      }),
    },
  );

  const payload = (await response.json()) as PaymongoCheckoutSessionResponse & {
    errors?: Array<{ detail?: string; title?: string }>;
  };

  if (!response.ok) {
    const detail =
      payload.errors?.[0]?.detail ||
      payload.errors?.[0]?.title ||
      "Unable to create Paymongo checkout session";
    throw new Error(detail);
  }

  const checkoutUrl = payload.data?.attributes?.checkout_url;
  const sessionId = payload.data?.id;

  if (!checkoutUrl || !sessionId) {
    throw new Error("Paymongo checkout session response was incomplete");
  }

  return {
    checkoutUrl,
    checkoutSessionId: sessionId,
  };
}
