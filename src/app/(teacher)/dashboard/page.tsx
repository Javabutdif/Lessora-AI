"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@phosphor-icons/react";
import styles from "@/portal-theme.module.css";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/generate");
  }, [router]);

  return (
    <div className={styles.userAppPage}>
      <div className={styles.userAppCenter}>
        <Spinner weight="fill" size={28} className={styles.spin} />
        <p style={{ color: "var(--color-ink-tertiary)" }}>Redirecting...</p>
      </div>
    </div>
  );
}
