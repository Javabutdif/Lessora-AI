# Anonymous Access — No Account Required

**Date:** 2026-06-07  
**Status:** Implemented  
**Slug:** anonymous-access

---

## Problem

Teachers had to create an account before generating a single lesson plan. This created high friction and discouraged exploration. Additionally, generated plans were private with no public discovery mechanism.

---

## Solution

Removed user account requirements for lesson plan generation. Anyone can now:

1. Land on the page
2. Generate a lesson plan (3 free credits/day, no signup)
3. View their plan history (session-based, browser-local)
4. Refine plans in-place
5. Browse all public plans from other teachers

Registered accounts still work for teachers who want persistent cross-device history.

---

## Architecture Changes

### Session Model (`server-side/src/schemas/session.schema.ts`)

Anonymous users are identified by a `sessionId` (UUIDv4) stored in `localStorage`. Each session:

- Starts with 3 AI generation credits
- Credits reset daily at midnight (PH timezone) via cron job
- Plans are auto-published (`isPublic: true`)
- Session expires after 60 days of inactivity

### Authentication Middleware (`server-side/src/middleware/auth-or-session.middleware.ts`)

`requireAuthOrSession` resolves identity in priority order:

1. `Authorization: Bearer <JWT>` → registered user (`req.authUser`)
2. `X-Session-Token: <sessionId>` → anonymous session (`req.anonSession`)
3. Neither → 401 UNAUTHORIZED

Admin routes (`/api/admin/*`) continue to use `requireAdmin` (JWT only).

### Lesson Plan Schema Updates (`server-side/src/schemas/lesson.schema.ts`)

- `userId` is now optional (nullable)
- New `sessionId` field for anonymous ownership
- Partial index for public plan browsing: `{ isPublic: true, createdAt: -1 }`

### Rate Limits

| Route | Limit | Scope |
|-------|-------|-------|
| `/api/ai/lesson-plan/generate` | 10/hour per IP | Anonymous |
| `/api/ai/lesson-plan/refine` | 20/hour per IP | Anonymous |
| `/api/ai/*` (all) | 30/min per IP | All users |
| `/api/auth/*` | 20/min per IP | Auth writes |

### New Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/ai/lesson-plan/public` | None | Browse 20 latest public plans |
| GET | `/api/ai/session/me` | Session token | Get current session credits |

---

## Client-Side Changes

### Removed
- Login, Register, Forgot Password, Reset Password pages
- All user auth functions from `api.ts` (`loginUser`, `registerUser`, `logoutUser`, `getCurrentUser`, etc.)
- "Download App" CTA on landing page
- Android app section on landing page

### Added
- `GuestRoute` component — unconditional route wrapper (replaces `UserProtectedRoute`)
- `DiscoverPage` — browse all public lesson plans with subject/grade filters
- Session management in `api.ts` — `getSessionId()`, `ensureSession()`, `invalidateSession()`

### Updated
- All teacher pages use `GuestRoute` instead of `UserProtectedRoute`
- Landing page CTAs: "Generate Free Lesson Plan" + "Browse Plans"
- Dashboard redirects to `/generate`
- Profile/Analytics show session-level info only

---

## Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Session token theft via XSS | localStorage (not cookie) — same-origin only; low-value target (anonymous, 3 credits) |
| Spam generation | 10 gen/hour per IP + 30/min global rate limit + content validation |
| Session enumeration | UUIDv4 tokens (32 random bytes), not sequential |
| Existing user data leakage | Plans query by userId OR sessionId — no cross-contamination |
| Plan privacy | Anonymous plans are public by default; registered user plans remain private unless explicitly shared |

---

## Data Migration

No migration needed. Existing lesson plans with `userId` remain accessible to their owners via JWT. New anonymous plans use `sessionId` instead. Both coexist in the same collection.

---

## Files Changed

### Server (9 files)
- `src/schemas/session.schema.ts` — new
- `src/middleware/auth-or-session.middleware.ts` — new
- `src/utils/session-utils.ts` — new
- `src/services/session-credit-refresh.scheduler.ts` — new
- `src/schemas/lesson.schema.ts` — modified
- `src/services/openai.service.ts` — modified
- `src/controllers/ai.controller.ts` — modified
- `src/routes/ai.routes.ts` — modified
- `src/app.ts` — modified
- `src/types/express.d.ts` — modified

### Client (14 files)
- `src/pages/DiscoverPage.tsx` — new
- `src/components/GuestRoute.tsx` — new
- `src/services/api.ts` — rewritten
- `src/App.tsx` — modified
- `src/pages/LandingPage.tsx` — modified
- `src/pages/GeneratePlanPage.tsx` — modified
- `src/pages/HistoryPage.tsx` — modified
- `src/pages/PreviewPage.tsx` — modified
- `src/pages/RefineLessonPage.tsx` — modified (bug fix + auth removal)
- `src/pages/DashboardPage.tsx` — simplified
- `src/pages/ProfilePage.tsx` — simplified
- `src/pages/AnalyticsPage.tsx` — simplified
- Deleted: `UserRegisterPage.tsx`, `UserLoginPage.tsx`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`, `ResetPasswordSuccessPage.tsx`, `UserProtectedRoute.tsx`
