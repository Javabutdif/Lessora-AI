import * as Application from "expo-application";
export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  school?: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export type VerifyResetTokenResponse = {
  success: boolean;
  message: string;
  expiresAt: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  aiResponseCredits?: number;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type LessonPlanTemplate = "lessora-ai" | "deped-semi-detailed";

export type GenerateLessonPlanPayload = {
  title: string;
  subject: string;
  gradeLevel: string;
  duration: number;
  numberOfSessions: number;
  userDraftText?: string;
  templateNotes?: string;
  language?: string;
  templateId?: LessonPlanTemplate;
};

export type GeneratedLessonPlanSections = {
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

export type LessonPlanDocument = {
  type: "lesson_plan_document";
  format: "json";
  version: 1;
  title: string;
  blocks: LessonPlanDocumentBlock[];
  exportTargets: string[];
};

export type GenerateLessonPlanResponse = {
  success: boolean;
  lessonPlanId: string;
  document: LessonPlanDocument;
  draftText: string;
  sections: GeneratedLessonPlanSections;
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
};

export type LessonPlanHistoryItem = {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
  templateId?: LessonPlanTemplate;
};

export type LessonPlanHistoryDetail = LessonPlanHistoryItem & {
  document: LessonPlanDocument;
  draftText: string;
  model?: string;
  templateId?: LessonPlanTemplate;
};

export type RefineLessonPlanPayload = {
  lessonPlanId: string;
  selectedSections: string[];
  refinementRequest: string;
};

export type RefineLessonPlanResponse = GenerateLessonPlanResponse;

export type UserAnalytics = {
  totalTokens: number;
  tokensRemaining: number;
  tokensUsed: number;
  plansCreated: number;
  subscriptionStatus: string;
  accountType: string;
};

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  email: string;
  school?: string;
  bio?: string;
};

export type UpdateSettingsPayload = {
  notifications: {
    email: boolean;
  };
  language: string;
  theme: string;
};

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE?.trim() ||
  "https://worthy-joby-psits-fd575fc8.koyeb.app/api";
type RequestLoadingListener = (activeRequestCount: number) => void;
let authToken: string | null = null;

const requestLoadingListeners = new Set<RequestLoadingListener>();
let activeRequestCount = 0;

function emitRequestLoading() {
  requestLoadingListeners.forEach((listener) => listener(activeRequestCount));
}

export function subscribeToRequestLoading(listener: RequestLoadingListener) {
  requestLoadingListeners.add(listener);
  listener(activeRequestCount);

  return () => {
    requestLoadingListeners.delete(listener);
  };
}

export function setAuthToken(token: string | null) {
  authToken = token;
}

function getJsonHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Client-Type": "mobile",
    "X-App-Version": Application.nativeApplicationVersion ?? "0.0.0",
    "X-Build-Number": Application.nativeBuildVersion ?? "0",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

async function trackRequest<T>(request: () => Promise<T>): Promise<T> {
  activeRequestCount += 1;
  emitRequestLoading();

  try {
    return await request();
  } finally {
    activeRequestCount = Math.max(0, activeRequestCount - 1);
    emitRequestLoading();
  }
}

async function requestData<T>(path: string, body: unknown): Promise<T> {
  return trackRequest(async () => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(body),
    });

    const payload = await response.json();

    if (!response.ok) {
      if (response.status === 426) {
        throw new Error("UPDATE_REQUIRED");
      }

      throw new Error(payload?.error?.message || "Request failed");
    }

    return payload.data;
  });
}

async function requestGetData<T>(path: string): Promise<T> {
  return trackRequest(async () => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: getJsonHeaders(),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error?.message || "Request failed");
    }

    return payload.data;
  });
}

async function requestMessage(path: string, body: unknown): Promise<string> {
  return trackRequest(async () => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(body),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error?.message || "Request failed");
    }

    return payload.message;
  });
}

export async function login(payload: LoginPayload) {
  return requestData<LoginResponse>("/auth/login", payload);
}

export async function register(payload: RegisterPayload) {
  return requestMessage("/auth/register", payload);
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  return requestMessage("/auth/forgot-password", payload);
}

export async function verifyResetToken(token: string) {
  return trackRequest(async () => {
    const response = await fetch(
      `${API_BASE}/auth/verify-reset-token/${token}`,
      {
        method: "GET",
        headers: getJsonHeaders(),
      },
    );

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.message || "Invalid token");
    }

    return payload as VerifyResetTokenResponse;
  });
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return trackRequest(async () => {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData?.message || "Password reset failed");
    }

    return responseData as ResetPasswordResponse;
  });
}

export async function generateLessonPlan(payload: GenerateLessonPlanPayload) {
  return requestData<GenerateLessonPlanResponse>(
    "/ai/lesson-plan/generate",
    payload,
  );
}

export async function listRecentLessonPlans() {
  return requestGetData<LessonPlanHistoryItem[]>("/ai/lesson-plan/history");
}

export async function getLessonPlanById(lessonPlanId: string) {
  return requestGetData<LessonPlanHistoryDetail>(
    `/ai/lesson-plan/history/${lessonPlanId}`,
  );
}

export async function refineLessonPlan(payload: RefineLessonPlanPayload) {
  return requestData<RefineLessonPlanResponse>("/ai/lesson-plan/refine", payload);
}

export async function getUserAnalytics() {
  return requestGetData<UserAnalytics>("/user/analytics");
}

export async function updateUserProfile(payload: UpdateProfilePayload) {
  return trackRequest(async () => {
    const response = await fetch(`${API_BASE}/user/profile`, {
      method: "PUT",
      headers: getJsonHeaders(),
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData?.error?.message || "Request failed");
    }

    return responseData.data;
  });
}

export async function updateUserSettings(payload: UpdateSettingsPayload) {
  return trackRequest(async () => {
    const response = await fetch(`${API_BASE}/user/settings`, {
      method: "PUT",
      headers: getJsonHeaders(),
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData?.error?.message || "Request failed");
    }

    return responseData.data;
  });
}
