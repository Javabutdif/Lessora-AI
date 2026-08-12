export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super("NOT_FOUND", `${resource} not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super("AUTH_ERROR", message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super("FORBIDDEN", message, 403);
  }
}

export class QuotaError extends AppError {
  constructor(message = "No AI responses remaining") {
    super("QUOTA_EXCEEDED", message, 426);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, cause?: string) {
    super(
      "EXTERNAL_ERROR",
      `Service ${service} unavailable${cause ? `: ${cause}` : ""}`,
      503,
    );
  }
}

export function requireAuth(user: unknown): asserts user {
  if (!user) throw new AuthenticationError();
}

export function assertDefined<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) {
    throw new NotFoundError(message.split(" ")[0]);
  }
  return value;
}
