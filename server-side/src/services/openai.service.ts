/**
 * OpenAI Service
 * Handles communication with OpenAI API for lesson plan generation
 * Currently a dummy implementation - integrate with real OpenAI API key in production
 */

import OpenAIConfig from "../config/openai.config";

export interface GenerateLessonPlanRequest {
  title: string;
  subject: string;
  gradeLevel: string;
  duration: number; // total duration in minutes
  numberOfSessions: number;
  userDraftText?: string; // User's initial text input
}

export interface GenerateLessonPlanResponse {
  success: boolean;
  draftText: string;
  sessions: Array<{
    sessionNumber: number;
    title: string;
    duration: number;
    objectives: string[];
    content: string;
    activities: string[];
  }>;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}

class OpenAIService {
  /**
   * Generate a lesson plan using OpenAI API
   * DUMMY IMPLEMENTATION - Replace with real API call when credentials are available
   */
  async generateLessonPlan(
    request: GenerateLessonPlanRequest,
  ): Promise<GenerateLessonPlanResponse> {
    console.log(`[OpenAI] Generating lesson plan: ${request.title}`);
    console.log(`[OpenAI] Using role: ${OpenAIConfig.role}`);

    // DUMMY RESPONSE - Replace this with real OpenAI API call
    if (!process.env.OPENAI_API_KEY) {
      console.warn(
        "[OpenAI] OPENAI_API_KEY not configured. Using dummy response.",
      );
    }

    const dummyDraft = `
Lesson Plan: ${request.title}
Subject: ${request.subject}
Grade Level: ${request.gradeLevel}
Total Duration: ${request.duration} minutes

${request.userDraftText ? `User Input: ${request.userDraftText}` : ""}

This is a dummy lesson plan. Replace this with real OpenAI API integration.
    `.trim();

    // Generate dummy sessions
    const sessionDuration = Math.floor(
      request.duration / request.numberOfSessions,
    );
    const dummySessions = Array.from(
      { length: request.numberOfSessions },
      (_, i) => ({
        sessionNumber: i + 1,
        title: `${request.subject} Session ${i + 1}`,
        duration: sessionDuration,
        objectives: [
          `Students will understand key concepts of ${request.subject}`,
          `Students will be able to apply ${request.subject} knowledge`,
        ],
        content: `Content for session ${i + 1} on ${request.subject}. This is placeholder content.`,
        activities: [
          `Activity 1: Discussion on ${request.subject}`,
          `Activity 2: Hands-on practice`,
          `Activity 3: Assessment`,
        ],
      }),
    );

    return {
      success: true,
      draftText: dummyDraft,
      sessions: dummySessions,
      model: OpenAIConfig.model,
      tokens: {
        prompt: 150,
        completion: 500,
        total: 650,
      },
    };
  }

  /**
   * Refine an existing lesson plan
   */
  async refineLessonPlan(
    currentDraftText: string,
    refinementRequest: string,
  ): Promise<GenerateLessonPlanResponse> {
    console.log("[OpenAI] Refining lesson plan");
    console.log(`[OpenAI] Refinement request: ${refinementRequest}`);

    // DUMMY IMPLEMENTATION
    return {
      success: true,
      draftText: `${currentDraftText}\n\nRefinement: ${refinementRequest}`,
      sessions: [],
      model: OpenAIConfig.model,
      tokens: {
        prompt: 200,
        completion: 300,
        total: 500,
      },
    };
  }

  /**
   * Validate that the request is within the lesson planning scope
   */
  validateRequest(request: string): {
    isValid: boolean;
    reason?: string;
  } {
    const prohibitedKeywords = [
      "code",
      "financial",
      "medical",
      "legal",
      "crypto",
      "investment",
    ];
    const lowerRequest = request.toLowerCase();

    for (const keyword of prohibitedKeywords) {
      if (lowerRequest.includes(keyword)) {
        return {
          isValid: false,
          reason: `Request contains prohibited topic: "${keyword}". I'm specialized only in lesson planning.`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Get configuration
   */
  getConfig() {
    return {
      role: OpenAIConfig.role,
      model: OpenAIConfig.model,
      constraints: OpenAIConfig.constraints,
      focusArea: OpenAIConfig.focusArea,
    };
  }
}

export const openAIService = new OpenAIService();
export default openAIService;
