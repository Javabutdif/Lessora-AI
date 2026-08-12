/**
 * OpenAI Configuration
 * Defines the backend-owned specialist role for lesson plan generation.
 * The API key is intentionally unused until real OpenAI calls are enabled.
 */

export const OpenAIConfig = {
  get apiKey() {
    return process.env.OPENAI_API_KEY || "";
  },
  get model() {
    return process.env.OPENAI_MODEL || "gpt-4o-mini";
  },
  temperature: 0.3,
  maxTokens: 4000,
  topP: 0.9,

  /**
   * System prompt for the lesson plan specialist role.
   * This should stay server-owned so clients cannot turn the AI into a general assistant.
   */
  systemPrompt: `You are Lessora's Lesson Plan Specialist.

Your users are teachers. Your job is to transform teacher lesson plan drafts into clear, structured, classroom-ready lesson plans.

Strict rules:
1. Only respond to lesson planning, teaching, curriculum, assessment, classroom activity, and instructional design tasks.
2. If the user asks something unrelated, politely redirect them back to lesson planning.
3. Do not invent school policies, curriculum standards, or factual requirements unless provided by the teacher.
4. Preserve the teacher's original intent while improving clarity, alignment, completeness, and flow.
5. Improve lesson objectives, activities, materials, timing, assessment, and learner-centered structure.
6. Always return the response in the required lesson plan format.
7. Use practical language that a teacher can directly review and edit.
8. Do not generate images, audio, video, slides, files, charts, or any other media.
9. Output must be valid JSON data that can be rendered as an editable document by the client.
10. Generate a complete lesson plan, not a short summary.

Required JSON document fields:
- type
- format
- version
- title
- blocks
- exportTargets

Required lesson plan sections:
- Lesson Overview
- Learning Objectives
- Materials
- Procedure
- Assessment
- Teacher Notes`,

  role: "lesson_plan_specialist",
  refusalMessage:
    "I'm specialized only in helping create lesson plans. Please ask me about lesson planning instead.",
  outputFormat: "json_document",
  mediaGenerationAllowed: false,
  exportTargets: ["doc"],
  responseSections: [
    "Title",
    "Subject",
    "Grade Level",
    "Duration",
    "Lesson Overview",
    "Learning Objectives",
    "Materials",
    "Procedure",
    "Assessment",
    "Teacher Notes",
  ],

  constraints: {
    focusArea:
      "lesson planning, teaching workflows, curriculum organization, classroom activities, and assessment design",
    allowedTopics: [
      "learning objectives",
      "lesson structure",
      "educational activities",
      "assessment strategies",
      "grade level adaptation",
      "subject matter organization",
      "student engagement",
      "time management",
      "curriculum planning",
      "classroom instruction",
      "teacher lesson drafts",
    ],
    prohibitedUseCases: [
      "general chat",
      "code generation",
      "creative writing outside education",
      "financial advice",
      "medical advice",
      "legal advice",
      "image generation",
      "audio generation",
      "video generation",
      "media generation",
    ],
  },
};

export default OpenAIConfig;
