import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Session } from "../schemas/session.schema";
import { AppConfig } from "../schemas/app.config.schema";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type AnonymousSession = {
  _id: string;
  sessionId: string;
  ip: string;
  aiResponseCredits: number;
};

type AuthTokenPayload = {
  user?: AuthenticatedUser;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL: JWT_SECRET environment variable is not set. Server cannot start securely.");
    process.exit(1);
  }
  return secret;
}

export function authenticateToken(req: Request) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new Error("Missing token");
  }

  const payload = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;

  if (!payload.user?.id) {
    throw new Error("Invalid token payload");
  }

  return payload.user;
}

async function authenticateSession(req: Request): Promise<AnonymousSession | null> {
  const sessionId = req.headers["x-session-token"] as string | undefined;

  if (!sessionId) {
    return null;
  }

  const session = await Session.findOne({ sessionId }).lean();

  if (!session) {
    return null;
  }

  // Update last activity
  await Session.updateOne(
    { _id: session._id },
    { $set: { lastActivityAt: new Date() } },
  );

  return {
    _id: session._id.toString(),
    sessionId: session.sessionId,
    ip: session.ip || "",
    aiResponseCredits: session.aiResponseCredits,
  };
}

export async function requireAuthOrSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Try JWT first (registered users)
  try {
    req.authUser = authenticateToken(req);
    req.isAnonymous = false;
    return next();
  } catch {
    // JWT failed or missing, try session token
  }

  // Fall back to anonymous session
  const session = await authenticateSession(req);

  if (!session) {
    return res.status(401).json({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired session",
      },
    });
  }

  req.anonSession = session;
  req.isAnonymous = true;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    req.authUser = authenticateToken(req);
    next();
  } catch {
    return res.status(401).json({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired session",
      },
    });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const authUser = authenticateToken(req);

    if (authUser.role !== "admin") {
      return res.status(403).json({
        data: null,
        error: {
          code: "FORBIDDEN",
          message: "Admin access is required",
        },
      });
    }

    req.authUser = authUser;
    next();
  } catch {
    return res.status(401).json({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired session",
      },
    });
  }
}

export async function checkAppVersion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const clientType = req.headers["x-client-type"];
  const version = req.headers["x-app-version"];

  if (clientType === "web") {
    return next();
  }

  const buildNumber = Number(req.headers["x-build-number"] || 0);
  console.log({
    clientType,
    buildNumber: req.header("X-Build-Number"),
    version,
  });
  const config = await AppConfig.findOne({
    key: "app_config",
  }).lean();

  if (!config) {
    return next();
  }

  if (
    buildNumber < config.minimumBuildNumber ||
    version !== config.latestVersion
  ) {
    return res.status(426).json({
      success: false,
      code: "UPDATE_REQUIRED",
      message: `Please update Lessora AI to version ${config.latestVersion}`,
      latestVersion: config.latestVersion,
    });
  }

  next();
}
