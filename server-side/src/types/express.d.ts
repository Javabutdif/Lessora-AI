import { AuthenticatedUser } from "../middleware/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
    }
  }
}

export {};
