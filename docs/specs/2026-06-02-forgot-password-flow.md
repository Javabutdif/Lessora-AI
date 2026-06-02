# Forgot Password Flow Specification

## Feature overview

Users who forget their password can recover account access through an email-based reset flow. Both the main client and admin client support this feature with identical mechanics on the server.

## User flow

1. User clicks "Forgot Password" on login screen
2. User enters email address
3. Server validates email exists and sends reset email with secure token link
4. User clicks link in email (expires after 24 hours)
5. User enters new password (with validation)
6. Server validates token and updates password
7. User can log in with new password

## Server-side design

### New User schema fields

```typescript
interface IUser extends Document {
  // ... existing fields ...
  passwordResetToken?: string; // hashed reset token
  passwordResetTokenExpires?: Date; // token expiration time
  passwordResetAttempts?: number; // track failed reset attempts
}
```

### New endpoints

1. **POST /api/auth/forgot-password**
   - Input: `{ email: string }`
   - Output: `{ message: "Reset email sent", success: boolean }`
   - Logic:
     - Verify email exists
     - Generate secure random token
     - Hash token and store with 24-hour expiration
     - Send reset email with token link
     - Rate limit: max 3 requests per email per hour

2. **POST /api/auth/reset-password**
   - Input: `{ token: string, newPassword: string }`
   - Output: `{ message: "Password reset successful", success: boolean }`
   - Logic:
     - Hash and verify token matches stored token
     - Verify token not expired
     - Validate new password meets requirements
     - Hash and update passwordHash
     - Clear reset token and expiration
     - Log password change event

3. **GET /api/auth/verify-reset-token/:token**
   - Input: Reset token from URL
   - Output: `{ valid: boolean, expiresAt?: Date }`
   - Logic: Verify token exists, is valid, and not expired (UI validation before form submission)

### Password validation rules

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&\*)
- Cannot be same as last 3 passwords (optional future enhancement)

### Email template

Subject: "Reset Your Lessora Password"

Body structure:

```
Hello [Username],

We received a request to reset your password. Click the link below to set a new password:

[RESET_LINK]

This link expires in 24 hours.

If you didn't request this, please ignore this email.

Best regards,
Lessora Team
```

## Client-side flow (React Native)

### New screens/components

- `ForgotPasswordScreen`: email entry and submission
- `ResetPasswordScreen`: password entry with validation UI
- `PasswordResetSuccessScreen`: confirmation

### Route changes

```typescript
// In navigation stack
<Stack.Screen
  name="ForgotPassword"
  component={ForgotPasswordScreen}
  options={{ headerTitle: "Reset Password" }}
/>
```

### Key features

- Real-time password strength indicator
- Show/hide password toggle
- Loading state during email submission
- Error messages for invalid/expired tokens
- Success confirmation before redirect to login

## Admin client flow (React + Vite)

### New pages

- `/forgot-password`: email form
- `/reset-password/:token`: password reset form with token from URL
- `/reset-password-success`: confirmation page

### Identical mechanics to client-side

- Same password validation rules
- Same UI/UX patterns adapted for web

## Security considerations

- **Token format**: Use `crypto.randomBytes(32).toString('hex')` - 64 character hex string
- **Token storage**: Hash tokens in database (bcrypt or similar) - never store plaintext
- **Token expiration**: 24 hours from generation
- **Rate limiting**: Max 3 forgot-password requests per email per hour
- **HTTPS only**: Reset links must be sent over secure connections
- **Account verification**: Only reset if email exists (don't leak user existence in response)

## Error handling

- Invalid email format → return generic "If email exists, reset link sent"
- Email not found → same generic message
- Token expired → friendly message with option to request new reset
- Token invalid → friendly message with option to request new reset
- Password validation failure → specific error per validation rule
- Rate limit exceeded → inform user to try again in 1 hour

## Testing requirements

- Test valid reset flow end-to-end
- Test token expiration
- Test invalid tokens
- Test rate limiting
- Test password validation all 5 rules
- Test email delivery (mock in dev)
- Test UI on both client and admin
- Test invalid/malformed tokens don't crash server

## Success metrics

- User can reset password without contacting support
- Reset emails arrive within 2 minutes
- Token expiration works reliably
- No password reset vulnerabilities identified in review
