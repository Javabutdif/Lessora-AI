import { AuthenticatedUser, AnonymousSession } from "../middleware/auth-or-session.middleware";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
      anonSession?: AnonymousSession;
      isAnonymous?: boolean;
    }
  }
}

export {};
