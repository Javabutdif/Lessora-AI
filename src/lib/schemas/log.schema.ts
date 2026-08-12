import mongoose, { Schema, Document, Types } from "mongoose";

export type LogEventType =
  | "user_login"
  | "user_registration"
  | "lesson_plan_generated"
  | "lesson_plan_refined";

export interface ILog extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: Types.ObjectId | null;
  eventType: LogEventType;
  subject?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const LogSchema = new Schema<ILog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "user_login",
        "user_registration",
        "lesson_plan_generated",
        "lesson_plan_refined",
      ],
      index: true,
    },
    subject: {
      type: String,
      default: "",
      trim: true,
      index: true,
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

LogSchema.index({ eventType: 1, createdAt: -1 });
LogSchema.index({ userId: 1, createdAt: -1 });

let LogEntryModel = mongoose.models.LogEntry as mongoose.Model<ILog> | undefined;
if (!LogEntryModel) {
  LogEntryModel = mongoose.model<ILog>("LogEntry", LogSchema);
}
export const LogEntry = LogEntryModel;
