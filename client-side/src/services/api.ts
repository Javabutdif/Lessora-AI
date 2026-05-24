export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

const API_BASE = "https://worthy-joby-psits-fd575fc8.koyeb.app/api";

async function requestData<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Request failed");
  }

  return payload.data;
}

async function requestMessage(path: string, body: unknown): Promise<string> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Request failed");
  }

  return payload.message;
}

export async function login(payload: LoginPayload) {
  return requestData<LoginResponse>("/auth/login", payload);
}

export async function register(payload: RegisterPayload) {
  return requestMessage("/auth/register", payload);
}
