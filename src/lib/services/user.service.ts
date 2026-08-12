import { User } from "../schemas/user.schema";
import { LessonPlan } from "../schemas/lesson.schema";
import {
  UpdateProfilePayload,
  UpdateSettingsPayload,
} from "../schemas/user.schema";

export async function getUserAnalytics(userId: string) {
  // Fetch user to get total tokens allocated
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Count total lesson plans created by the user
  const totalPlans = await LessonPlan.countDocuments({
    userId,
    generatedByAI: true,
  });

  // Calculate tokens used (each plan generation uses 1 credit)
  const totalTokens = 5; // Default allocation for free tier
  const tokensRemaining = user.aiResponseCredits ?? 0;
  const tokensUsed = totalPlans; // Each generation uses 1 token

  // Get recent activity (last 5 lesson plans)
  const recentPlans = await LessonPlan.find({
    userId,
    generatedByAI: true,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title subject createdAt")
    .lean();

  const recentActivity = recentPlans.map((plan) => ({
    title: plan.title,
    subject: plan.subject,
    date: plan.createdAt,
  }));

  return {
    totalTokens,
    tokensRemaining,
    tokensUsed,
    plansCreated: totalPlans,
    averageTokensPerPlan: totalPlans > 0 ? tokensUsed / totalPlans : 0,
    subscriptionStatus: "Active (Free Trial)",
    accountType: "Teacher Profile",
    recentActivity,
  };
}

export async function updateUserProfile(
  userId: string,
  data: UpdateProfilePayload,
) {
  // Check if email is being changed and if it's already taken
  if (data.email) {
    const existingUser = await User.findOne({
      email: data.email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new Error("Email is already in use by another account");
    }
  }

  // Update user profile
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      school: data.school,
      bio: data.bio,
    },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  // Return user data in the expected format
  const name = `${updatedUser.firstName} ${updatedUser.lastName}`.trim();

  return {
    user: {
      id: updatedUser._id.toString(),
      name,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      school: updatedUser.school,
      bio: updatedUser.bio,
      aiResponseCredits: updatedUser.aiResponseCredits,
    },
  };
}

export async function updateUserSettings(
  userId: string,
  settings: UpdateSettingsPayload,
) {
  // Update user settings
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      settings: {
        notifications: settings.notifications,
        language: settings.language || "en",
        theme: settings.theme || "light",
      },
    },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return {
    settings: updatedUser.settings || {
      notifications: { email: true },
      language: "en",
      theme: "light",
    },
  };
}

// Made with Bob
