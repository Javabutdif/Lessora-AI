import mongoose, { Schema, Document } from "mongoose";

export interface IDailyMetric extends Document {
  _id: mongoose.Types.ObjectId;
  reportDate: string;
  windowStart: Date;
  windowEnd: Date;
  totalLogins: number;
  totalRegistrations: number;
  totalLessonPlansGenerated: number;
  lessonPlansBySubject: Record<string, number>;
  uniqueActiveUsers: number;
  summaryText?: string;
  detailedAnalysis?: string;
  emailStatus: "pending" | "sent" | "failed";
  emailSentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const DailyMetricSchema = new Schema<IDailyMetric>(
  {
    reportDate: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    windowStart: {
      type: Date,
      required: true,
    },
    windowEnd: {
      type: Date,
      required: true,
    },
    totalLogins: {
      type: Number,
      default: 0,
    },
    totalRegistrations: {
      type: Number,
      default: 0,
    },
    totalLessonPlansGenerated: {
      type: Number,
      default: 0,
    },
    lessonPlansBySubject: {
      type: Schema.Types.Mixed,
      default: {},
    },
    uniqueActiveUsers: {
      type: Number,
      default: 0,
    },
    summaryText: {
      type: String,
      default: "",
    },
    detailedAnalysis: {
      type: String,
      default: "",
    },
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    emailSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

let DailyMetricModel = mongoose.models.DailyMetric as mongoose.Model<IDailyMetric> | undefined;
if (!DailyMetricModel) {
  DailyMetricModel = mongoose.model<IDailyMetric>("DailyMetric", DailyMetricSchema);
}
export const DailyMetric = DailyMetricModel;
