import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
};

type AuthTokenPayload = {
  user?: AuthenticatedUser;
};

function getJwtSecret() {
  return process.env.JWT_SECRET || "lessora-dev-secret-change-me";
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication is required",
      },
    });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;

    if (!payload.user?.id) {
      throw new Error("Invalid token payload");
    }

    req.authUser = payload.user;
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
