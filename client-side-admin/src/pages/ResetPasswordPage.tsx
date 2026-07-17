import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../services/api";
import { setSeoMetadata } from "../utils/seo";
import styles from "../styles/PortalTheme.module.css";

const PASSWORD_REQUIREMENTS = {
  minLength: { regex: /.{8,}/, label: "At least 8 characters" },
  uppercase: { regex: /[A-Z]/, label: "One uppercase letter" },
  lowercase: { regex: /[a-z]/, label: "One lowercase letter" },
  number: { regex: /\d/, label: "One number" },
  special: { regex: /[!@#$%^&*]/, label: "One special character (!@#$%^&*)" },
};

export default function ResetPasswordPage() {
  useEffect(() => {
    setSeoMetadata({ title: "Reset Password | Lessora AI", description: "Create a new password for your Lessora AI account.", robots: "noindex, follow" });
  }, []);

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
    <div className={styles.userAuthPage}>{content}</div>
  );

  if (isVerifying) {
    return shell(
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "var(--color-ink-secondary)" }}>Verifying your link...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return shell(
      <div className={styles.resetShellCardCompact}>
        <h2 className={styles.resetShellTitle}>Link expired</h2>
        <p className={styles.resetShellSubtitle} style={{ margin: "0 0 24px" }}>
          {tokenError || "This password reset link is no longer valid."}
        </p>
        <a href="/login" className={styles.flatButton}>Back to login</a>
      </div>
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
    <div className={styles.resetShellCard}>
      <div style={{ marginBottom: 20 }}>
        <h1 className={styles.userAuthTitle} style={{ textAlign: "left", marginBottom: 0 }}>
          Reset password
        </h1>
        <p className={styles.userAuthSubtitle} style={{ textAlign: "left", margin: "10px 0 0" }}>
          Create a strong new password for your account.
        </p>
      </div>
      <form onSubmit={handleSubmit} className={styles.resetShellForm}>
        <label className={styles.userAuthField}>
          <span className={styles.userAuthLabel}>New password</span>
          <div className={styles.passwordFieldWrap}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className={styles.passwordFieldInput}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordFieldToggle}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <div className={styles.passwordRequirements}>
          {Object.entries(PASSWORD_REQUIREMENTS).map(([key, req]) => {
            const isMet = req.regex.test(password);
            return (
              <div
                key={key}
                className={`${styles.passwordRequirement} ${isMet ? styles.passwordRequirementMet : ""}`}
              >
                <span>{isMet ? "✓" : "○"}</span>
                <span>{req.label}</span>
              </div>
            );
          })}
        </div>
        <label className={styles.userAuthField}>
          <span className={styles.userAuthLabel}>Confirm password</span>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={styles.userAuthInput}
          />
        </label>
        {error ? <div className={styles.userAuthError}>{error}</div> : null}
        <button
          type="submit"
          disabled={isResetting || !allRequirementsMet || !passwordsMatch}
          className={styles.flatButton}
        >
          {isResetting ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </div>
  );
}