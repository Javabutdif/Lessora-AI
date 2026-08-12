import { Resend } from "resend";
import { getResetPasswordEmailHTML } from "@/emails/reset-password.template";

let resend: Resend | null = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured. Add it to server-side/.env to send transactional emails.",
    );
  }

  if (!resend) {
    resend = new Resend(apiKey);
  }

  return resend;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Resend Email Service
 * Handles all transactional emails (password reset, verification, etc.)
 */
export const ResendService = {
  /**
   * Send email using Resend
   * @param params - Email parameters including recipient, subject, and HTML content
   * @returns Promise with Resend response
   */
  async send(params: SendEmailParams) {
    try {
      const resendClient = getResendClient();
      const response = await resendClient.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@lessora.com",
        ...params,
      });

      if (response.error) {
        console.error("Resend email error:", response.error);
        throw new Error(`Failed to send email: ${response.error.message}`);
      }

      console.log("Email sent successfully:", response.data?.id);
      return response.data;
    } catch (error) {
      console.error("Resend service error:", error);
      throw error;
    }
  },

  /**
   * Send password reset email
   * @param email - User email address
   * @param username - User's display name
   * @param resetLink - Full reset link with token
   */
  async sendPasswordResetEmail(
    email: string,
    username: string,
    resetLink: string,
  ) {
    const html = getResetPasswordEmailHTML(username, resetLink);

    return this.send({
      to: email,
      subject: "Reset Your Lessora Password",
      html,
    });
  },

  async sendDailyReportEmail(to: string, subject: string, html: string) {
    return this.send({
      to,
      subject,
      html,
    });
  },
};
