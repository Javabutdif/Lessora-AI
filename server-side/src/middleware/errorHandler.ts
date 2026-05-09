import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
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

  const message =
    err instanceof Error ? err.message : "Unexpected server error";
  const status =
    message === "Invalid email or password" ||
    message.includes("Account already exists")
      ? 400
      : 500;

  return res.status(status).json({
    data: null,
    error: {
      code: status === 500 ? "SERVER_ERROR" : "BAD_REQUEST",
      message,
    },
  });
}
