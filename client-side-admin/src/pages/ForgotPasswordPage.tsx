import { useState, type FormEvent } from "react";
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

  const shell = (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)", color: "#0f172a" }}>
      <div style={{ width: "100%", maxWidth: "440px", background: "#fff", border: "1px solid #dbe4f0", borderRadius: "24px", padding: "32px", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "32px" }}>Forgot password?</h1>
          <p style={{ margin: "10px 0 0", color: "#475569" }}>Enter your email address and we&apos;ll send you a link to reset your password.</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="admin@example.com" style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", fontSize: "14px" }} />
          </label>
          {error && <div style={{ padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#b91c1c", fontSize: "14px" }}>{error}</div>}
          <button type="submit" disabled={isLoading} style={{ padding: "12px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
          <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: "14px" }}>
            <span style={{ color: "#475569" }}>Remember your password? </span>
            <a href="/login">Back to login</a>
          </p>
        </form>
      </div>
    </div>
  );

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)", color: "#0f172a" }}>
        <div style={{ width: "100%", maxWidth: "440px", background: "#fff", border: "1px solid #dbe4f0", borderRadius: "24px", padding: "40px 28px", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "24px" }}>Check your email</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: "1.6" }}>We&apos;ve sent a password reset link to <strong>{email}</strong>. The link will expire in 24 hours.</p>
        </div>
      </div>
    );
  }

  return shell;
}
