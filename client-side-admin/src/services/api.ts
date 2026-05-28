const DEFAULT_API_BASE = "http://localhost:4000";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;

function getToken() {
  return localStorage.getItem("lessora-admin-token");
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("lessora-admin-token");
    window.location.assign("/login");
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
