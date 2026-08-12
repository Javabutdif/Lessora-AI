import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginPayload } from "../schemas/auth.schema";
import { AdminUser } from "../schemas/admin.schema";

const JWT_EXPIRES_IN = "1h";

type AdminAuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin";
};

function getJwtSecret() {
  return process.env.JWT_SECRET || "lessora-dev-secret-change-me";
}

function signAdminToken(user: AdminAuthUser) {
  return jwt.sign({ user }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export async function loginAdmin({ email, password }: LoginPayload) {
  const admin = await AdminUser.findOne({ email }).select("+passwordHash");

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  if (!admin.isActive) {
    throw new Error("Account disabled");
  }

  const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const name = `${admin.firstName} ${admin.lastName}`.trim();
  const authUser: AdminAuthUser = {
    id: admin._id.toString(),
    name,
    email: admin.email,
    role: "admin",
  };

  const token = signAdminToken(authUser);

  admin.lastLogin = new Date();
  await admin.save();

  return {
    token,
    user: authUser,
  };
}
