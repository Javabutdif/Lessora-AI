import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Lesson Plan Schema
 * - Stores lesson plans with draft content and session information
 * - Uses Subset Pattern: main document has overview, details stored separately if needed
 * - Sessions are embedded (bounded array) as they're read together with the plan
 * - Indexed by userId and status for common access patterns
 */

export interface ISession {
  _id?: Types.ObjectId;
  sessionNumber: number;
  title: string;
  duration: number; // in minutes
  objectives: string[];
  content: string;
  activities: string[];
  notes?: string;
  order: number;
}

export interface ILessonPlan extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: Types.ObjectId; // Reference to User (null for anonymous sessions)
  sessionId?: string; // Session ID for anonymous users
  templateId?:
    | "lessora-ai"
    | "deped-semi-detailed"
    | "detailed-lesson-plan"
    | "daily-lesson-log"
    | "matatag";
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  draftText: string;
  sessions: ISession[];
  totalDuration: number; // in minutes, calculated from sessions
  status: "draft" | "published" | "archived";
  tags: string[];
  isPublic: boolean;
  generatedByAI: boolean;
  aiModel?: string; // e.g., 'gpt-4', 'gpt-3.5-turbo'
  aiDocument?: Record<string, unknown>;
  lastGeneratedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: number;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // minutes
    },
    objectives: [
      {
        type: String,
        required: true,
      },
    ],
    content: {
      type: String,
      required: true,
    },
    activities: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: true },
);

const LessonPlanSchema = new Schema<ILessonPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    templateId: {
      type: String,
      enum: [
        "lessora-ai",
        "deped-semi-detailed",
        "detailed-lesson-plan",
        "daily-lesson-log",
        "matatag",
      ],
      default: "lessora-ai",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    subject: {
      type: String,
      required: true,
      index: true,
    },
    gradeLevel: {
      type: String,
      required: true,
      index: true,
    },
    draftText: {
      type: String,
      required: true,
      default: "",
    },
    sessions: [SessionSchema], // Embedded array - read together with plan
    totalDuration: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    generatedByAI: {
      type: Boolean,
      default: false,
    },
    aiModel: {
      type: String,
      default: null,
    },
    aiDocument: {
      type: Schema.Types.Mixed,
      default: null,
    },
    lastGeneratedAt: {
      type: Date,
      default: null,
    },
    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for common queries
LessonPlanSchema.index({ userId: 1, status: 1 }); // User's lesson plans by status
LessonPlanSchema.index({ userId: 1, createdAt: -1 }); // User's recent lesson plans
LessonPlanSchema.index({ subject: 1, gradeLevel: 1, isPublic: 1 }); // Search by subject/grade
LessonPlanSchema.index({ tags: 1, isPublic: 1 }); // Tag-based search

// Partial index for published, public lesson plans only
LessonPlanSchema.index(
  { subject: 1, gradeLevel: 1 },
  { partialFilterExpression: { status: "published", isPublic: true } },
);

// Partial index for browsing public plans
LessonPlanSchema.index(
  { isPublic: 1, createdAt: -1 },
  { partialFilterExpression: { isPublic: true } },
);

let LessonPlanModel = mongoose.models.LessonPlan as mongoose.Model<ILessonPlan> | undefined;

if (!LessonPlanModel) {
  LessonPlanModel = mongoose.model<ILessonPlan>("LessonPlan", LessonPlanSchema);
}

export const LessonPlan = LessonPlanModel;
