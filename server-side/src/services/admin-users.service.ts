import { User, IUser } from "../schemas/user.schema";

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastLoginAt?: string;
}

function mapUserToResponse(user: IUser): UserResponse {
  const status = !user.isActive
    ? "inactive"
    : user.isVerified
      ? "active"
      : "pending";

  return {
    id: user._id.toString(),
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    status,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLogin?.toISOString(),
  };
}

export async function getAllUsers(): Promise<UserResponse[]> {
  const users = await User.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 });

  return users.map(mapUserToResponse);
}

export async function getUserById(userId: string): Promise<UserResponse> {
  const user = await User.findById(userId).select("-passwordHash");

  if (!user) {
    throw new Error("User not found");
  }

  return mapUserToResponse(user);
}

export async function updateUser(
  userId: string,
  data: {
    name?: string;
    email?: string;
    status?: string;
  },
): Promise<UserResponse> {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Update name (split into firstName and lastName)
  if (data.name) {
    const nameParts = data.name.trim().split(/\s+/);
    user.firstName = nameParts[0];
    user.lastName = nameParts.slice(1).join(" ") || "-";
  }

  // Update email
  if (data.email) {
    const existingUser = await User.findOne({
      email: data.email.toLowerCase(),
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new Error("Email already in use");
    }
    user.email = data.email.toLowerCase();
  }

  // Update status (active/inactive/pending)
  if (data.status) {
    if (data.status === "active") {
      user.isActive = true;
      user.isVerified = true;
    } else if (data.status === "inactive") {
      user.isActive = false;
    } else if (data.status === "pending") {
      user.isActive = true;
      user.isVerified = false;
    }
  }

  await user.save();

  return mapUserToResponse(user);
}

export async function softDeleteUser(userId: string): Promise<void> {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.isActive = false;
  await user.save();
}
