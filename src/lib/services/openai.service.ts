/**
 * OpenAI Service
 * Handles lesson plan specialist behavior.
 * Calls OpenAI for structured lesson plan documents and enforces response credits.
 */

import OpenAIConfig from '../config/openai.config';
import { LessonPlan } from '../schemas/lesson.schema';
import { User } from '../schemas/user.schema';
import { Session } from '../schemas/session.schema';
import { createActivityLog } from './activity-log.service';
import { buildTemplatePrompt, buildActivityTypePrompt } from './template-prompts';
import { AppError, NotFoundError, QuotaError, ExternalServiceError } from '../types/errors';

export interface GenerateLessonPlanRequest {
  title: string;
  subject: string;
  gradeLevel: string;
  duration: number;
  numberOfSessions: number;
  userDraftText?: string;
  language: string;
  templateNotes?: string;
  activityPreferences?: string[];
  activityPreferenceNotes?: string;
  templateId?:
    'lessora-ai' | 'deped-semi-detailed' | 'detailed-lesson-plan' | 'daily-lesson-log' | 'matatag';
}

export type LessonPlanDocumentBlock =
  | {
      type: 'heading';
      level: 1 | 2 | 3;
      text: string;
    }
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'list';
      style: 'bullet' | 'numbered';
      items: string[];
    };

export interface LessonPlanDocument {
  type: 'lesson_plan_document';
  format: 'json';
  version: 1;
  title: string;
  blocks: LessonPlanDocumentBlock[];
  exportTargets: string[];
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
  templateId?:
    'lessora-ai' | 'deped-semi-detailed' | 'detailed-lesson-plan' | 'daily-lesson-log' | 'matatag';
}

export interface LessonPlanHistoryDetail extends LessonPlanHistoryItem {
  document: LessonPlanDocument;
  draftText: string;
  model?: string;
  templateId?:
    'lessora-ai' | 'deped-semi-detailed' | 'detailed-lesson-plan' | 'daily-lesson-log' | 'matatag';
}

const lessonPlanningSignals = [
  'lesson',
  'teach',
  'teacher',
  'student',
  'class',
  'grade',
  'subject',
  'objective',
  'activity',
  'assessment',
  'curriculum',
  'learning',
  'materials',
  'rubric',
];

const unrelatedRiskSignals = [
  'financial advice',
  'investment',
  'crypto',
  'medical advice',
  'diagnose',
  'legal advice',
  'lawsuit',
  'write code',
  'debug code',
  'general chat',
];

class OpenAIService {
  private publicPlansCache: { data: LessonPlanHistoryItem[]; timestamp: number } | null = null;
  private readonly CACHE_TTL_MS = 60_000;

  private getCachedPublicPlans(): LessonPlanHistoryItem[] | null {
    if (!this.publicPlansCache) return null;
    if (Date.now() - this.publicPlansCache.timestamp < this.CACHE_TTL_MS) {
      return this.publicPlansCache.data;
    }
    this.publicPlansCache = null;
    return null;
  }

  private setPublicPlansCache(data: LessonPlanHistoryItem[]): void {
    this.publicPlansCache = { data, timestamp: Date.now() };
  }

  async generateLessonPlan(
    request: GenerateLessonPlanRequest,
    ownerId: string,
    isAnonymous: boolean
  ): Promise<GenerateLessonPlanResponse> {
    const scopeCheck = this.validateRequest(
      [
        request.title,
        request.subject,
        request.gradeLevel,
        request.userDraftText,
        request.templateNotes,
      ]
        .filter(Boolean)
        .join(' ')
    );

    if (!scopeCheck.isValid) {
      throw new Error(scopeCheck.reason ?? OpenAIConfig.refusalMessage);
    }

    if (!OpenAIConfig.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const creditedUser = await this.reserveResponseCredit(ownerId, isAnonymous);

    // Fetch full user data for DepEd template (only for registered users)
    // Matatag does not use teacher name in its prompt — keep it anonymous.
    let user = null;
    if (!isAnonymous && request.templateId !== 'matatag') {
      user = await User.findById(ownerId);
      if (!user) {
        throw new NotFoundError('User');
      }
    }

    let document: LessonPlanDocument;

    try {
      document = await this.createDocumentWithOpenAI(request, user);
    } catch (error) {
      await this.refundResponseCredit(ownerId, isAnonymous);
      throw error;
    }

    const sessionDuration = Math.max(1, Math.floor(request.duration / request.numberOfSessions));
    const sections = this.sectionsFromDocument(request, document);
    const objectives = sections.learningObjectives;

    const sessions = Array.from({ length: request.numberOfSessions }, (_, index) => ({
      sessionNumber: index + 1,
      title:
        request.numberOfSessions === 1 ? request.title : `${request.title} - Session ${index + 1}`,
      duration: sessionDuration,
      objectives,
      content: sections.lessonOverview,
      activities: this.activitiesFromProcedure(sections.procedure),
    }));
    const draftText = this.formatStructuredDraft(sections);
    let savedPlan;

    try {
      savedPlan = await LessonPlan.create({
        userId: isAnonymous ? null : ownerId,
        sessionId: isAnonymous ? ownerId : undefined,
        templateId: request.templateId || 'lessora-ai',
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
        status: 'draft',
        tags: [request.subject, request.gradeLevel],
        isPublic: isAnonymous,
        generatedByAI: true,
        aiModel: OpenAIConfig.model,
        aiDocument: document,
        lastGeneratedAt: new Date(),
      });
    } catch (error) {
      await this.refundResponseCredit(ownerId, isAnonymous);
      throw error;
    }

    void createActivityLog({
      userId: isAnonymous ? undefined : ownerId,
      eventType: 'lesson_plan_generated',
      subject: request.subject,
      metadata: {
        lessonPlanId: savedPlan._id.toString(),
        title: request.title,
        gradeLevel: request.gradeLevel,
        duration: request.duration,
        templateId: request.templateId || 'lessora-ai',
      },
    }).catch((error) => {
      console.error('Failed to write lesson plan activity log:', error);
    });

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
    lessonPlanId: string,
    selectedSections: string[],
    refinementRequest: string,
    ownerId: string,
    isAnonymous: boolean
  ): Promise<GenerateLessonPlanResponse> {
    const lessonPlan = await LessonPlan.findOne({
      _id: lessonPlanId,
      ...(isAnonymous ? { sessionId: ownerId } : { userId: ownerId }),
      generatedByAI: true,
    });

    if (!lessonPlan || !lessonPlan.aiDocument) {
      throw new NotFoundError('Lesson plan');
    }

    const templateId = lessonPlan.templateId || 'lessora-ai';
    const scopeCheck = this.validateRequest(
      `${lessonPlan.title} ${lessonPlan.subject} ${lessonPlan.gradeLevel} ${refinementRequest} ${selectedSections.join(' ')}`
    );

    if (!scopeCheck.isValid) {
      throw new Error(scopeCheck.reason ?? OpenAIConfig.refusalMessage);
    }

    this.validateRefinementSections(selectedSections, templateId);

    if (!OpenAIConfig.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const creditedUser = await this.reserveResponseCredit(ownerId, isAnonymous);
    const user = isAnonymous ? null : await User.findById(ownerId);
    if (!isAnonymous && !user) {
      await this.refundResponseCredit(ownerId, isAnonymous);
      throw new NotFoundError('User');
    }

    let document: LessonPlanDocument;

    try {
      document = await this.createRefinedDocumentWithOpenAI({
        lessonPlan,
        selectedSections,
        refinementRequest,
        templateId,
      });
    } catch (error) {
      await this.refundResponseCredit(ownerId, isAnonymous);
      throw error;
    }

    const baseRequest: GenerateLessonPlanRequest = {
      title: lessonPlan.title,
      subject: lessonPlan.subject,
      gradeLevel: lessonPlan.gradeLevel,
      duration: lessonPlan.totalDuration || 60,
      numberOfSessions: lessonPlan.sessions?.length || 1,
      language: 'english',
      templateId,
    };
    const sections = this.sectionsFromDocument(baseRequest, document);
    const draftText = this.formatStructuredDraft(sections);
    const sessionsCount = baseRequest.numberOfSessions;
    const sessions = Array.from({ length: sessionsCount }, (_, i) => ({
      sessionNumber: i + 1,
      title: sections.title,
      duration: Math.floor(baseRequest.duration / sessionsCount),
      objectives: sections.learningObjectives,
      content: sections.lessonOverview,
      activities: this.activitiesFromProcedure(sections.procedure),
    }));

    await LessonPlan.updateOne(
      { _id: lessonPlanId, ...(isAnonymous ? { sessionId: ownerId } : { userId: ownerId }) },
      {
        $set: {
          title: sections.title,
          description: sections.lessonOverview.slice(0, 1000),
          subject: sections.subject,
          gradeLevel: sections.gradeLevel,
          draftText,
          sessions: sessions.map((session, index) => ({
            ...session,
            order: index + 1,
          })),
          totalDuration: baseRequest.duration,
          aiDocument: document,
          aiModel: OpenAIConfig.model,
          lastGeneratedAt: new Date(),
          templateId,
        },
      }
    );

    void createActivityLog({
      userId: isAnonymous ? undefined : ownerId,
      eventType: 'lesson_plan_refined',
      subject: lessonPlan.subject,
      metadata: {
        lessonPlanId,
        title: lessonPlan.title,
        templateId,
        selectedSections,
      },
    }).catch((error) => {
      console.error('Failed to write lesson plan refinement activity log:', error);
    });

    return {
      success: true,
      lessonPlanId,
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

  async listRecentLessonPlans(
    ownerId: string,
    isAnonymous: boolean
  ): Promise<LessonPlanHistoryItem[]> {
    const filter = isAnonymous
      ? { sessionId: ownerId, generatedByAI: true }
      : { userId: ownerId, generatedByAI: true };

    const plans = await LessonPlan.find(filter)
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('title subject gradeLevel totalDuration createdAt updatedAt templateId')
      .lean();

    return plans.map((plan) => ({
      id: plan._id.toString(),
      title: plan.title,
      subject: plan.subject,
      gradeLevel: plan.gradeLevel,
      totalDuration: plan.totalDuration,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      templateId: plan.templateId ?? 'lessora-ai',
    }));
  }

  async listPublicLessonPlans(): Promise<LessonPlanHistoryItem[]> {
    const cached = this.getCachedPublicPlans();
    if (cached) return cached;

    const plans = await LessonPlan.find({ generatedByAI: true, isPublic: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('title subject gradeLevel totalDuration createdAt updatedAt templateId')
      .lean();

    const result = plans.map((plan) => ({
      id: plan._id.toString(),
      title: plan.title,
      subject: plan.subject,
      gradeLevel: plan.gradeLevel,
      totalDuration: plan.totalDuration,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      templateId: plan.templateId ?? 'lessora-ai',
    }));

    this.setPublicPlansCache(result);
    return result;
  }

  async getPublicLessonPlanById(lessonPlanId: string): Promise<LessonPlanHistoryDetail> {
    const plan = await LessonPlan.findOne({
      _id: lessonPlanId,
      isPublic: true,
      generatedByAI: true,
    }).lean();

    if (!plan || !plan.aiDocument) {
      throw new NotFoundError('Lesson plan');
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
      templateId: plan.templateId ?? 'lessora-ai',
    };
  }

  async getLessonPlanById(
    ownerId: string,
    lessonPlanId: string,
    isAnonymous: boolean
  ): Promise<LessonPlanHistoryDetail> {
    const filter = isAnonymous
      ? { _id: lessonPlanId, sessionId: ownerId, generatedByAI: true }
      : { _id: lessonPlanId, userId: ownerId, generatedByAI: true };

    const plan = await LessonPlan.findOne(filter).lean();

    if (!plan || !plan.aiDocument) {
      throw new NotFoundError('Lesson plan');
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
      templateId: plan.templateId ?? 'lessora-ai',
    };
  }

  private async createRefinedDocumentWithOpenAI(params: {
    lessonPlan: any;
    selectedSections: string[];
    refinementRequest: string;
    templateId:
      | 'lessora-ai'
      | 'deped-semi-detailed'
      | 'detailed-lesson-plan'
      | 'daily-lesson-log'
      | 'matatag';
  }): Promise<LessonPlanDocument> {
    const requestBody = {
      model: OpenAIConfig.model,
      temperature: OpenAIConfig.temperature,
      max_output_tokens: OpenAIConfig.maxTokens,
      input: [
        {
          role: 'system',
          content:
            'You refine existing lesson plans. Preserve the structure and update only the requested sections.',
        },
        {
          role: 'user',
          content: [
            `Template: ${params.templateId}`,
            `Lesson plan title: ${params.lessonPlan.title}`,
            `Subject: ${params.lessonPlan.subject}`,
            `Grade level: ${params.lessonPlan.gradeLevel}`,
            `Selected sections: ${params.selectedSections.join(', ')}`,
            `User instruction: ${params.refinementRequest}`,
            'Current lesson plan JSON:',
            JSON.stringify(params.lessonPlan.aiDocument),
            'Return only valid JSON for the updated lesson plan document.',
          ].join('\n'),
        },
      ],
      text: {
        format: {
          type: 'json_object',
        },
      },
    };

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OpenAIConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const payload = await response.json();

    if (!response.ok) {
      const message = payload?.error?.message || 'OpenAI lesson plan refinement failed';
      throw new Error(message);
    }

    const rawText = this.extractOpenAIText(payload);
    const parsed = JSON.parse(rawText);
    const normalizedBlocks = this.normalizeDocumentBlocks(parsed, {
      title: params.lessonPlan.title,
      subject: params.lessonPlan.subject,
      gradeLevel: params.lessonPlan.gradeLevel,
      duration: params.lessonPlan.totalDuration || 60,
      numberOfSessions: 1,
      language: 'english',
      templateId: params.templateId,
    });
    this.assertCompleteLessonPlan(normalizedBlocks, params.templateId, true);

    return {
      ...parsed,
      type: 'lesson_plan_document',
      format: 'json',
      version: 1,
      title: parsed?.title || params.lessonPlan.title,
      blocks: normalizedBlocks,
      exportTargets: ['doc', 'pdf', 'docx'],
    };
  }

  private validateRefinementSections(
    selectedSections: string[],
    templateId:
      'lessora-ai' | 'deped-semi-detailed' | 'detailed-lesson-plan' | 'daily-lesson-log' | 'matatag'
  ) {
    if (templateId !== 'lessora-ai' && templateId !== 'deped-semi-detailed') {
      return;
    }

    const allowedSections =
      templateId === 'deped-semi-detailed'
        ? [
            'metadata',
            'learning competencies',
            'objectives',
            'content',
            'learning resources',
            'procedure',
            'assessment',
            'assignment',
            'remarks',
            'reflection',
          ]
        : [
            'overview',
            'lesson overview',
            'objectives',
            'learning objectives',
            'materials',
            'procedure',
            'assessment',
            'teacher notes',
          ];

    const invalid = selectedSections.filter(
      (section) => !allowedSections.includes(section.toLowerCase())
    );

    if (invalid.length) {
      throw new Error('One or more selected sections are invalid for this template.');
    }
  }

  validateRequest(request: string): {
    isValid: boolean;
    reason?: string;
  } {
    const lowerRequest = request.toLowerCase();
    const hasLessonPlanningSignal = lessonPlanningSignals.some((keyword) =>
      lowerRequest.includes(keyword)
    );
    const hasUnrelatedRisk = unrelatedRiskSignals.some((keyword) => lowerRequest.includes(keyword));

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
      responseCreditsPerAnonymous: 3,
      outputFormat: OpenAIConfig.outputFormat,
      mediaGenerationAllowed: OpenAIConfig.mediaGenerationAllowed,
      exportTargets: OpenAIConfig.exportTargets,
    };
  }

  private async reserveResponseCredit(ownerId: string, isAnonymous: boolean) {
    if (isAnonymous) {
      // Ensure session exists with credits
      await Session.updateOne(
        { sessionId: ownerId, aiResponseCredits: { $exists: false } },
        { $set: { aiResponseCredits: 3 } }
      );

      const session = await Session.findOneAndUpdate(
        { sessionId: ownerId, aiResponseCredits: { $gt: 0 } },
        { $inc: { aiResponseCredits: -1 } },
        { new: true }
      );

      if (!session) {
        throw new QuotaError();
      }

      return { aiResponseCredits: session.aiResponseCredits } as any;
    }

    // Registered user path
    await User.updateOne(
      { _id: ownerId, aiResponseCredits: { $exists: false } },
      { $set: { aiResponseCredits: 5 } }
    );

    const user = await User.findOneAndUpdate(
      { _id: ownerId, aiResponseCredits: { $gt: 0 } },
      { $inc: { aiResponseCredits: -1 } },
      { new: true }
    );

    if (!user) {
      throw new QuotaError();
    }

    return user;
  }

  private async refundResponseCredit(ownerId: string, isAnonymous: boolean) {
    if (isAnonymous) {
      await Session.updateOne({ sessionId: ownerId }, { $inc: { aiResponseCredits: 1 } });
    } else {
      await User.updateOne({ _id: ownerId }, { $inc: { aiResponseCredits: 1 } });
    }
  }

  private async createDocumentWithOpenAI(
    request: GenerateLessonPlanRequest,
    user: any
  ): Promise<LessonPlanDocument> {
    const requestBody = {
      model: OpenAIConfig.model,
      temperature: OpenAIConfig.temperature,
      max_output_tokens: OpenAIConfig.maxTokens,
      input: [
        {
          role: 'system',
          content: OpenAIConfig.systemPrompt,
        },
        {
          role: 'user',
          content: this.buildTeacherPrompt(request, user),
        },
      ],
      text: {
        format: {
          type: 'json_object',
        },
      },
    };

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OpenAIConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const payload = await response.json();

    if (!response.ok) {
      const message = payload?.error?.message || 'OpenAI lesson plan generation failed';
      throw new Error(
        `${message}. Check OPENAI_MODEL; this endpoint expects a Responses API model that supports JSON output, such as gpt-4o-mini.`
      );
    }

    const rawText = this.extractOpenAIText(payload);

    const parsed = JSON.parse(rawText);
    const normalizedBlocks = this.normalizeDocumentBlocks(parsed, request);
    this.assertCompleteLessonPlan(normalizedBlocks, request.templateId);

    return {
      ...parsed,
      type: 'lesson_plan_document',
      format: 'json',
      version: 1,
      title: parsed?.title || request.title,
      blocks: normalizedBlocks,
      exportTargets: ['doc', 'pdf', 'docx'],
    };
  }

  private buildTeacherPrompt(request: GenerateLessonPlanRequest, user: any) {
    const templateId = request.templateId || 'lessora-ai';

    if (templateId === 'lessora-ai') {
      return this.buildLessoraAIPrompt(request);
    }

    if (templateId === 'deped-semi-detailed') {
      return this.buildDepEdPrompt(request, user);
    }

    return buildTemplatePrompt(request, user);
  }

  private buildGradeLevelAdaptationRequirement() {
    return [
      `Grade-Level Adaptation Requirement`,
      ``,
      `Adjust activities based on learner age and developmental level.`,
      ``,
      `Younger learners should receive more games, movement, visuals, storytelling, and guided activities.`,
      ``,
      `Older learners should receive more discussions, problem-solving, investigations, projects, analysis, and real-world applications.`,
      ``,
      `Do NOT leave any instructional content in English unless it is a proper noun, technical term, or curriculum code.`,
      ``,
      `Apply this rule to every part of the lesson plan, including the headings, explanations, procedures, assessments, and teacher notes.`,
    ].join('\n');
  }

  private buildLessoraAIPrompt(request: GenerateLessonPlanRequest) {
    const procedureSteps = request.duration <= 30 ? 6 : request.duration <= 60 ? 8 : 10;
    return [
      `CRITICAL LANGUAGE REQUIREMENT:

The entire lesson plan MUST be written in "${request.language}".

This includes:
- title
- heading.text values
- paragraph.text values
- list.items values
- objectives
- materials
- procedures
- assessments
- teacher notes

${this.buildGradeLevelAdaptationRequirement()}`,
      `Do not copy any sample procedure pattern literally; tailor the procedure sequence to the topic, subject, and grade level.`,
      `Topic / Subject: ${request.title}`,
      `Subject: ${request.subject}`,
      `Grade Level: ${request.gradeLevel}`,
      `Duration: ${request.duration} minutes`,
      `Language: ${request.language || 'English'}`,
      `Number of Sessions: ${request.numberOfSessions}`,
      request.userDraftText
        ? `Teacher Draft / Specific Goals / Standards: ${request.userDraftText}`
        : 'Teacher Draft / Specific Goals / Standards: Not provided',
      request.templateNotes
        ? `Template Notes: ${request.templateNotes}`
        : 'Template Notes: Not provided',
      buildActivityTypePrompt(request),
      'Return only valid JSON. Do not include markdown, explanation, or media.',
      'Generate a complete classroom-ready lesson plan with every required section.',
      'Do not stop after the overview or objectives.',
      `Minimum detail: 3 to 5 learning objectives, 3 to 5 materials, ${procedureSteps} procedure steps depends on the duration where in it is 30 minutes while less than 60 minutes of duration is 8 procedure steps else it will be 10, 2 assessment methods, and 2 teacher notes.`,
      'Use exactly this top-level shape:',
      'Procedure requirements:',
      '- The Procedure section is the MOST IMPORTANT part of the lesson plan.',
      '- Generate detailed teacher-facing classroom procedures, not short labels.',
      '- Each procedure step must explain exactly what the teacher will do and what learners will do.',
      '- Include sample teacher questions, discussion prompts, instructions, and expected learner responses when appropriate.',
      '- Design activities appropriate for the grade level, subject, topic, and lesson duration.',
      '- Activities should be engaging, practical, and age-appropriate.',
      '- Avoid repeating the same instructional sequence across different lesson plans.',
      '- Select teaching strategies that naturally fit the topic being taught.',
      '- At least 60% of procedure steps should involve active learner participation.',
      "- Avoid generic phrases such as 'Discuss the lesson' or 'Conduct an activity'.",
      '- Describe specific classroom actions, learner tasks, questions, or outputs.',
      '- Each procedure step should contain 2-4 complete sentences.',
      "- Avoid generic steps such as 'Discuss the lesson' or 'Do an activity'.",
      '- Every procedure must be classroom-ready and actionable.',
      "- The Procedure section should contain approximately 50% of the lesson plan's total content.",
      '- Procedures should be significantly more detailed than objectives, materials, and assessments.',
      `- The procedure section should contain at least ${procedureSteps} detailed numbered steps.`,
      '- Procedures should demonstrate active learning and student participation.',
      ' References and Resources',

      "At the end of the lesson plan, include a 'References and Resources' section when applicable.",

      'Guidelines:',
      '- Suggest relevant curriculum documents, teacher guides, textbooks, learning modules, educational websites, and learning resources related to the lesson topic.',
      "- Do NOT provide direct URLs as they may be broken or inaccessible. Instead, provide exact search keywords, document titles, or official repository names (e.g., 'Search for MATATAG Curriculum Guide Grade 4 Mathematics on DepEd LRMDS').",
      '- Provide verifiable book titles, authors, and publishers only when highly confident.',
      '- If specific verifiable sources are unavailable, provide general resource recommendations instead.',
      '- Do not claim that these references were used to generate the lesson plan unless they were explicitly provided by the user or retrieved from a verified source.',
      "- Clearly label this section as 'References and Resources' or 'Suggested References'.",

      JSON.stringify({
        type: 'lesson_plan_document',
        format: 'json',
        version: 1,
        title: 'string',
        blocks: [
          { type: 'heading', level: 1, text: 'Lesson title' },
          { type: 'paragraph', text: 'Subject: ...' },
          { type: 'paragraph', text: 'Grade Level: ...' },
          { type: 'paragraph', text: 'Duration: ...' },
          { type: 'heading', level: 2, text: 'Lesson Overview' },
          { type: 'paragraph', text: 'Overview text' },
          {
            type: 'heading',
            level: 2,
            text: 'Learning Objectives',
          },
          {
            type: 'list',
            style: 'bullet',
            items: ['objective 1', 'objective 2', 'objective 3'],
          },
          { type: 'heading', level: 2, text: 'Materials' },
          {
            type: 'list',
            style: 'bullet',
            items: ['material 1', 'material 2', 'material 3'],
          },
          { type: 'heading', level: 2, text: 'Procedure' },
          {
            type: 'list',
            style: 'numbered',
            items: ['string'],
          },
          { type: 'heading', level: 2, text: 'Assessment' },
          {
            type: 'list',
            style: 'bullet',
            items: ['formative assessment', 'summative or exit assessment', 'quiz assessment'],
          },
          { type: 'heading', level: 2, text: 'Teacher Notes' },
          {
            type: 'list',
            style: 'bullet',
            items: ['differentiation note', 'preparation or pacing note'],
          },
          { type: 'heading', level: 2, text: 'References and Resources' },
          {
            type: 'list',
            style: 'bullet',
            items: ['Search term: [insert specific relevant search term here]'],
          },
          { type: 'heading', level: 2, text: 'AI Transparency Note' },
          {
            type: 'paragraph',
            text: 'This lesson plan was generated by AI based on the provided inputs, selected lesson plan template, educational best practices, and curriculum-aligned instructional design. Teachers are encouraged to review, adapt, and supplement the content with official curriculum documents, textbooks, and school-approved resources.',
          },
        ],
        exportTargets: ['doc', 'pdf', 'docx'],
      }),
    ].join('\n');
  }

  private buildDepEdPrompt(request: GenerateLessonPlanRequest, user: any) {
    const teacherName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Anonymous Teacher';
    const schoolName = user?.school || 'Not specified';
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return [
      `Generate a DepEd Semi-Detailed Lesson Plan following the Philippine Department of Education format.`,
      this.buildGradeLevelAdaptationRequirement(),
      ``,
      `CRITICAL ANTI-HALLUCINATION RULES:`,
      `1. DO NOT invent or make up any information`,
      `2. DO NOT leave any section blank or with placeholder text`,
      `3. DO NOT use brackets like [specify], [insert], [add here]`,
      `4. ONLY use the actual data provided below`,
      `5. Generate REAL, SPECIFIC, DETAILED content for every section`,
      `6. All procedure steps must be COMPLETE and ACTIONABLE`,
      `7. All assessment questions must be REAL and GRADE-APPROPRIATE`,
      `8. All content must be in ${request.language || 'English'} event the blocks themselves must be in the specified language`,
      `9. The procedure sequence must be tailored to the lesson topic and grade level, not copied from a fixed pattern.`,
      ``,
      `ACTUAL DATA TO USE:`,
      `Topic / Subject: ${request.title}`,
      `Subject: ${request.subject}`,
      `Grade Level: ${request.gradeLevel}`,
      `Duration: ${request.duration} minutes`,
      `Date: ${currentDate}`,
      `Teacher: ${teacherName}`,
      `School: ${schoolName}`,
      request.userDraftText ? `Teacher's Specific Goals / Standards: ${request.userDraftText}` : '',
      request.templateNotes ? `Additional Notes: ${request.templateNotes}` : '',
      buildActivityTypePrompt(request),
      ``,
      `Return only valid JSON. Do not include markdown, explanation, or media.`,
      `Generate a complete DepEd-compliant semi-detailed lesson plan with ALL required sections FULLY POPULATED.`,
      ``,
      `REQUIRED: Every section must have REAL, SPECIFIC content. No placeholders allowed.`,
      "At the end of the lesson plan, include a 'References and Resources' section when applicable.",

      'Guidelines:',
      '- Suggest relevant curriculum documents, teacher guides, textbooks, learning modules, educational websites, and learning resources related to the lesson topic.',
      "- Do NOT provide direct URLs as they may be broken or inaccessible. Instead, provide exact search keywords, document titles, or official repository names (e.g., 'Search for MATATAG Curriculum Guide Grade 4 Mathematics on DepEd LRMDS').",
      '- Provide verifiable book titles, authors, and publishers only when highly confident.',
      '- If specific verifiable sources are unavailable, provide general resource recommendations instead.',
      '- Do not claim that these references were used to generate the lesson plan unless they were explicitly provided by the user or retrieved from a verified source.',
      "- Clearly label this section as 'References and Resources' or 'Suggested References'.",
      ``,
      `Use exactly this structure with blocks array:`,
      JSON.stringify({
        type: 'lesson_plan_document',
        format: 'json',
        version: 1,
        title: request.title,
        blocks: [
          { type: 'heading', level: 1, text: request.title },
          { type: 'heading', level: 2, text: 'I. Metadata' },
          { type: 'paragraph', text: `Grade Level: ${request.gradeLevel}` },
          { type: 'paragraph', text: `Subject: ${request.subject}` },
          { type: 'paragraph', text: `Date: ${currentDate}` },
          { type: 'paragraph', text: `Duration: ${request.duration} minutes` },
          { type: 'paragraph', text: `Teacher: ${teacherName}` },
          { type: 'paragraph', text: `School: ${schoolName}` },

          { type: 'heading', level: 2, text: 'II. Learning Competencies' },
          {
            type: 'paragraph',
            text: 'Generate an appropriate competency description based on the provided topic and grade level. Do not invent official MELC codes unless explicitly provided by the teacher.',
          },

          { type: 'heading', level: 2, text: 'III. Objectives' },
          {
            type: 'paragraph',
            text: 'Knowledge: Write specific knowledge objectives for this topic',
          },
          {
            type: 'paragraph',
            text: 'Skills: Write specific skills students will develop',
          },
          {
            type: 'paragraph',
            text: 'Attitude: Write specific values and attitudes to develop',
          },

          { type: 'heading', level: 2, text: 'IV. Content' },
          {
            type: 'paragraph',
            text: 'Write detailed content description for this specific topic',
          },

          { type: 'heading', level: 2, text: 'V. Learning Resources' },
          { type: 'heading', level: 3, text: 'References' },
          {
            type: 'list',
            style: 'bullet',
            items: [
              'List specific textbooks, modules, or curriculum guides for this grade and subject',
            ],
          },
          { type: 'heading', level: 3, text: 'Materials' },
          {
            type: 'list',
            style: 'bullet',
            items: ['List specific physical materials needed for this lesson'],
          },
          { type: 'heading', level: 3, text: 'Digital Resources' },
          {
            type: 'list',
            style: 'bullet',
            items: ['List specific websites, videos, or digital tools if applicable'],
          },

          { type: 'heading', level: 2, text: 'VI. Procedure' },
          {
            type: 'heading',
            level: 3,
            text: 'A. Preliminary Activities (5 minutes)',
          },
          {
            type: 'list',
            style: 'numbered',
            items: [
              'Prayer',
              'Greetings',
              'Checking of Attendance',
              'Review: Write specific review questions about previous lesson',
            ],
          },

          { type: 'heading', level: 3, text: 'B. Motivation (5-7 minutes)' },
          {
            type: 'paragraph',
            text: 'Write a specific, engaging activity to introduce this topic. Include exact questions or activities.',
          },

          { type: 'heading', level: 3, text: 'C. Lesson Proper' },
          { type: 'heading', level: 3, text: '1. Presentation (5-7 minutes)' },
          {
            type: 'paragraph',
            text: 'Write specific steps to introduce the topic with examples',
          },
          { type: 'heading', level: 3, text: '2. Discussion (10-15 minutes)' },
          {
            type: 'paragraph',
            text: 'Write detailed discussion points, questions, and explanations for this specific topic',
          },
          {
            type: 'heading',
            level: 3,
            text: '3. Guided Practice (7-10 minutes)',
          },
          {
            type: 'paragraph',
            text: 'Write specific guided practice activities with examples',
          },
          {
            type: 'heading',
            level: 3,
            text: '4. Independent Practice (5-7 minutes)',
          },
          {
            type: 'paragraph',
            text: 'Write specific independent work tasks for students',
          },

          {
            type: 'heading',
            level: 3,
            text: 'D. Generalization (3-5 minutes)',
          },
          {
            type: 'paragraph',
            text: 'Write specific summary questions and key takeaways for this topic',
          },

          { type: 'heading', level: 3, text: 'E. Application (5 minutes)' },
          {
            type: 'paragraph',
            text: 'Write specific real-world application activity or scenario',
          },

          { type: 'heading', level: 2, text: 'VII. Assessment' },
          {
            type: 'paragraph',
            text: 'Type: Choose Formative or Summative and explain why',
          },
          {
            type: 'paragraph',
            text: 'Instructions: Write clear, specific instructions for students',
          },
          {
            type: 'list',
            style: 'numbered',
            items: ['Write 3-5 specific, grade-appropriate assessment questions for this topic'],
          },

          { type: 'heading', level: 2, text: 'VIII. Assignment' },
          {
            type: 'paragraph',
            text: 'Write specific homework or follow-up task related to this lesson',
          },

          { type: 'heading', level: 2, text: 'IX. Remarks' },
          {
            type: 'paragraph',
            text: 'Leave blank - teacher will fill after lesson delivery',
          },

          { type: 'heading', level: 2, text: 'X. Reflection' },
          {
            type: 'paragraph',
            text: 'Number of students who mastered the lesson: (To be filled after lesson)',
          },
          {
            type: 'paragraph',
            text: 'Number of students who need remediation: (To be filled after lesson)',
          },
          {
            type: 'paragraph',
            text: 'Teaching effectiveness: (To be filled after lesson - reflection on what worked and what needs improvement)',
          },
          { type: 'heading', level: 2, text: 'References and Resources' },
          {
            type: 'list',
            style: 'bullet',
            items: ['Search term: [insert specific relevant search term here]'],
          },
          { type: 'heading', level: 2, text: 'AI Transparency Note' },
          {
            type: 'paragraph',
            text: 'This lesson plan was generated by AI based on the provided inputs, selected lesson plan template, educational best practices, and curriculum-aligned instructional design. Teachers are encouraged to review, adapt, and supplement the content with official curriculum documents, textbooks, and school-approved resources. Provide feedback on this generated lesson plan: https://forms.gle/8wrYbwdGkJxwzeXu7',
          },
        ],
        exportTargets: ['doc', 'pdf', 'docx'],
      }),
      ``,
      `CRITICAL FINAL INSTRUCTIONS:`,
      `1. Replace ALL instructional text in the example above with REAL content`,
      `2. Every paragraph must contain SPECIFIC information about "${request.title}"`,
      `3. Every list must contain REAL, ACTIONABLE items - minimum 3 items per list`,
      `4. Procedure sections must have DETAILED, STEP-BY-STEP instructions`,
      `5. Assessment questions must be COMPLETE, SPECIFIC questions for ${request.gradeLevel}`,
      `6. NO placeholders, NO brackets, NO generic text`,
      `7. Make it classroom-ready for ${request.gradeLevel} students learning about "${request.title}"`,
      `8. Use the teacher name "${teacherName}" and school "${schoolName}" exactly as provided`,
      `9. Use the date "${currentDate}" exactly as provided`,
      `10. Use the language "${request.language}" exactly as provided`,
      ' References and Resources',

      ``,
      `Generate the complete lesson plan now with ALL sections fully populated.`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  private extractOpenAIText(payload: any) {
    if (typeof payload.output_text === 'string') {
      return payload.output_text;
    }

    const text = payload.output
      ?.flatMap((item: any) => item.content ?? [])
      ?.find((content: any) => content.type === 'output_text')?.text;

    if (!text) {
      throw new Error('OpenAI returned an empty lesson plan response');
    }

    return text;
  }

  private normalizeDocumentBlocks(
    parsed: any,
    request: GenerateLessonPlanRequest
  ): LessonPlanDocumentBlock[] {
    const sourceBlocks =
      Array.isArray(parsed?.blocks) && parsed.blocks.length
        ? parsed.blocks
        : this.blocksFromSectionObject(parsed, request);

    const blocks = sourceBlocks
      .map((block: any) => {
        if (block?.type === 'heading') {
          const level =
            block.level === 1 || block.level === 2 || block.level === 3 ? block.level : 2;
          return {
            type: 'heading' as const,
            level: level as 1 | 2 | 3,
            text: String(block.text || ''),
          };
        }

        if (block?.type === 'paragraph') {
          return {
            type: 'paragraph' as const,
            text: String(block.text || ''),
          };
        }

        if (block?.type === 'list') {
          return {
            type: 'list' as const,
            style: block.style === 'numbered' ? 'numbered' : 'bullet',
            items: Array.isArray(block.items)
              ? block.items.map((item: unknown) => String(item))
              : [],
          };
        }

        return null;
      })
      .filter(
        (block: LessonPlanDocumentBlock | null): block is LessonPlanDocumentBlock => block !== null
      );

    if (!blocks.length) {
      throw new Error('OpenAI returned JSON but no renderable lesson plan blocks.');
    }

    return blocks;
  }

  private assertCompleteLessonPlan(
    blocks: LessonPlanDocumentBlock[],
    templateId?:
      'lessora-ai' | 'deped-semi-detailed' | 'detailed-lesson-plan' | 'daily-lesson-log' | 'matatag',
    isRefinement = false
  ) {
    // Skip validation for DepEd template as it has different structure
    if (templateId !== 'lessora-ai') {
      // Just check that we have some blocks
      if (!blocks.length) {
        throw new Error('OpenAI returned an empty lesson plan.');
      }
      return;
    }

    // Skip full heading check for refinements (partial response expected)
    if (isRefinement) {
      if (!blocks.length) {
        throw new Error('OpenAI returned an empty lesson plan.');
      }
      return;
    }

    // Validate Lessora AI template
    const requiredHeadings = [
      'Lesson Overview',
      'Learning Objectives',
      'Materials',
      'Procedure',
      'Assessment',
      'Teacher Notes',
    ];

    const headings = blocks
      .filter((block) => block.type === 'heading')
      .map((block) => block.text.toLowerCase());

    const missingHeadings = requiredHeadings.filter(
      (heading) => !headings.includes(heading.toLowerCase())
    );

    if (missingHeadings.length) {
      throw new Error(
        `OpenAI returned an incomplete lesson plan. Missing sections: ${missingHeadings.join(', ')}.`
      );
    }
  }

  private blocksFromSectionObject(parsed: any, request: GenerateLessonPlanRequest): any[] {
    const sections = parsed?.sections || parsed?.lessonPlan || parsed;
    const title = parsed?.title || sections?.title || request.title;
    const overview =
      sections?.lessonOverview ||
      sections?.overview ||
      sections?.description ||
      sections?.content ||
      '';
    const objectives =
      sections?.learningObjectives || sections?.objectives || sections?.contentStandard || [];
    const materials =
      sections?.materials || sections?.learningResources || sections?.resources || [];
    const procedure =
      sections?.procedure ||
      sections?.procedures ||
      sections?.teachingAndLearningProcedure ||
      sections?.lessonProper ||
      sections?.activities ||
      [];
    const assessment = sections?.assessment || sections?.evaluation || sections?.assessments || [];
    const teacherNotes =
      sections?.teacherNotes ||
      sections?.remarks ||
      sections?.reflection ||
      sections?.notes ||
      sections?.reminders ||
      [];

    return [
      { type: 'heading', level: 1, text: title },
      { type: 'paragraph', text: `Subject: ${request.subject}` },
      { type: 'paragraph', text: `Grade Level: ${request.gradeLevel}` },
      {
        type: 'paragraph',
        text: `Duration: ${request.duration} minutes across ${request.numberOfSessions} session(s)`,
      },
      { type: 'heading', level: 2, text: 'Lesson Overview' },
      { type: 'paragraph', text: String(overview) },
      { type: 'heading', level: 2, text: 'Learning Objectives' },
      {
        type: 'list',
        style: 'bullet',
        items: this.normalizeStringArray(objectives),
      },
      { type: 'heading', level: 2, text: 'Materials' },
      {
        type: 'list',
        style: 'bullet',
        items: this.normalizeStringArray(materials),
      },
      { type: 'heading', level: 2, text: 'Procedure' },
      {
        type: 'list',
        style: 'numbered',
        items: this.normalizeStringArray(procedure),
      },
      { type: 'heading', level: 2, text: 'Assessment' },
      {
        type: 'list',
        style: 'bullet',
        items: this.normalizeStringArray(assessment),
      },
      { type: 'heading', level: 2, text: 'Teacher Notes' },
      {
        type: 'list',
        style: 'bullet',
        items: this.normalizeStringArray(teacherNotes),
      },
    ];
  }

  private normalizeStringArray(value: unknown) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item)).filter(Boolean);
    }

    if (typeof value === 'string' && value.trim()) {
      return [value.trim()];
    }

    return [];
  }

  private sectionsFromDocument(
    request: GenerateLessonPlanRequest,
    document: LessonPlanDocument
  ): GenerateLessonPlanResponse['sections'] {
    const getListAfterHeading = (heading: string) => {
      const headingIndex = document.blocks.findIndex(
        (block) => block.type === 'heading' && block.text.toLowerCase() === heading.toLowerCase()
      );
      const listBlock = document.blocks
        .slice(headingIndex + 1)
        .find((block) => block.type === 'list');

      return listBlock?.type === 'list' ? listBlock.items : [];
    };

    const getParagraphAfterHeading = (heading: string) => {
      const headingIndex = document.blocks.findIndex(
        (block) => block.type === 'heading' && block.text.toLowerCase() === heading.toLowerCase()
      );
      const paragraphBlock = document.blocks
        .slice(headingIndex + 1)
        .find((block) => block.type === 'paragraph');

      return paragraphBlock?.type === 'paragraph' ? paragraphBlock.text : '';
    };

    return {
      title: document.title || request.title,
      subject: request.subject,
      gradeLevel: request.gradeLevel,
      duration: `${request.duration} minutes across ${request.numberOfSessions} session(s)`,
      lessonOverview:
        getParagraphAfterHeading('Lesson Overview') ||
        'Review the generated document for lesson overview details.',
      learningObjectives: getListAfterHeading('Learning Objectives'),
      materials: getListAfterHeading('Materials'),
      procedure: getListAfterHeading('Procedure'),
      assessment: getListAfterHeading('Assessment'),
      teacherNotes: getListAfterHeading('Teacher Notes'),
    };
  }

  private activitiesFromProcedure(procedure: string[]) {
    return procedure.length
      ? procedure
      : ['Review the generated procedure section for classroom activities.'];
  }

  private formatStructuredDraft(sections: GenerateLessonPlanResponse['sections']) {
    return [
      `Title: ${sections.title}`,
      `Subject: ${sections.subject}`,
      `Grade Level: ${sections.gradeLevel}`,
      `Duration: ${sections.duration}`,
      '',
      `Lesson Overview: ${sections.lessonOverview}`,
      '',
      'Learning Objectives:',
      ...sections.learningObjectives.map((item) => `- ${item}`),
      '',
      'Materials:',
      ...sections.materials.map((item) => `- ${item}`),
      '',
      'Procedure:',
      ...sections.procedure.map((item) => `- ${item}`),
      '',
      'Assessment:',
      ...sections.assessment.map((item) => `- ${item}`),
      '',
      'Teacher Notes:',
      ...sections.teacherNotes.map((item) => `- ${item}`),
    ].join('\n');
  }
}

export const openAIService = new OpenAIService();
export default openAIService;
