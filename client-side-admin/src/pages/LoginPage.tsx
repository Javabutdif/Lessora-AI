import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api";
import styles from "../styles/PortalTheme.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginAdmin(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.adminAuthPage}>
      <div className={styles.adminAuthCard}>
        <div style={{ marginBottom: "20px" }}>
          <p className={styles.adminAuthEyebrow}>Admin Portal</p>
          <h1 className={styles.adminAuthTitle}>Sign in</h1>
          <p className={styles.adminAuthSubtitle}>
            Use administrator credentials to open the administrator dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.adminAuthForm}>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="admin@example.com"
              className={styles.adminAuthInput}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Enter password"
              className={styles.adminAuthInput}
            />
          </label>

          {error ? <div className={styles.adminAuthError}>{error}</div> : null}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.adminAuthSubmit}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}