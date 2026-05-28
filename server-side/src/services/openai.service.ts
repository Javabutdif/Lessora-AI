/**
 * OpenAI Service
 * Handles lesson plan specialist behavior.
 * Calls OpenAI for structured lesson plan documents and enforces response credits.
 */

import OpenAIConfig from "../config/openai.config";
import { LessonPlan } from "../schemas/lesson.schema";
import { User } from "../schemas/user.schema";

export interface GenerateLessonPlanRequest {
  title: string;
  subject: string;
  gradeLevel: string;
  duration: number;
  numberOfSessions: number;
  userDraftText?: string;
  templateNotes?: string;
}

export type LessonPlanDocumentBlock =
  | {
      type: "heading";
      level: 1 | 2 | 3;
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      style: "bullet" | "numbered";
      items: string[];
    };

export interface LessonPlanDocument {
  type: "lesson_plan_document";
  format: "json";
  version: 1;
  title: string;
  blocks: LessonPlanDocumentBlock[];
  exportTargets: string[];
}

export interface ExportLessonPlanDocumentResponse {
  filename: string;
  mimeType: "application/msword";
  extension: "doc";
  base64: string;
  plainText: string;
}

export interface GenerateLessonPlanResponse {
  success: boolean;
  lessonPlanId: string;
  document: LessonPlanDocument;
  draftText: string;
  sections: {
    title: string;
    subject: string;
    gradeLevel: string;
    duration: string;
    lessonOverview: string;
    learningObjectives: string[];
    materials: string[];
    procedure: string[];
    assessment: string[];
    teacherNotes: string[];
  };
  sessions: Array<{
    sessionNumber: number;
    title: string;
    duration: number;
    objectives: string[];
    content: string;
    activities: string[];
  }>;
  model: string;
  role: string;
  remainingResponses: number;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface LessonPlanHistoryItem {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  totalDuration: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface LessonPlanHistoryDetail extends LessonPlanHistoryItem {
  document: LessonPlanDocument;
  draftText: string;
  model?: string;
}

const lessonPlanningSignals = [
  "lesson",
  "teach",
  "teacher",
  "student",
  "class",
  "grade",
  "subject",
  "objective",
  "activity",
  "assessment",
  "curriculum",
  "learning",
  "materials",
  "rubric",
];

const unrelatedRiskSignals = [
  "financial advice",
  "investment",
  "crypto",
  "medical advice",
  "diagnose",
  "legal advice",
  "lawsuit",
  "write code",
  "debug code",
  "general chat",
];

class OpenAIService {
  async generateLessonPlan(
    request: GenerateLessonPlanRequest,
    userId: string,
  ): Promise<GenerateLessonPlanResponse> {
    console.log(`[OpenAI] Structuring lesson plan: ${request.title}`);
    console.log(`[OpenAI] Using role: ${OpenAIConfig.role}`);

    const scopeCheck = this.validateRequest(
      [
        request.title,
        request.subject,
        request.gradeLevel,
        request.userDraftText,
        request.templateNotes,
      ]
        .filter(Boolean)
        .join(" "),
    );

    if (!scopeCheck.isValid) {
      throw new Error(scopeCheck.reason ?? OpenAIConfig.refusalMessage);
    }

    if (!OpenAIConfig.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const creditedUser = await this.reserveResponseCredit(userId);
    let document: LessonPlanDocument;

    try {
      document = await this.createDocumentWithOpenAI(request);
    } catch (error) {
      await this.refundResponseCredit(userId);
      throw error;
    }

    const sessionDuration = Math.max(
      1,
      Math.floor(request.duration / request.numberOfSessions),
    );
    const sections = this.sectionsFromDocument(request, document);
    const objectives = sections.learningObjectives;

    const sessions = Array.from(
      { length: request.numberOfSessions },
      (_, index) => ({
        sessionNumber: index + 1,
        title:
          request.numberOfSessions === 1
            ? request.title
            : `${request.title} - Session ${index + 1}`,
        duration: sessionDuration,
        objectives,
        content: sections.lessonOverview,
        activities: this.activitiesFromProcedure(sections.procedure),
      }),
    );
    const draftText = this.formatStructuredDraft(sections);
    let savedPlan;

    try {
      savedPlan = await LessonPlan.create({
        userId,
        title: sections.title,
        description: sections.lessonOverview.slice(0, 1000),
        subject: sections.subject,
        gradeLevel: sections.gradeLevel,
        draftText,
        sessions: sessions.map((session, index) => ({
          ...session,
          order: index + 1,
        })),
        totalDuration: request.duration,
        status: "draft",
        tags: [request.subject, request.gradeLevel],
        isPublic: false,
        generatedByAI: true,
        aiModel: OpenAIConfig.model,
        aiDocument: document,
        lastGeneratedAt: new Date(),
      });
    } catch (error) {
      await this.refundResponseCredit(userId);
      throw error;
    }

    return {
      success: true,
      lessonPlanId: savedPlan._id.toString(),
      document,
      draftText,
      sections,
      sessions,
      model: OpenAIConfig.model,
      role: OpenAIConfig.role,
      remainingResponses: creditedUser.aiResponseCredits,
      tokens: {
        prompt: 0,
        completion: 0,
        total: 0,
      },
    };
  }

  async refineLessonPlan(
    currentDraftText: string,
    refinementRequest: string,
    userId: string,
  ): Promise<GenerateLessonPlanResponse> {
    console.log("[OpenAI] Refining lesson plan with specialist role");

    const scopeCheck = this.validateRequest(
      `${currentDraftText} ${refinementRequest}`,
    );

    if (!scopeCheck.isValid) {
      throw new Error(scopeCheck.reason ?? OpenAIConfig.refusalMessage);
    }

    return this.generateLessonPlan({
      title: "Refined Lesson Plan",
      subject: "Teacher-provided subject",
      gradeLevel: "Teacher-provided grade level",
      duration: 60,
      numberOfSessions: 1,
      userDraftText: currentDraftText,
      templateNotes: `Requested refinement: ${refinementRequest}`,
    }, userId);
  }

  async exportLessonPlanDocument(
    document: LessonPlanDocument,
  ): Promise<ExportLessonPlanDocumentResponse> {
    const filename = `${this.slugify(document.title || "lesson-plan")}.doc`;
    const html = this.buildWordCompatibleHtml(document);
    const plainText = this.documentToPlainText(document);

    return {
      filename,
      mimeType: "application/msword",
      extension: "doc",
      base64: Buffer.from(html, "utf8").toString("base64"),
      plainText,
    };
  }

  async listRecentLessonPlans(userId: string): Promise<LessonPlanHistoryItem[]> {
    const plans = await LessonPlan.find({ userId, generatedByAI: true })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("title subject gradeLevel totalDuration createdAt updatedAt")
      .lean();

    return plans.map((plan) => ({
      id: plan._id.toString(),
      title: plan.title,
      subject: plan.subject,
      gradeLevel: plan.gradeLevel,
      totalDuration: plan.totalDuration,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));
  }

  async getLessonPlanById(
    userId: string,
    lessonPlanId: string,
  ): Promise<LessonPlanHistoryDetail> {
    const plan = await LessonPlan.findOne({
      _id: lessonPlanId,
      userId,
      generatedByAI: true,
    }).lean();

    if (!plan || !plan.aiDocument) {
      throw new Error("Lesson plan was not found");
    }

    return {
      id: plan._id.toString(),
      title: plan.title,
      subject: plan.subject,
      gradeLevel: plan.gradeLevel,
      totalDuration: plan.totalDuration,
      updatedAt: plan.updatedAt,
      createdAt: plan.createdAt,
      document: plan.aiDocument as unknown as LessonPlanDocument,
      draftText: plan.draftText,
      model: plan.aiModel ?? undefined,
    };
  }

  validateRequest(request: string): {
    isValid: boolean;
    reason?: string;
  } {
    const lowerRequest = request.toLowerCase();
    const hasLessonPlanningSignal = lessonPlanningSignals.some((keyword) =>
      lowerRequest.includes(keyword),
    );
    const hasUnrelatedRisk = unrelatedRiskSignals.some((keyword) =>
      lowerRequest.includes(keyword),
    );

    if (hasUnrelatedRisk && !hasLessonPlanningSignal) {
      return {
        isValid: false,
        reason: OpenAIConfig.refusalMessage,
      };
    }

    return { isValid: true };
  }

  getConfig() {
    return {
      role: OpenAIConfig.role,
      model: OpenAIConfig.model,
      constraints: OpenAIConfig.constraints,
      focusArea: OpenAIConfig.constraints.focusArea,
      responseSections: OpenAIConfig.responseSections,
      apiIntegrationEnabled: true,
      responseCreditsPerUser: 5,
      outputFormat: OpenAIConfig.outputFormat,
      mediaGenerationAllowed: OpenAIConfig.mediaGenerationAllowed,
      exportTargets: OpenAIConfig.exportTargets,
    };
  }

  private async reserveResponseCredit(userId: string) {
    await User.updateOne(
      { _id: userId, aiResponseCredits: { $exists: false } },
      { $set: { aiResponseCredits: 5 } },
    );

    const user = await User.findOneAndUpdate(
      { _id: userId, aiResponseCredits: { $gt: 0 } },
      { $inc: { aiResponseCredits: -1 } },
      { new: true },
    );

    if (!user) {
      throw new Error("You have no AI responses remaining.");
    }

    return user;
  }

  private async refundResponseCredit(userId: string) {
    await User.updateOne(
      { _id: userId },
      { $inc: { aiResponseCredits: 1 } },
    );
  }

  private async createDocumentWithOpenAI(
    request: GenerateLessonPlanRequest,
  ): Promise<LessonPlanDocument> {
    const requestBody = {
      model: OpenAIConfig.model,
      temperature: OpenAIConfig.temperature,
      max_output_tokens: OpenAIConfig.maxTokens,
      input: [
        {
          role: "system",
          content: OpenAIConfig.systemPrompt,
        },
        {
          role: "user",
          content: this.buildTeacherPrompt(request),
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    };

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OpenAIConfig.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const payload = await response.json();

    if (!response.ok) {
      const message =
        payload?.error?.message || "OpenAI lesson plan generation failed";
      throw new Error(
        `${message}. Check OPENAI_MODEL; this endpoint expects a Responses API model that supports JSON output, such as gpt-4o-mini.`,
      );
    }

    const rawText = this.extractOpenAIText(payload);
    console.log("[OpenAI] Raw lesson plan response preview:", rawText.slice(0, 500));

    const parsed = JSON.parse(rawText);
    const normalizedBlocks = this.normalizeDocumentBlocks(parsed, request);
    this.assertCompleteLessonPlan(normalizedBlocks);

    console.log("[OpenAI] Parsed lesson plan document:", {
      keys: Object.keys(parsed ?? {}),
      blockCount: normalizedBlocks.length,
      title: parsed?.title,
    });

    return {
      ...parsed,
      type: "lesson_plan_document",
      format: "json",
      version: 1,
      title: parsed?.title || request.title,
      blocks: normalizedBlocks,
      exportTargets: OpenAIConfig.exportTargets,
    };
  }

  private buildTeacherPrompt(request: GenerateLessonPlanRequest) {
    return [
      `Topic / Subject: ${request.title}`,
      `Subject: ${request.subject}`,
      `Grade Level: ${request.gradeLevel}`,
      `Duration: ${request.duration} minutes`,
      `Number of Sessions: ${request.numberOfSessions}`,
      request.userDraftText
        ? `Teacher Draft / Specific Goals / Standards: ${request.userDraftText}`
        : "Teacher Draft / Specific Goals / Standards: Not provided",
      request.templateNotes
        ? `Template Notes: ${request.templateNotes}`
        : "Template Notes: Not provided",
      "Return only valid JSON. Do not include markdown, explanation, or media.",
      "Generate a complete classroom-ready lesson plan with every required section.",
      "Do not stop after the overview or objectives.",
      "Minimum detail: 3 learning objectives, 3 materials, 5 procedure steps, 2 assessment methods, and 2 teacher notes.",
      "Use exactly this top-level shape:",
      JSON.stringify({
        type: "lesson_plan_document",
        format: "json",
        version: 1,
        title: "string",
        blocks: [
          { type: "heading", level: 1, text: "Lesson title" },
          { type: "paragraph", text: "Subject: ..." },
          { type: "paragraph", text: "Grade Level: ..." },
          { type: "paragraph", text: "Duration: ..." },
          { type: "heading", level: 2, text: "Lesson Overview" },
          { type: "paragraph", text: "Overview text" },
          {
            type: "heading",
            level: 2,
            text: "Learning Objectives",
          },
          {
            type: "list",
            style: "bullet",
            items: ["objective 1", "objective 2", "objective 3"],
          },
          { type: "heading", level: 2, text: "Materials" },
          {
            type: "list",
            style: "bullet",
            items: ["material 1", "material 2", "material 3"],
          },
          { type: "heading", level: 2, text: "Procedure" },
          {
            type: "list",
            style: "numbered",
            items: [
              "opening activity",
              "direct instruction",
              "guided practice",
              "independent or group activity",
              "closure",
            ],
          },
          { type: "heading", level: 2, text: "Assessment" },
          {
            type: "list",
            style: "bullet",
            items: ["formative assessment", "summative or exit assessment"],
          },
          { type: "heading", level: 2, text: "Teacher Notes" },
          {
            type: "list",
            style: "bullet",
            items: ["differentiation note", "preparation or pacing note"],
          },
        ],
        exportTargets: ["doc"],
      }),
    ].join("\n");
  }

  private extractOpenAIText(payload: any) {
    if (typeof payload.output_text === "string") {
      return payload.output_text;
    }

    const text = payload.output
      ?.flatMap((item: any) => item.content ?? [])
      ?.find((content: any) => content.type === "output_text")?.text;

    if (!text) {
      throw new Error("OpenAI returned an empty lesson plan response");
    }

    return text;
  }

  private normalizeDocumentBlocks(
    parsed: any,
    request: GenerateLessonPlanRequest,
  ): LessonPlanDocumentBlock[] {
    const sourceBlocks = Array.isArray(parsed?.blocks)
      ? parsed.blocks
      : this.blocksFromSectionObject(parsed, request);

    const blocks = sourceBlocks
      .map((block: any) => {
        if (block?.type === "heading") {
          return {
            type: "heading" as const,
            level: block.level === 1 || block.level === 3 ? block.level : 2,
            text: String(block.text || ""),
          };
        }

        if (block?.type === "paragraph") {
          return {
            type: "paragraph" as const,
            text: String(block.text || ""),
          };
        }

        if (block?.type === "list") {
          return {
            type: "list" as const,
            style: block.style === "numbered" ? "numbered" : "bullet",
            items: Array.isArray(block.items)
              ? block.items.map((item: unknown) => String(item))
              : [],
          };
        }

        return null;
      })
      .filter(
        (block: LessonPlanDocumentBlock | null): block is LessonPlanDocumentBlock =>
          block !== null,
      );

    if (!blocks.length) {
      throw new Error("OpenAI returned JSON but no renderable lesson plan blocks.");
    }

    return blocks;
  }

  private assertCompleteLessonPlan(blocks: LessonPlanDocumentBlock[]) {
    const requiredHeadings = [
      "Lesson Overview",
      "Learning Objectives",
      "Materials",
      "Procedure",
      "Assessment",
      "Teacher Notes",
    ];

    const headings = blocks
      .filter((block) => block.type === "heading")
      .map((block) => block.text.toLowerCase());

    const missingHeadings = requiredHeadings.filter(
      (heading) => !headings.includes(heading.toLowerCase()),
    );

    if (missingHeadings.length) {
      throw new Error(
        `OpenAI returned an incomplete lesson plan. Missing sections: ${missingHeadings.join(", ")}.`,
      );
    }
  }

  private blocksFromSectionObject(
    parsed: any,
    request: GenerateLessonPlanRequest,
  ): any[] {
    const sections = parsed?.sections || parsed?.lessonPlan || parsed;
    const title = parsed?.title || sections?.title || request.title;
    const overview =
      sections?.lessonOverview ||
      sections?.overview ||
      sections?.description ||
      "";
    const objectives =
      sections?.learningObjectives || sections?.objectives || [];
    const materials = sections?.materials || [];
    const procedure = sections?.procedure || sections?.activities || [];
    const assessment = sections?.assessment || sections?.assessments || [];
    const teacherNotes =
      sections?.teacherNotes || sections?.notes || sections?.reminders || [];

    return [
      { type: "heading", level: 1, text: title },
      { type: "paragraph", text: `Subject: ${request.subject}` },
      { type: "paragraph", text: `Grade Level: ${request.gradeLevel}` },
      {
        type: "paragraph",
        text: `Duration: ${request.duration} minutes across ${request.numberOfSessions} session(s)`,
      },
      { type: "heading", level: 2, text: "Lesson Overview" },
      { type: "paragraph", text: String(overview) },
      { type: "heading", level: 2, text: "Learning Objectives" },
      {
        type: "list",
        style: "bullet",
        items: this.normalizeStringArray(objectives),
      },
      { type: "heading", level: 2, text: "Materials" },
      {
        type: "list",
        style: "bullet",
        items: this.normalizeStringArray(materials),
      },
      { type: "heading", level: 2, text: "Procedure" },
      {
        type: "list",
        style: "numbered",
        items: this.normalizeStringArray(procedure),
      },
      { type: "heading", level: 2, text: "Assessment" },
      {
        type: "list",
        style: "bullet",
        items: this.normalizeStringArray(assessment),
      },
      { type: "heading", level: 2, text: "Teacher Notes" },
      {
        type: "list",
        style: "bullet",
        items: this.normalizeStringArray(teacherNotes),
      },
    ];
  }

  private normalizeStringArray(value: unknown) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item)).filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      return [value.trim()];
    }

    return [];
  }

  private sectionsFromDocument(
    request: GenerateLessonPlanRequest,
    document: LessonPlanDocument,
  ): GenerateLessonPlanResponse["sections"] {
    const getListAfterHeading = (heading: string) => {
      const headingIndex = document.blocks.findIndex(
        (block) =>
          block.type === "heading" &&
          block.text.toLowerCase() === heading.toLowerCase(),
      );
      const listBlock = document.blocks
        .slice(headingIndex + 1)
        .find((block) => block.type === "list");

      return listBlock?.type === "list" ? listBlock.items : [];
    };

    const getParagraphAfterHeading = (heading: string) => {
      const headingIndex = document.blocks.findIndex(
        (block) =>
          block.type === "heading" &&
          block.text.toLowerCase() === heading.toLowerCase(),
      );
      const paragraphBlock = document.blocks
        .slice(headingIndex + 1)
        .find((block) => block.type === "paragraph");

      return paragraphBlock?.type === "paragraph" ? paragraphBlock.text : "";
    };

    return {
      title: document.title || request.title,
      subject: request.subject,
      gradeLevel: request.gradeLevel,
      duration: `${request.duration} minutes across ${request.numberOfSessions} session(s)`,
      lessonOverview:
        getParagraphAfterHeading("Lesson Overview") ||
        "Review the generated document for lesson overview details.",
      learningObjectives: getListAfterHeading("Learning Objectives"),
      materials: getListAfterHeading("Materials"),
      procedure: getListAfterHeading("Procedure"),
      assessment: getListAfterHeading("Assessment"),
      teacherNotes: getListAfterHeading("Teacher Notes"),
    };
  }

  private activitiesFromProcedure(procedure: string[]) {
    return procedure.length
      ? procedure
      : ["Review the generated procedure section for classroom activities."];
  }

  private summarizeDraft(userDraftText?: string) {
    if (!userDraftText?.trim()) {
      return "Teacher draft was not provided yet. Use this structure as a starting point and fill in the lesson-specific content before classroom use.";
    }

    return `Restructured from teacher draft: ${userDraftText.trim()}`;
  }

  private extractMaterials(userDraftText?: string) {
    if (!userDraftText?.trim()) {
      return [
        "Teacher-selected instructional materials",
        "Student activity materials",
        "Assessment materials",
      ];
    }

    return [
      "Materials mentioned in the teacher draft",
      "Board or presentation tool",
      "Student worksheet or activity sheet",
    ];
  }

  private buildObjectives(request: GenerateLessonPlanRequest) {
    return [
      `Explain the key ideas of ${request.subject} in a way appropriate for ${request.gradeLevel}.`,
      `Participate in guided and independent activities related to ${request.title}.`,
      `Demonstrate understanding through a short assessment or performance task.`,
    ];
  }

  private buildActivities(request: GenerateLessonPlanRequest, session: number) {
    return [
      `Opening: activate prior knowledge about ${request.subject}.`,
      `Guided activity: teacher models or explains the core idea for session ${session}.`,
      "Practice: students work individually, in pairs, or in groups.",
      "Closure: students summarize what they learned and ask remaining questions.",
    ];
  }

  private buildProcedure(request: GenerateLessonPlanRequest) {
    return [
      `Introduce the lesson topic: ${request.title}.`,
      `Present the main ${request.subject} concepts with examples appropriate for ${request.gradeLevel}.`,
      "Guide students through a structured classroom activity.",
      "Let students practice or apply the concept.",
      "Check understanding and close with reflection or summary.",
    ];
  }

  private buildAssessment(request: GenerateLessonPlanRequest) {
    return [
      `Use questioning and observation to check understanding during the ${request.subject} lesson.`,
      "Review student outputs from the practice activity.",
      "End with an exit ticket, short quiz, performance task, or oral response.",
    ];
  }

  private buildTeacherNotes(request: GenerateLessonPlanRequest) {
    const notes = [
      "Review this AI-structured draft before classroom use.",
      "Adjust timing, examples, and activities based on your students' needs.",
    ];

    if (request.templateNotes?.trim()) {
      notes.push(`Template or school notes: ${request.templateNotes.trim()}`);
    }

    return notes;
  }

  private formatStructuredDraft(
    sections: GenerateLessonPlanResponse["sections"],
  ) {
    return [
      `Title: ${sections.title}`,
      `Subject: ${sections.subject}`,
      `Grade Level: ${sections.gradeLevel}`,
      `Duration: ${sections.duration}`,
      "",
      `Lesson Overview: ${sections.lessonOverview}`,
      "",
      "Learning Objectives:",
      ...sections.learningObjectives.map((item) => `- ${item}`),
      "",
      "Materials:",
      ...sections.materials.map((item) => `- ${item}`),
      "",
      "Procedure:",
      ...sections.procedure.map((item) => `- ${item}`),
      "",
      "Assessment:",
      ...sections.assessment.map((item) => `- ${item}`),
      "",
      "Teacher Notes:",
      ...sections.teacherNotes.map((item) => `- ${item}`),
    ].join("\n");
  }

  private buildDocument(
    sections: GenerateLessonPlanResponse["sections"],
  ): LessonPlanDocument {
    return {
      type: "lesson_plan_document",
      format: "json",
      version: 1,
      title: sections.title,
      blocks: [
        { type: "heading", level: 1, text: sections.title },
        { type: "paragraph", text: `Subject: ${sections.subject}` },
        { type: "paragraph", text: `Grade Level: ${sections.gradeLevel}` },
        { type: "paragraph", text: `Duration: ${sections.duration}` },
        { type: "heading", level: 2, text: "Lesson Overview" },
        { type: "paragraph", text: sections.lessonOverview },
        { type: "heading", level: 2, text: "Learning Objectives" },
        {
          type: "list",
          style: "bullet",
          items: sections.learningObjectives,
        },
        { type: "heading", level: 2, text: "Materials" },
        { type: "list", style: "bullet", items: sections.materials },
        { type: "heading", level: 2, text: "Procedure" },
        { type: "list", style: "numbered", items: sections.procedure },
        { type: "heading", level: 2, text: "Assessment" },
        { type: "list", style: "bullet", items: sections.assessment },
        { type: "heading", level: 2, text: "Teacher Notes" },
        { type: "list", style: "bullet", items: sections.teacherNotes },
      ],
      exportTargets: OpenAIConfig.exportTargets,
    };
  }

  private buildWordCompatibleHtml(document: LessonPlanDocument) {
    const body = document.blocks.map((block) => {
      if (block.type === "heading") {
        return `<h${block.level}>${this.escapeHtml(block.text)}</h${block.level}>`;
      }

      if (block.type === "paragraph") {
        return `<p>${this.escapeHtml(block.text)}</p>`;
      }

      const tag = block.style === "numbered" ? "ol" : "ul";
      const items = block.items
        .map((item) => `<li>${this.escapeHtml(item)}</li>`)
        .join("");

      return `<${tag}>${items}</${tag}>`;
    });

    return [
      "<!DOCTYPE html>",
      "<html>",
      "<head>",
      '<meta charset="utf-8" />',
      `<title>${this.escapeHtml(document.title)}</title>`,
      "<style>",
      "body { font-family: Arial, sans-serif; line-height: 1.5; }",
      "h1 { font-size: 24px; }",
      "h2 { font-size: 18px; margin-top: 20px; }",
      "p, li { font-size: 12pt; }",
      "</style>",
      "</head>",
      "<body>",
      ...body,
      "</body>",
      "</html>",
    ].join("");
  }

  private documentToPlainText(document: LessonPlanDocument) {
    return document.blocks
      .flatMap((block) => {
        if (block.type === "heading" || block.type === "paragraph") {
          return [block.text];
        }

        return block.items.map((item, index) =>
          block.style === "numbered" ? `${index + 1}. ${item}` : `- ${item}`,
        );
      })
      .join("\n");
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private slugify(value: string) {
    return (
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "lesson-plan"
    );
  }
}

export const openAIService = new OpenAIService();
export default openAIService;
