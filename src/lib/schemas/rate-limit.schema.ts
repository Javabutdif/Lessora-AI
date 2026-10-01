import mongoose, { Schema, Document } from "mongoose";

/**
 * Fixed-window rate limit counter
 * - Shared by every serverless instance (in-memory counters are per-instance on Vercel)
 * - One document per bucket + identifier + window, removed by the TTL index after the window
 */

export interface IRateLimit extends Document {
  key: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

let RateLimitModel = mongoose.models.RateLimit as mongoose.Model<IRateLimit> | undefined;
if (!RateLimitModel) {
  RateLimitModel = mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
}
export const RateLimit = RateLimitModel;
