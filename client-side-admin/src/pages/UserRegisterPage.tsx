import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import LessoraLogo from "../assets/Transparent Logo.png";
import { setSeoMetadata } from "../utils/seo";
import styles from "../styles/PortalTheme.module.css";

export default function UserRegisterPage() {
  useEffect(() => {
    setSeoMetadata({ title: "Create Account | Lessora AI", description: "Sign up for Lessora AI and start creating lesson plans.", robots: "noindex, follow" });
  }, []);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    if (password !== confirmPassword)
      return (setError("Passwords do not match"), setIsLoading(false));
    if (password.length < 6)
      return (
        setError("Password must be at least 6 characters"),
        setIsLoading(false)
      );
    try {
      setSuccess(await registerUser({ name, email, password, school }));
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
        <h1 className={styles.userAuthTitle}>Create Account</h1>
        <p className={styles.userAuthSubtitle}>
          Join Lessora AI and start creating lesson plans
        </p>
        <form onSubmit={handleSubmit} className={styles.userAuthForm}>
          <label className={styles.userAuthField}>
            <span className={styles.userAuthLabel}>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.userAuthInput}
            />
          </label>
          <label className={styles.userAuthField}>
            <span className={styles.userAuthLabel}>School</span>
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="School Name (Optional)"
              className={styles.userAuthInput}
            />
          </label>
          <label className={styles.userAuthField}>
            <span className={styles.userAuthLabel}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="teacher@school.edu"
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
              placeholder="At least 6 characters"
              className={styles.userAuthInput}
            />
          </label>
          <label className={styles.userAuthField}>
            <span className={styles.userAuthLabel}>Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
              className={styles.userAuthInput}
            />
          </label>
          {error ? <div className={styles.userAuthError}>{error}</div> : null}
          {success ? <div className={styles.userAuthSuccess}>{success}</div> : null}
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.flatButton} ${styles.flatButtonLarge}`}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className={styles.userAuthFooter}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
        <div className={styles.userAuthFooterBack}>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}