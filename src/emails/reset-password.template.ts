/**
 * Email template for password reset
 * Matches the Lessora Admin Dashboard design system
 * Dark theme with blue accent colors
 */

export function getResetPasswordEmailHTML(
  username: string,
  resetLink: string,
): string {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Lessora Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #040b18;
      color: #f0f0f0;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }
    .header {
      background: radial-gradient(circle at top, rgba(24, 119, 242, 0.12), transparent 24%), #020817;
      padding: 40px 20px;
      text-align: center;
      border-bottom: 1px solid rgba(96, 165, 250, 0.22);
    }
    .header h1 {
      font-size: 28px;
      font-weight: bold;
      margin: 0 0 10px 0;
      color: #60a5fa;
      letter-spacing: -0.01em;
    }
    .header p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.62);
      margin: 0;
    }
    .content {
      padding: 40px 20px;
      background-color: rgba(5, 11, 22, 0.86);
      margin: 1px;
    }
    .content h2 {
      font-size: 18px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      margin: 0 0 20px 0;
    }
    .content p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .cta-button {
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: inline-block;
      text-align: center;
      margin: 32px 0;
    }
    .cta-section {
      text-align: center;
    }
    .alt-link {
      font-size: 12px;
      color: rgba(148, 163, 184, 0.8);
      margin: 24px 0;
      text-align: center;
    }
    .alt-link a {
      color: #60a5fa;
      word-break: break-all;
    }
    .notice {
      border-radius: 8px;
      padding: 16px;
      margin: 32px 0;
    }
    .notice-expiration {
      background: rgba(96, 165, 250, 0.08);
      border: 1px solid rgba(96, 165, 250, 0.22);
    }
    .notice-security {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.22);
    }
    .notice h3 {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 8px 0;
      font-weight: 600;
    }
    .notice p {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.62);
      margin: 0;
    }
    .footer {
      background: #020817;
      padding: 24px 20px;
      border-top: 1px solid rgba(96, 165, 250, 0.22);
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      color: rgba(148, 163, 184, 0.6);
      margin: 0 0 12px 0;
    }
    .footer-links {
      font-size: 12px;
    }
    .footer-links a {
      color: rgba(148, 163, 184, 0.6);
      text-decoration: none;
      margin-right: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Lessora</h1>
      <p>AI-Powered Lesson Planning</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h2>Hello ${username},</h2>
      <p>We received a request to reset your Lessora password. Click the button below to create a new password.</p>

      <!-- CTA Button -->
      <div class="cta-section">
        <a href="${resetLink}" class="cta-button">Reset Password</a>
      </div>

      <!-- Alternative Link -->
      <div class="alt-link">
        Or copy and paste this link in your browser:<br>
        <a href="${resetLink}">${resetLink}</a>
      </div>

      <!-- Expiration Notice -->
      <div class="notice notice-expiration">
        <h3>⏰ Link Expiration</h3>
        <p>This password reset link expires in 24 hours. If you don't use it by then, you'll need to request a new one.</p>
      </div>

      <!-- Security Notice -->
      <div class="notice notice-security">
        <h3>🔒 Didn't Request This?</h3>
        <p>If you didn't request a password reset, you can safely ignore this email. Your account remains secure.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© ${currentYear} Lessora. All rights reserved.</p>
      <div class="footer-links">
        <a href="${process.env.BASE_URL || "https://lessora.com"}/privacy">Privacy Policy</a>
        <a href="${process.env.BASE_URL || "https://lessora.com"}/support">Support</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
