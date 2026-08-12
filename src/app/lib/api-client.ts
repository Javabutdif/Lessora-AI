export const API_BASE = "";

// ============================================
// ADMIN AUTH
// ============================================

export function getAdminToken(): string | null {
  return null; // cookies are automatic in fetch
}

export function setAdminToken(_token: string | null) {
  // token stored in HttpOnly cookie via server
}

// ============================================
// ANONYMOUS SESSION MANAGEMENT
// ============================================

export function getSessionId(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("lessora-session-id") : null;
}

export async function ensureSession(): Promise<string> {
  let id = getSessionId();
  if (!id) {
    id = crypto.randomUUID();
  }
  const result = await apiRequest<{ sessionId: string; creditsRemaining: number }>(
    "/api/ai/session/ensure",
    { method: "POST", body: JSON.stringify({ sessionId: id }) },
  );
  if (typeof window !== "undefined") {
    localStorage.setItem("lessora-session-id", result.sessionId);
  }
  return result.sessionId;
}

export function invalidateSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("lessora-session-id");
  }
}

// ============================================
// API REQUEST HELPER
// ============================================

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const sessionId = getSessionId();
  const headers = new Headers(options.headers || {});

  if (sessionId) {
    headers.set("X-Session-Token", sessionId);
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("X-Client-Type", "web");

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });

  if (response.status === 401) {
    invalidateSession();
    throw new Error("Session expired. Please refresh the page.");
  }

  const payload = (await response.json()) as { data?: T; error?: { message?: string } | null };

  if (!response.ok) {
    throw new Error(payload.error?.message || "Request failed");
  }

  return payload.data as T;
}

// ============================================
// ADMIN APIs
// ============================================

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Client-Type": "web" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const payload = (await response.json()) as { data?: { token: string; user: { name: string; email: string } }; error?: { message?: string } | null };

  if (!response.ok) {
    throw new Error(payload.error?.message || "Login failed");
  }
  if (!payload.data?.token) throw new Error("Invalid response from server");

  if (typeof window !== "undefined") {
    localStorage.setItem("lessora-admin-user", JSON.stringify(payload.data.user));
  }
  return payload.data;
}

export async function fetchAdminStats() {
  return apiRequest<{ totalUsers: number; activeUsers: number; totalLessonPlans: number; publishedLessonPlans: number; generatedLast7Days: number; generationRate: number }>("/api/admin/stats");
}

export type DashboardMetrics = { activeUsers: number; totalLessonPlans: number; lastUpdated: string; timestamp: string };

export async function fetchDashboardMetrics() {
  return apiRequest<DashboardMetrics>("/api/admin/metrics/dashboard");
}

export async function fetchLandingMetrics() {
  const response = await fetch(`${API_BASE}/api/admin/metrics/landing`, {
    headers: { "Content-Type": "application/json", "X-Client-Type": "web" },
    credentials: "include",
  });
  const payload = (await response.json()) as { data?: Pick<DashboardMetrics, "totalLessonPlans" | "lastUpdated">; error?: { message?: string } | null };
  if (!response.ok || !payload.data) throw new Error(payload.error?.message || "Unable to load landing metrics");
  return payload.data;
}

export type SupportDonationTier = { id: string; amount: number; label: string; description: string; recommended?: boolean };
export type SupportDonationConfig = { title: string; description: string; currency: string; successMessage: string; tiers: SupportDonationTier[] };
export type SupportDonationCheckoutResponse = { checkoutUrl: string; referenceNumber: string };
export type SupportDonationStatus = { referenceNumber: string; status: "pending" | "paid" | "failed" | "canceled"; amount: number; currency: string; checkoutSessionId?: string; paymentId?: string; updatedAt: string };

export async function fetchSupportDonationConfig() {
  return apiRequest<SupportDonationConfig>("/api/support/donations/config");
}

export async function createSupportDonationCheckout(payload: { amount: number }) {
  return apiRequest<SupportDonationCheckoutResponse>("/api/support/donations/checkout", { method: "POST", body: JSON.stringify(payload) });
}

export async function fetchSupportDonationStatus(referenceNumber: string) {
  return apiRequest<SupportDonationStatus>(`/api/support/donations/${encodeURIComponent(referenceNumber)}`);
}

export interface User { id: string; email: string; name: string; status: "active" | "inactive" | "pending"; createdAt: string; lastLoginAt?: string; }

// ============================================
// LESSON PLAN APIs
// ============================================

export type LessonPlanTemplate = "lessora-ai" | "deped-semi-detailed" | "detailed-lesson-plan" | "daily-lesson-log" | "matatag";
export type GenerateLessonPlanPayload = { title: string; subject: string; gradeLevel: string; duration: number; numberOfSessions: number; userDraftText?: string; templateNotes?: string; language: string; activityPreferences?: string[]; activityPreferenceNotes?: string; templateId?: LessonPlanTemplate };
export type LessonPlanDocumentBlock = { type: "heading"; level: 1 | 2 | 3; text: string } | { type: "paragraph"; text: string } | { type: "list"; style: "bullet" | "numbered"; items: string[] };
export type LessonPlanDocument = { type: "lesson_plan_document"; format: "json"; version: 1; title: string; blocks: LessonPlanDocumentBlock[]; exportTargets: string[] };
export type GeneratedLessonPlanSections = { title: string; subject: string; gradeLevel: string; duration: string; lessonOverview: string; learningObjectives: string[]; materials: string[]; procedure: string[]; assessment: string[]; teacherNotes: string[] };
export type GenerateLessonPlanResponse = { success: boolean; lessonPlanId: string; document: LessonPlanDocument; draftText: string; sections: GeneratedLessonPlanSections; sessions: Array<{ sessionNumber: number; title: string; duration: number; objectives: string[]; content: string; activities: string[] }>; model: string; role: string; remainingResponses: number; tokens: { prompt: number; completion: number; total: number } };
export type LessonPlanHistoryItem = { id: string; title: string; subject: string; gradeLevel: string; totalDuration: number; createdAt: string; updatedAt: string };
export type LessonPlanHistoryDetail = LessonPlanHistoryItem & { document: LessonPlanDocument; draftText: string; model?: string; templateId?: LessonPlanTemplate };
export type PublicLessonPlan = LessonPlanHistoryItem;
export type AdminLessonPlanHistoryItem = LessonPlanHistoryItem & { createdBy: { id: string; name: string; email: string } };
export type SessionInfo = { creditsRemaining: number; isAnonymous: boolean };

export async function generateLessonPlan(payload: GenerateLessonPlanPayload) {
  return apiRequest<GenerateLessonPlanResponse>("/api/ai/lesson-plan/generate", { method: "POST", body: JSON.stringify(payload) });
}

export async function listRecentLessonPlans() {
  return apiRequest<LessonPlanHistoryItem[]>("/api/ai/lesson-plan/history");
}

export async function getLessonPlanById(lessonPlanId: string) {
  return apiRequest<LessonPlanHistoryDetail>(`/api/ai/lesson-plan/history/${lessonPlanId}`);
}

export async function listPublicLessonPlans() {
  return apiRequest<PublicLessonPlan[]>("/api/ai/lesson-plan/public");
}

export async function getPublicLessonPlanById(lessonPlanId: string) {
  return apiRequest<LessonPlanHistoryDetail>(`/api/ai/lesson-plan/public/${lessonPlanId}`);
}

export async function getSessionInfo(): Promise<SessionInfo> {
  return apiRequest<SessionInfo>("/api/ai/session/me");
}

export async function fetchAdminLessonPlans() {
  return apiRequest<AdminLessonPlanHistoryItem[]>("/api/admin/lesson-plans");
}

// ============================================
// ADMIN USER MANAGEMENT
// ============================================

export async function fetchUsers() {
  return apiRequest<User[]>("/api/admin/users");
}

export async function updateUser(userId: string, data: { name?: string; email?: string; status?: string }) {
  return apiRequest<User>(`/api/admin/users/${userId}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function softDeleteUser(userId: string) {
  return apiRequest<{ success: boolean }>(`/api/admin/users/${userId}`, { method: "DELETE" });
}

// ============================================
// REFINEMENT
// ============================================

export type RefineLessonPlanPayload = { lessonPlanId: string; selectedSections: string[]; refinementRequest: string };
export type RefineLessonPlanResponse = GenerateLessonPlanResponse;

export async function refineLessonPlan(payload: RefineLessonPlanPayload) {
  return apiRequest<RefineLessonPlanResponse>("/api/ai/lesson-plan/refine", { method: "POST", body: JSON.stringify(payload) });
}
