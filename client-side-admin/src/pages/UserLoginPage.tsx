import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import LessoraLogo from "../assets/Transparent Logo.png";
import { setSeoMetadata } from "../utils/seo";
import styles from "../styles/PortalTheme.module.css";

export default function UserLoginPage() {
  useEffect(() => {
    setSeoMetadata({ title: "Login | Lessora AI", description: "Sign in to your Lessora AI account.", robots: "noindex, follow" });
  }, []);
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
      await loginUser(email, password);
      navigate("/generate");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.userAuthPage}>
      <div className={styles.userAuthCard}>
        <div className={styles.userAuthLogoWrap}>
          <img src={LessoraLogo} alt="Lessora AI" className={styles.userAuthLogo} />
        </div>
        <h1 className={styles.userAuthTitle}>Welcome Back</h1>
        <p className={styles.userAuthSubtitle}>
          Sign in to continue planning with Lessora AI
        </p>
        <form onSubmit={handleSubmit} className={styles.userAuthForm}>
          <label className={styles.userAuthField}>
            <span className={styles.userAuthLabel}>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="teacher@school.edu"
              disabled={isLoading}
              className={styles.userAuthInput}
            />
          </label>
          <label className={styles.userAuthField}>
            <span className={styles.userAuthLabel}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={isLoading}
              className={styles.userAuthInput}
            />
          </label>
          {error ? <div className={styles.userAuthError}>{error}</div> : null}
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.flatButton} ${styles.flatButtonLarge}`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className={styles.userAuthFooter} style={{ marginTop: 16 }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div className={styles.userAuthFooter}>
          Don&apos;t have an account? <Link to="/register">Sign Up</Link>
        </div>
        <div className={styles.userAuthFooterBack}>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}