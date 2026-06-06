# User Auth, Credits & Admin Features Task Brief

## Summary

- task: implement three interconnected features: forgot password, daily AI credit refresh, and admin dashboard metrics
- requested outcomes:
  1. Forgot password recovery flow for users on mobile and the web client with server-side logic
  2. Daily AI credit refresh system with scheduled start next week (June 9, 2026)
  3. Admin dashboard and landing page display of active users count and total lesson plans generated
- primary constraints: scheduled credit refresh must begin next week; all changes must maintain existing auth context

## Linked artifacts

- spec: `docs/specs/2026-06-02-forgot-password-flow.md`
- spec: `docs/specs/2026-06-02-daily-credit-refresh.md`
- spec: `docs/specs/2026-06-02-admin-dashboard-metrics.md`
- plan: `docs/plans/2026-06-02-forgot-password-flow.md`
- plan: `docs/plans/2026-06-02-daily-credit-refresh.md`
- plan: `docs/plans/2026-06-02-admin-dashboard-metrics.md`

## Current state

- status: complete
- current owner: development
- next action: run manual database/browser verification against a configured local backend
- blockers: none identified
- completed:
  - ✅ Resend email service with HTML template (admin dashboard design, custom domain)
  - ✅ User schema extended with reset token fields (hashed bcrypt tokens, 24h expiration)
  - ✅ Password utilities (token generation, hashing, verification, validation)
  - ✅ Auth controller with 3 password reset endpoints (rate-limited at 3/hour/email)
  - ✅ Auth routes registered (`/forgot-password`, `/verify-reset-token/:token`, `/reset-password`)
  - ✅ Client-side password reset screens (mobile): ForgotPasswordScreen, ResetPasswordScreen, PasswordResetSuccessScreen
  - ✅ Web user password reset pages: ForgotPasswordPage, ResetPasswordPage, ResetPasswordSuccessPage
  - ✅ Navigation integration with proper route params and redirects
  - ✅ TypeScript validation passing for all client and server components

## Progress checklist

### Forgot Password (Complete)

- [x] Create Resend email service with custom domain (noreply.lessora@ajgenabio.me)
- [x] Create HTML email template (matches admin dashboard design/colors, dark theme #040b18, blue #60a5fa)
- [x] Extend User schema with reset tokens (passwordResetToken, passwordResetTokenExpires)
- [x] Implement password utilities (generateResetToken, hashResetToken, verifyResetToken, validatePassword)
- [x] Implement forgot password endpoint with rate limiting (max 3/hour/email)
- [x] Implement verify reset token endpoint (GET /api/auth/verify-reset-token/:token)
- [x] Implement reset password endpoint with validation (POST /api/auth/reset-password)
- [x] Create client-side API functions (forgotPassword, verifyResetToken, resetPassword)
- [x] Create mobile forgot password screens (ForgotPasswordScreen, ResetPasswordScreen, PasswordResetSuccessScreen)
- [x] Integrate mobile password reset into navigation (RootStackParamList, AppNavigator routes)
- [x] Link "Forgot Password?" on LoginScreen to ForgotPasswordScreen
- [x] Create web user forgot password pages (ForgotPasswordPage, ResetPasswordPage, ResetPasswordSuccessPage)
- [x] Integrate web user password reset into App.tsx routing (/forgot-password, /reset-password, /reset-password-success)
- [x] Redirect legacy /admin reset routes to the user reset routes
- [x] Link "Forgot password?" on UserLoginPage to ForgotPasswordPage
- [x] Validate TypeScript compilation (mobile and admin)

### Daily Credit Refresh (Pending)

- [x] Create scheduler service (node-cron integration)
- [x] Implement startup date check (delay if before June 9, 2026)
- [x] Register scheduler on app startup in app.ts
- [x] Add manual date/refresh hooks for local testing
- [ ] Verify database credit reset behavior

### Admin Dashboard Metrics (Implementation Complete)

- [x] Create backend GET /api/admin/metrics/dashboard endpoint
- [x] Create public GET /api/admin/metrics/landing endpoint
- [x] Implement aggregation queries (activeUsers count, totalLessonPlans count)
- [x] Create MetricCard reusable component
- [x] Integrate metrics display on admin dashboard page
- [x] Integrate metrics display on client-side-admin landing page
- [x] Add React Query with 60-second refetch interval

## Scope

- in scope:
  - Server-side: password reset token generation, email delivery, token validation
  - Server-side: daily scheduler for credit refresh with June 9 start date
  - Server-side: new endpoints for dashboard metrics (active users, lesson plan count)
  - Client: forgot password form, password reset UI flow
  - Admin-hosted web client: user forgot password form, user password reset UI, metrics display
- out of scope:
  - Email template design (use existing template pattern)
  - Advanced password security policies
  - Credit usage analytics (beyond basic counts)
  - Credit refresh admin endpoints or monitoring

## File ownership

- planner: unassigned
- implementer: unassigned
- reviewer: unassigned
- tester: unassigned

## Relevant files

### Server-side

- `server-side/src/schemas/user.schema.ts`
- `server-side/src/routes/auth.routes.ts`
- `server-side/src/controllers/auth.controller.ts`
- `server-side/src/services/resend.service.ts`
- `server-side/src/emails/reset-password.template.ts`
- `server-side/src/services/credit-refresh.scheduler.ts`
- `server-side/src/services/admin.service.ts`
- `server-side/src/app.ts`
- `server-side/src/routes/admin.routes.ts`
- `server-side/src/controllers/admin.controller.ts`

### Client-side

- `client-side/src/screens/`
- `client-side/src/navigation/`
- `client-side/src/services/api.ts`

### Client-side-admin

- `client-side-admin/src/pages/`
- `client-side-admin/src/pages/LandingPage.tsx`
- `client-side-admin/src/services/api.ts`
- `client-side-admin/src/components/MetricCard.tsx`
- `client-side-admin/src/components/MetricCard.module.css`
- `client-side-admin/src/main.tsx`

## Acceptance criteria

### Forgot Password Feature

- criterion 1: server generates secure reset tokens with expiration
- criterion 2: reset token is sent via email to user
- criterion 3: client-side form validates and accepts new password
- criterion 4: web user form validates and accepts new password
- criterion 5: token expires after 24 hours
- criterion 6: used tokens cannot be reused

### Daily Credit Refresh

- criterion 1: scheduler resets all active users to 5 credits daily
- criterion 2: refresh starts on June 9, 2026 at midnight UTC
- criterion 3: credits reset to max, not accumulate
- criterion 4: scheduler runs reliably every 24 hours

### Admin Dashboard Metrics

- criterion 1: dashboard displays count of active users
- criterion 2: dashboard displays total lesson plans generated
- criterion 3: metrics update in real-time or near real-time
- criterion 4: endpoints return accurate counts

## Validation

- command 1: `npx tsc --noEmit` (both server-side and client projects)
- command 2: Unit tests for password reset logic
- command 3: Manual test of credit refresh (trigger scheduler, verify database)
- command 4: Manual testing of email delivery (use dev email service)

## Risks or dependencies

- risk 1: email service reliability for password reset delivery
- risk 2: June 9 start date must be verified before deployment
- dependency 1: existing email service infrastructure
- dependency 2: existing auth context must remain compatible
- dependency 3: User schema has `isActive` field

## Handoff notes

### Forgot Password Implementation Details

- ✅ Resend service configured with custom domain (noreply.lessora@ajgenabio.me, sender: "Lessora AI <noreply.lessora@ajgenabio.me>")
- ✅ Email template created matching admin dashboard design (dark theme #040b18, blue accents #60a5fa, gradient buttons #60a5fa→#3b82f6)
- ✅ Password reset tokens: 64-char hex (crypto.randomBytes(32)), hashed with bcrypt before storage, never plaintext in DB
- ✅ Token expiration: 24 hours from generation
- ✅ Rate limiting: 3 requests per email per hour (1-hour rolling window)
- ✅ Password validation: 8+ chars, uppercase, lowercase, number, special char (!@#$%^&\*)
- ✅ Mobile UI includes: password strength indicator (4-segment bar, color-coded), real-time requirement checklist, show/hide password toggle
- ✅ Web UI matches mobile UX with same validation patterns and visual feedback
- ✅ All TypeScript types exported from api.ts: ForgotPasswordPayload, ResetPasswordPayload, VerifyResetTokenResponse, ResetPasswordResponse

### Next: Credit Refresh Scheduler

- node-cron dependency installed
- `server-side/src/services/credit-refresh.scheduler.ts` created
- Startup date check implemented (delay if before June 9, 2026 00:00 UTC)
- Cron schedule: `0 0 * * *` with UTC timezone
- Database operation: `User.updateMany({ isActive: true }, { $set: { aiResponseCredits: maxCredits } })`
- Console logging added for start and execution tracking
- Registered in `server-side/src/app.ts` after MongoDB connection and seed admin bootstrap

### Remaining Considerations

- June 9 start date is firm deadline, verify deployment timing
- Admin dashboard metrics queries: consider indexing if user/lessonplan collections are large
- Email delivery monitoring: set up alerts if Resend API fails
- Password reset token cleanup: consider archiving expired tokens for audit trail
