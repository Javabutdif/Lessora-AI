import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppConfig } from "../schemas/app.config.schema";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthTokenPayload = {
  user?: AuthenticatedUser;
};

function getJwtSecret() {
  return process.env.JWT_SECRET || "lessora-dev-secret-change-me";
}

function authenticateToken(req: Request) {
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
