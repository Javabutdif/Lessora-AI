import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  AppError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  QuotaError,
  ExternalServiceError,
} from "../types/errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Known AppError subclasses — return their code and status directly
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      data: null,
      error: { code: err.code, message: err.message },
    });
  }

  // Zod validation → VALIDATION_ERROR
  if (err instanceof ZodError) {
    return res.status(400).json({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: err.flatten(),
      },
    });
  }

  // Fallback: unexpected server error
  const message =
    err instanceof Error ? err.message : "Unexpected server error";
  const statusCode = 500;

  console.error("[error]", message, err);

  return res.status(statusCode).json({
    data: null,
    error: {
      code: "SERVER_ERROR",
      message,
    },
  });
}
