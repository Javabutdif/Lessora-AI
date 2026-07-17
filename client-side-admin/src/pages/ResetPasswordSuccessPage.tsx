import { useEffect } from "react";
import { setSeoMetadata } from "../utils/seo";
import styles from "../styles/PortalTheme.module.css";

export default function ResetPasswordSuccessPage() {
  useEffect(() => {
    setSeoMetadata({ title: "Password Reset | Lessora AI", description: "Your password has been reset successfully.", robots: "noindex, follow" });
  }, []);

  return (
    <div className={styles.userAuthPage}>
      <div className={styles.resetShellCardCompact}>
        <div className={styles.resetStatusMark}>✓</div>
        <h1 className={styles.userAuthTitle} style={{ marginBottom: 12 }}>Password reset</h1>
        <p style={{ margin: "0 0 12px", color: "var(--color-ink-secondary)", fontSize: 14 }}>
          Your password has been successfully reset.
        </p>
        <p style={{ margin: "0 0 24px", color: "var(--color-ink-tertiary)", fontSize: 13 }}>
          You can now sign in with your new password.
        </p>
        <a href="/login" className={styles.flatButton}>Back to login</a>
      </div>
    </div>
  );
}