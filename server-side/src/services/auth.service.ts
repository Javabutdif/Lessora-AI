import { LoginPayload, RegisterPayload } from "../schemas/auth.schema";
import { User } from "../schemas/user.schema";
import bcrypt from "bcryptjs";

export async function registerUser({ name, email, password }: RegisterPayload) {
  const emailLower = email.toLowerCase();
  const existing = await User.findOne({ email: emailLower });
  
  if (existing) {
    throw new Error("Account already exists for this email");
  }

  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  const username = emailLower.split("@")[0] + Math.floor(Math.random() * 10000);

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: emailLower,
    username,
    passwordHash,
    firstName,
    lastName,
   
  });

  return { id: user._id.toString(), name, email: user.email };
}

export async function loginUser({ email, password }: LoginPayload) {
  const emailLower = email.toLowerCase();
  const user = await User.findOne({ email: emailLower }).select("+passwordHash");
  
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const name = `${user.firstName} ${user.lastName}`.trim();
  return { id: user._id.toString(), name, email: user.email };
}
