import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import styles from "../styles/PortalTheme.module.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/generate", { replace: true });
  }, [navigate]);

  return (
    <div className={styles.userAppPage}>
      <div className={styles.userAppCenter}>
        <FaSpinner className={styles.spin} style={{ fontSize: 28, marginBottom: 16 }} />
        <p style={{ color: "var(--color-ink-tertiary)" }}>Redirecting...</p>
      </div>
    </div>
  );
}
