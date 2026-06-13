import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../services/api";

const PASSWORD_REQUIREMENTS = {
  minLength: { regex: /.{8,}/, label: "At least 8 characters" },
  uppercase: { regex: /[A-Z]/, label: "One uppercase letter" },
  lowercase: { regex: /[a-z]/, label: "One lowercase letter" },
  number: { regex: /\d/, label: "One number" },
  special: { regex: /[!@#$%^&*]/, label: "One special character (!@#$%^&*)" },
};

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!token) {
      setTokenError("Invalid reset link");
      setIsVerifying(false);
      return;
    }
    (async () => {
      try {
        const result = await verifyResetToken(token);
        if (result.success) setTokenValid(true);
        else setTokenError(result.message || "Invalid token");
      } catch (err) {
        setTokenError(err instanceof Error ? err.message : "Token verification failed");
      } finally {
        setIsVerifying(false);
      }
    })();
  }, [token]);

  const shell = (content: JSX.Element) => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)", color: "#0f172a" }}>
      {content}
    </div>
  );

  if (isVerifying) {
    return shell(<div style={{ textAlign: "center" }}><p style={{ color: "#475569" }}>Verifying your link...</p></div>);
  }

  if (!tokenValid) {
    return shell(
      <div style={{ width: "100%", maxWidth: "440px", background: "#fff", border: "1px solid #dbe4f0", borderRadius: "24px", padding: "40px 28px", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 12px", fontSize: "24px" }}>Link expired</h2>
        <p style={{ margin: "0 0 24px", color: "#475569", lineHeight: "1.6" }}>{tokenError || "This password reset link is no longer valid."}</p>
        <a href="/login" style={{ display: "inline-block", padding: "12px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Back to login</a>
      </div>,
    );
  }

  const allRequirementsMet = Object.values(PASSWORD_REQUIREMENTS).every((req) => req.regex.test(password));
  const passwordsMatch = password === confirmPassword && password.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allRequirementsMet) return setError("Password does not meet all requirements");
    if (!passwordsMatch) return setError("Passwords do not match");
    setIsResetting(true);
    setError("");
    try {
      await resetPassword(token, password);
      navigate("/reset-password-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setIsResetting(false);
    }
  }

  return shell(
    <div style={{ width: "100%", maxWidth: "440px", background: "#fff", border: "1px solid #dbe4f0", borderRadius: "24px", padding: "28px", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "32px" }}>Reset password</h1>
        <p style={{ margin: "10px 0 0", color: "#475569" }}>Create a strong new password for your account.</p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: "600" }}>New password</span>
          <div style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" style={{ width: "100%", padding: "12px 14px", paddingRight: "80px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", fontSize: "14px", boxSizing: "border-box" }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: "14px" }}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {Object.entries(PASSWORD_REQUIREMENTS).map(([key, req]) => {
            const isMet = req.regex.test(password);
            return <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: isMet ? "#16a34a" : "#64748b" }}>{isMet ? "✓" : "○"} {req.label}</div>;
          })}
        </div>
        <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: "600" }}>Confirm password</span>
          <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" style={{ padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", fontSize: "14px" }} />
        </label>
        {error && <div style={{ padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#b91c1c", fontSize: "14px" }}>{error}</div>}
        <button type="submit" disabled={isResetting || !allRequirementsMet || !passwordsMatch} style={{ padding: "12px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: isResetting || !allRequirementsMet || !passwordsMatch ? "not-allowed" : "pointer", opacity: isResetting || !allRequirementsMet || !passwordsMatch ? 0.7 : 1 }}>
          {isResetting ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </div>,
  );
}
