import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export type SupportDonationStatus =
  | "pending"
  | "paid"
  | "failed"
  | "canceled";

export interface ISupportDonation extends Document {
  referenceNumber: string;
  amount: number;
  currency: string;
  status: SupportDonationStatus;
  checkoutSessionId?: string;
  paymentId?: string;
  tierId?: string;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const SupportDonationSchema = new Schema<ISupportDonation>(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      required: true,
      default: "PHP",
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "canceled"],
      default: "pending",
      index: true,
    },
    checkoutSessionId: {
      type: String,
      default: null,
      index: true,
    },
    paymentId: {
      type: String,
      default: null,
      index: true,
    },
    tierId: {
      type: String,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

let SupportDonationModel = mongoose.models.SupportDonation as mongoose.Model<ISupportDonation> | undefined;
if (!SupportDonationModel) {
  SupportDonationModel = mongoose.model<ISupportDonation>("SupportDonation", SupportDonationSchema);
}
export const SupportDonation = SupportDonationModel;

export const supportDonationCheckoutSchema = z.object({
  amount: z.number().int().positive(),
  tierId: z.string().optional(),
});

export const supportDonationWebhookSchema = z.object({
  event_type: z.string(),
  data: z.object({
    type: z.string(),
    resource: z.string().optional(),
    data: z
      .object({
        id: z.string(),
        attributes: z
          .object({
            reference_number: z.string().optional(),
            metadata: z.record(z.string()).optional(),
            payments: z
              .array(
                z.object({
                  id: z.string(),
                  attributes: z
                    .object({
                      status: z.string().optional(),
                      amount: z.number().optional(),
                      currency: z.string().optional(),
                    })
                    .partial()
                    .passthrough(),
                }),
              )
              .optional(),
          })
          .passthrough(),
      })
      .passthrough(),
  }),
});

export type SupportDonationCheckoutPayload = z.infer<
  typeof supportDonationCheckoutSchema
>;
