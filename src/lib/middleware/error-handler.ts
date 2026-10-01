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

export interface ApiErrorResponse {
  data: null;
  error: { code: string; message: string; details?: unknown };
}

export function handleApiError(err: unknown): { status: number; body: ApiErrorResponse } {
  if (err instanceof AppError) {
    return {
      status: err.statusCode,
      body: { data: null, error: { code: err.code, message: err.message } },
    };
  }

  if (err instanceof ZodError) {
    return {
      status: 400,
      body: {
        data: null,
        error: { code: "VALIDATION_ERROR", message: "Request validation failed", details: err.flatten() },
      },
    };
  }

  // Log the real cause server-side; never echo driver/provider internals to the client
  console.error("[error]", err instanceof Error ? err.message : err, err);

  return {
    status: 500,
    body: { data: null, error: { code: "SERVER_ERROR", message: "Unexpected server error" } },
  };
}
