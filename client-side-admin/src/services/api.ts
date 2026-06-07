const DEFAULT_API_BASE = "http://localhost:4000";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;

// Token management for admin
function getAdminToken() {
  return localStorage.getItem("lessora-admin-token");
}

// Token management for regular users
function getUserToken() {
  return localStorage.getItem("lessora-user-token");
}

export function setUserToken(token: string | null) {
  if (token) {
    localStorage.setItem("lessora-user-token", token);
  } else {
    localStorage.removeItem("lessora-user-token");
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  useUserAuth = false,
): Promise<T> {
  const token = useUserAuth ? getUserToken() : getAdminToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("X-Client-Type", "web");
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (useUserAuth) {
      localStorage.removeItem("lessora-user-token");
      window.location.assign("/login");
    } else {
      localStorage.removeItem("lessora-admin-token");
      window.location.assign("/admin/login");
    }
    throw new Error("Session expired. Please sign in again.");
  }

  const payload = (await response.json()) as {
    data?: T;
    error?: { message?: string } | null;
  };

  if (!response.ok) {
    throw new Error(payload.error?.message || "Request failed");
  }

  return payload.data as T;
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Type": "web",
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = (await response.json()) as {
    data?: { token: string; user: { name: string; email: string } };
    error?: { message?: string } | null;
  };

  if (!response.ok) {
    throw new Error(payload.error?.message || "Login failed");
  }

  if (!payload.data?.token) {
    throw new Error("Invalid response from server");
  }

  localStorage.setItem("lessora-admin-token", payload.data.token);
  localStorage.setItem("lessora-admin-user", JSON.stringify(payload.data.user));

  return payload.data;
}

export async function fetchAdminStats() {
  return apiRequest<{
    totalUsers: number;
    activeUsers: number;
    totalLessonPlans: number;
    publishedLessonPlans: number;
    generatedLast7Days: number;
    generationRate: number;
  }>("/api/admin/stats");
}

export type DashboardMetrics = {
  activeUsers: number;
  totalLessonPlans: number;
  lastUpdated: string;
  timestamp: string;
};

export async function fetchDashboardMetrics() {
  return apiRequest<DashboardMetrics>("/api/admin/metrics/dashboard");
}

export async function fetchLandingMetrics() {
  const response = await fetch(`${API_BASE}/api/admin/metrics/landing`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Type": "web",
    },
  });

  const payload = (await response.json()) as {
    data?: Pick<
      DashboardMetrics,
      "activeUsers" | "totalLessonPlans" | "lastUpdated"
    >;
    error?: { message?: string } | null;
  };

  if (!response.ok || !payload.data) {
    throw new Error(payload.error?.message || "Unable to load landing metrics");
  }

  return payload.data;
}

export interface User {
  id: string;
  email: string;
  name: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastLoginAt?: string;
}

// ============================================
// USER AUTHENTICATION APIs
// ============================================

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

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Type": "web",
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = (await response.json()) as {
    data?: LoginResponse;
    error?: { message?: string } | null;
  };

  if (!response.ok) {
    throw new Error(payload.error?.message || "Login failed");
  }

  if (!payload.data?.token) {
    throw new Error("Invalid response from server");
  }

  setUserToken(payload.data.token);
  localStorage.setItem("lessora-user", JSON.stringify(payload.data.user));

  return payload.data;
}

export async function registerUser(data: RegisterPayload) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Type": "web",
    },
    body: JSON.stringify(data),
  });

  const payload = (await response.json()) as {
    message?: string;
    error?: { message?: string } | null;
  };

  if (!response.ok) {
    throw new Error(payload.error?.message || "Registration failed");
  }

  return payload.message || "Registration successful";
}

export function logoutUser() {
  setUserToken(null);
  localStorage.removeItem("lessora-user");
}

export function getCurrentUser(): AuthUser | null {
  const userStr = localStorage.getItem("lessora-user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as AuthUser;
  } catch {
    return null;
  }
}

// ============================================
// PASSWORD RESET APIs
// ============================================

export async function forgotPassword(email: string) {
  const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Type": "web",
    },
    body: JSON.stringify({ email }),
  });

  const payload = (await response.json()) as {
    success?: boolean;
    message?: string;
    error?: { message?: string } | null;
  };

  if (!response.ok) {
    throw new Error(
      payload.error?.message || payload.message || "Request failed",
    );
  }

  return payload.message || "Reset email sent";
}

export async function verifyResetToken(token: string) {
  const response = await fetch(
    `${API_BASE}/api/auth/verify-reset-token/${token}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Type": "web",
      },
    },
  );

  const payload = (await response.json()) as VerifyResetTokenResponse;

  if (!response.ok) {
    throw new Error(payload.message || "Invalid token");
  }

  return payload;
}

export async function resetPassword(token: string, newPassword: string) {
  const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Type": "web",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  const payload = (await response.json()) as ResetPasswordResponse;

  if (!response.ok) {
    throw new Error(payload.message || "Password reset failed");
  }

  return payload;
}

// ============================================
// LESSON PLAN APIs
// ============================================

export type LessonPlanTemplate =
  | "lessora-ai"
  | "deped-semi-detailed"
  | "detailed-lesson-plan"
  | "daily-lesson-log"
  | "matatag";

export type GenerateLessonPlanPayload = {
  title: string;
  subject: string;
  gradeLevel: string;
  duration: number;
  numberOfSessions: number;
  userDraftText?: string;
  templateNotes?: string;
  language: string;
  templateId?: LessonPlanTemplate;
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
};

export type LessonPlanHistoryDetail = LessonPlanHistoryItem & {
  document: LessonPlanDocument;
  draftText: string;
  model?: string;
};

export async function generateLessonPlan(payload: GenerateLessonPlanPayload) {
  return apiRequest<GenerateLessonPlanResponse>(
    "/api/ai/lesson-plan/generate",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true, // use user auth
  );
}

export async function listRecentLessonPlans() {
  return apiRequest<LessonPlanHistoryItem[]>(
    "/api/ai/lesson-plan/history",
    {
      method: "GET",
    },
    true, // use user auth
  );
}

export async function getLessonPlanById(lessonPlanId: string) {
  return apiRequest<LessonPlanHistoryDetail>(
    `/api/ai/lesson-plan/history/${lessonPlanId}`,
    {
      method: "GET",
    },
    true, // use user auth
  );
}

// ============================================
// ADMIN USER MANAGEMENT APIs
// ============================================

export async function fetchUsers() {
  return apiRequest<User[]>("/api/admin/users");
}

export async function updateUser(
  userId: string,
  data: { name?: string; email?: string; status?: string },
) {
  return apiRequest<User>(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function softDeleteUser(userId: string) {
  return apiRequest<{ success: boolean }>(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });
}
