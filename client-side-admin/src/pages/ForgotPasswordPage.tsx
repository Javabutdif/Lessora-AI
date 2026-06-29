import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";
import styles from "../styles/PortalTheme.module.css";

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
      <div className={styles.userAuthPage}>
        <div className={styles.resetShellCardCompact}>
          <h2 className={styles.resetShellTitle}>Check your email</h2>
          <p className={styles.resetShellSubtitle}>
            We&apos;ve sent a password reset link to <strong>{email}</strong>. The link will expire in 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userAuthPage}>
      <div className={styles.resetShellCard}>
        <div style={{ marginBottom: 20 }}>
          <h1 className={styles.userAuthTitle} style={{ textAlign: "left", marginBottom: 0 }}>
            Forgot password?
          </h1>
          <p className={styles.userAuthSubtitle} style={{ textAlign: "left", margin: "10px 0 0" }}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className={styles.resetShellForm}>
          <label className={styles.userAuthField}>
            <span className={styles.userAuthLabel}>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="admin@example.com"
              className={styles.userAuthInput}
            />
          </label>
          {error ? <div className={styles.userAuthError}>{error}</div> : null}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.flatButton}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
          <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: 14 }}>
            <span style={{ color: "var(--color-ink-secondary)" }}>Remember your password? </span>
            <a href="/login">Back to login</a>
          </p>
        </form>
      </div>
    </div>
  );
}