import { randomUUID } from "crypto";
import { LoginPayload, RegisterPayload } from "../schemas/auth.schema";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
}

const users: UserRecord[] = [];

export async function registerUser({ name, email, password }: RegisterPayload) {
  const existing = users.find((user) => user.email === email.toLowerCase());
  if (existing) {
    throw new Error("Account already exists for this email");
  }

  const user: UserRecord = {
    id: randomUUID(),
    name,
    email: email.toLowerCase(),
    password,
  };

  users.push(user);
  return { id: user.id, name: user.name, email: user.email };
}

export async function loginUser({ email, password }: LoginPayload) {
  const user = users.find((record) => record.email === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  return { id: user.id, name: user.name, email: user.email };
}
