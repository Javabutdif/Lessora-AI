# Forgot Password Flow Implementation Plan

**Goal:** Implement secure password reset flow across server, client, and admin with email delivery and token-based validation.

**Architecture:** Server-side token generation and storage with bcrypt hashing, email delivery via existing email service, client and admin UIs with password validation and reset forms. All reset logic centralized in auth controller/service.

**Tech Stack:** Express, TypeScript, Zod validation, bcrypt for token hashing, Resend for email (service & template created), React Native and React for client UIs, crypto for token generation.

---

## References

- spec: [2026-06-02-forgot-password-flow.md](../specs/2026-06-02-forgot-password-flow.md)
- task brief: [2026-06-02-user-auth-credits-admin-features.md](../ai/tasks/2026-06-02-user-auth-credits-admin-features.md)

## Steps

### Phase 1: Server-side foundation (Days 1-2)

- [x] Create Resend email service (`server-side/src/services/resend.service.ts`)
- [x] Create React email template (`server-side/src/emails/ResetPasswordEmail.tsx`) - matches admin dashboard design
- [ ] Extend User schema with reset token fields (`passwordResetToken`, `passwordResetTokenExpires`)
- [ ] Create Zod schemas for forgot password and reset password requests
- [ ] Implement `generateResetToken()` utility function using crypto.randomBytes
- [ ] Implement token hashing and storage logic
- [ ] Create `/api/auth/forgot-password` endpoint with rate limiting (3 requests/hour per email)
- [ ] Create `/api/auth/reset-password` endpoint with token validation
- [ ] Create `/api/auth/verify-reset-token` endpoint for client-side pre-validation
- [ ] Add password validation utility (8+ chars, uppercase, lowercase, number, special char)

### Phase 2: Client-side React Native (Days 3-4)

- [ ] Create ForgotPasswordScreen component with email input
- [ ] Create ResetPasswordScreen component with password validation UI
- [ ] Create PasswordResetSuccessScreen component
- [ ] Add password strength indicator component
- [ ] Add navigation routes for forgot password flow
- [ ] Integrate with auth service API calls
- [ ] Add error handling and loading states
- [ ] Test UI on both iOS and Android simulators

### Phase 3: Admin client web (Days 3-4, parallel)

- [ ] Create ForgotPassword page component with email input
- [ ] Create ResetPassword page component with token from URL
- [ ] Create ResetPasswordSuccess page component
- [ ] Add password strength indicator
- [ ] Add routes to admin routing (if separate routing exists)
- [ ] Integrate with auth service API calls
- [ ] Add error handling and loading states
- [ ] Test in development environment

### Phase 4: Integration & security (Days 5-6)

- [ ] Test complete forgot password flow on client (request → email → reset → login)
- [ ] Test complete forgot password flow on admin (request → email → reset → login)
- [ ] Test token expiration (wait 24+ hours or manually set past date)
- [ ] Test rate limiting (attempt 4+ resets from same email)
- [ ] Test invalid/malformed tokens return proper errors
- [ ] Test password validation rules all trigger correctly
- [ ] Verify email delivery in dev/staging environment
- [ ] Security review: ensure tokens not logged, URLs properly encoded
- [ ] Code review for auth flow

### Phase 5: Cleanup & documentation (Days 6-7)

- [ ] Remove hardcoded config values, use environment variables
- [ ] Add TypeScript types for all request/response payloads
- [ ] Update API documentation
- [ ] Update client README with new flow
- [ ] Add comments to security-sensitive code
- [ ] Run TypeScript validation (`npx tsc --noEmit`)

## Validation

- [ ] Run `npx tsc --noEmit` in server-side
- [ ] Run `npx tsc --noEmit` in client-side
- [ ] Run `npx tsc --noEmit` in client-side-admin
- [ ] Manual end-to-end test on both client platforms
- [ ] Manual end-to-end test on admin web
- [ ] Verify email is sent and received in dev environment

## Risks

- risk 1: Email delivery failures could leave users locked out (mitigation: add admin password reset endpoint)
- risk 2: Token generation security - use only cryptographically secure random (use crypto module, not Math.random)
- risk 3: Email phishing risk - clearly label reset emails and make links clear
- dependency 1: Requires working email service (verify SendGrid/Mailer config before starting)
- dependency 2: Auth context must support token-based password changes

## Handoff notes

- Keep reset tokens hashed in database - never store plaintext
- Email template should match existing brand/style
- Consider adding admin endpoint to manually reset user passwords for support cases
- May want to add audit logging for password changes
- Future: consider adding two-factor confirmation for security
