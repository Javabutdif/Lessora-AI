"use client";

import { Spinner } from "@phosphor-icons/react";
import styles from "@/portal-theme.module.css";

export default function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className={styles.userAppCenter}>
      <Spinner weight="fill" size={32} className={styles.spin} />
      <p className={styles.centerTextSmall}>Loading...</p>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 12,
            background: "var(--color-surface-sunken)",
            borderRadius: 0,
            width: `${60 - i * 15}%`,
            margin: "var(--spacing-3) auto 0",
            animation: "pulse 1.5s ease-in-out infinite",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
