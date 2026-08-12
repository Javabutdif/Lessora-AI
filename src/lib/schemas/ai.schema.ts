import { z } from "zod";

const durationSchema = z.coerce
  .number()
  .int("Duration must be a whole number of minutes")
  .min(5, "Duration must be at least 5 minutes")
  .max(600, "Duration must be 600 minutes or less");

export const generateLessonPlanSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subject: z.string().min(2, "Subject is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  duration: durationSchema,
  numberOfSessions: z.coerce
    .number()
    .int("Number of sessions must be a whole number")
    .min(1, "At least one session is required")
    .max(20, "Number of sessions must be 20 or less")
    .default(1),
  userDraftText: z.string().max(12000).optional(),
  language: z.string().min(2).max(50).default("english"),
  activityPreferences: z.array(z.string()).optional().default([]),
  activityPreferenceNotes: z.string().max(200).optional(),
  templateNotes: z.string().max(4000).optional(),
  templateId: z
    .enum([
      "lessora-ai",
      "deped-semi-detailed",
      "detailed-lesson-plan",
      "daily-lesson-log",
      "matatag",
    ])
    .default("lessora-ai"),
});

export const refineLessonPlanSchema = z.object({
  lessonPlanId: z.string().min(1, "Lesson plan id is required"),
  selectedSections: z
    .array(z.string().min(1))
    .min(1, "Select at least one section to refine"),
  refinementRequest: z.string().min(3, "Refinement request is required"),
});

export const lessonPlanDocumentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    text: z.string(),
  }),
  z.object({
    type: z.literal("paragraph"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("list"),
    style: z.union([z.literal("bullet"), z.literal("numbered")]),
    items: z.array(z.string()),
  }),
]);

export const lessonPlanDocumentSchema = z.object({
  type: z.literal("lesson_plan_document"),
  format: z.literal("json"),
  version: z.literal(1),
  title: z.string().min(1, "Document title is required"),
  blocks: z.array(lessonPlanDocumentBlockSchema).min(1),
  exportTargets: z.array(z.string()).default(["doc"]),
});

export type GenerateLessonPlanPayload = z.infer<
  typeof generateLessonPlanSchema
>;
export type RefineLessonPlanPayload = z.infer<typeof refineLessonPlanSchema>;
export type LessonPlanDocumentPayload = z.infer<
  typeof lessonPlanDocumentSchema
>;
