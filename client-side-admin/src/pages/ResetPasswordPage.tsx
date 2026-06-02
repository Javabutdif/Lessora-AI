import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../services/api";

const PASSWORD_REQUIREMENTS = {
  minLength: { regex: /.{8,}/, label: "At least 8 characters" },
  uppercase: { regex: /[A-Z]/, label: "One uppercase letter" },
  lowercase: { regex: /[a-z]/, label: "One lowercase letter" },
  number: { regex: /\d/, label: "One number" },
  special: { regex: /[!@#$%^&*]/, label: "One special character (!@#$%^&*)" },
};

type PasswordStrength = "weak" | "fair" | "good" | "strong";

function getPasswordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: PasswordStrength;
  color: string;
} {
  let score: 0 | 1 | 2 | 3 | 4 = 0;

  if (PASSWORD_REQUIREMENTS.minLength.regex.test(password)) score++;
  if (PASSWORD_REQUIREMENTS.uppercase.regex.test(password)) score++;
  if (PASSWORD_REQUIREMENTS.lowercase.regex.test(password)) score++;
  if (PASSWORD_REQUIREMENTS.number.regex.test(password)) score++;
  if (PASSWORD_REQUIREMENTS.special.regex.test(password)) score++;

  const labels: PasswordStrength[] = [
    "weak",
    "fair",
    "good",
    "strong",
    "strong",
  ];
  const colors = ["#ef4444", "#f59e0b", "#60a5fa", "#22c55e"];

  return {
    score: Math.min(score, 4) as 0 | 1 | 2 | 3 | 4,
    label: labels[score],
    color: colors[Math.max(score - 1, 0)],
  };
}

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

    async function verifyToken() {
      try {
        const result = await verifyResetToken(token);
        if (result.success) {
          setTokenValid(true);
        } else {
          setTokenError(result.message || "Invalid token");
        }
      } catch (err) {
        setTokenError(
          err instanceof Error ? err.message : "Token verification failed",
        );
      } finally {
        setIsVerifying(false);
      }
    }

    verifyToken();
  }, [token]);

  if (isVerifying) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(96, 165, 250, 0.3)",
              borderTop: "3px solid #60a5fa",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }}
          ></div>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Verifying your link...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
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
          <h2 style={{ margin: "0 0 12px", fontSize: "24px" }}>Link expired</h2>
          <p
            style={{
              margin: "0 0 24px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: "1.6",
            }}
          >
            {tokenError || "This password reset link is no longer valid."}
          </p>
          <a
            href="/login"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: "10px",
              background: "#60a5fa",
              color: "#fff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  const strength = getPasswordStrength(password);
  const allRequirementsMet = Object.values(PASSWORD_REQUIREMENTS).every((req) =>
    req.regex.test(password),
  );
  const passwordsMatch = password === confirmPassword && password.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!allRequirementsMet) {
      setError("Password does not meet all requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

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
          <h1 style={{ margin: "0", fontSize: "32px" }}>Reset password</h1>
          <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.7)" }}>
            Create a strong new password for your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              New password
            </span>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter new password"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  paddingRight: "40px",
                  borderRadius: "10px",
                  border: "1px solid rgba(148,163,184,0.28)",
                  background: "#020817",
                  color: "#fff",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </label>

          {password && (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  marginBottom: "8px",
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "4px",
                      borderRadius: "2px",
                      background:
                        i < strength.score
                          ? strength.color
                          : "rgba(148,163,184,0.2)",
                      transition: "background 0.2s",
                    }}
                  ></div>
                ))}
              </div>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "12px",
                  color: strength.color,
                }}
              >
                Strength: {strength.label}
              </p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {Object.entries(PASSWORD_REQUIREMENTS).map(([key, req]) => {
              const isMet = req.regex.test(password);
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: isMet ? "#22c55e" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{isMet ? "✓" : "○"}</span>
                  {req.label}
                </div>
              );
            })}
          </div>

          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Confirm password
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border:
                  confirmPassword && !passwordsMatch
                    ? "1px solid rgba(239, 68, 68, 0.5)"
                    : "1px solid rgba(148,163,184,0.28)",
                background: "#020817",
                color: "#fff",
                fontSize: "14px",
              }}
            />
            {confirmPassword && !passwordsMatch && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "12px",
                  color: "#fca5a5",
                }}
              >
                Passwords do not match
              </p>
            )}
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
            disabled={isResetting || !allRequirementsMet || !passwordsMatch}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background:
                isResetting || !allRequirementsMet || !passwordsMatch
                  ? "rgba(96, 165, 250, 0.5)"
                  : "#60a5fa",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              cursor:
                isResetting || !allRequirementsMet || !passwordsMatch
                  ? "not-allowed"
                  : "pointer",
              transition: "background 0.2s",
            }}
          >
            {isResetting ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
