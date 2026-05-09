export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

const API_BASE = "http://localhost:4000/api";

async function request<T>(path: string, body: unknown) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Request failed");
  }

  return payload.data as T;
}

export async function login(payload: LoginPayload) {
  return request<{ id: string; name: string; email: string }>(
    "/auth/login",
    payload,
  );
}

export async function register(payload: RegisterPayload) {
  return request<{ id: string; name: string; email: string }>(
    "/auth/register",
    payload,
  );
}
