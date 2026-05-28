import { LoginPayload, RegisterPayload } from "../schemas/auth.schema";
import { User } from "../schemas/user.schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "1h";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  aiResponseCredits?: number;
};

function getJwtSecret() {
  return process.env.JWT_SECRET || "lessora-dev-secret-change-me";
}

function signAuthToken(user: AuthUser) {
  return jwt.sign({ user }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export async function registerUser({ name, email, password }: RegisterPayload) {
  const existing = await User.findOne({ email });

  if (existing) {
    throw new Error("Account already exists for this email");
  }

  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  const username = email.split("@")[0] + Math.floor(Math.random() * 10000);

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    email,
    username,
    passwordHash,
    firstName,
    lastName,
  });

  return true;
}

export async function loginUser({ email, password }: LoginPayload) {
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const name = `${user.firstName} ${user.lastName}`.trim();
  const authUser = {
    id: user._id.toString(),
    name,
    email: user.email,
    role: user.role,
    aiResponseCredits: user.aiResponseCredits ?? 5,
  };
  const token = signAuthToken(authUser);

  user.lastLogin = new Date();
  await user.save();

  return { token, user: authUser };
}
