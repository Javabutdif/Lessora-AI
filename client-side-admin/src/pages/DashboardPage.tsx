import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@phosphor-icons/react";
import styles from "../styles/PortalTheme.module.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/generate", { replace: true });
  }, [navigate]);

  return (
    <div className={styles.userAppPage}>
      <div className={styles.userAppCenter}>
        <Spinner weight="fill" size={28} className={styles.spin} />
        <p style={{ color: "var(--color-ink-tertiary)" }}>Redirecting...</p>
      </div>
    </div>
  );
}
