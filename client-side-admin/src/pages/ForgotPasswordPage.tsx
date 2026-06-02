import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          color: "#fff",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            background: "rgba(5,11,22,0.88)",
            border: "1px solid rgba(148,163,184,0.24)",
            borderRadius: "24px",
            padding: "40px 28px",
            boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 16px",
                background: "rgba(96, 165, 250, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}
            >
              ✓
            </div>
            <h2 style={{ margin: "0 0 12px", fontSize: "24px" }}>
              Check your email
            </h2>
            <p
              style={{
                margin: "0",
                color: "rgba(255,255,255,0.7)",
                lineHeight: "1.6",
              }}
            >
              We've sent a password reset link to <strong>{email}</strong>. The
              link will expire in 24 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(5,11,22,0.88)",
          border: "1px solid rgba(148,163,184,0.24)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: "0", fontSize: "32px" }}>Forgot password?</h1>
          <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.7)" }}>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="admin@example.com"
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.28)",
                background: "#020817",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </label>

          {error && (
            <div
              style={{
                padding: "12px 14px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#fca5a5",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: "#60a5fa",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>

          <p
            style={{
              margin: "16px 0 0",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.7)" }}>
              Remember your password?{" "}
            </span>
            <a
              href="/login"
              style={{ color: "#60a5fa", textDecoration: "none" }}
            >
              Back to login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
