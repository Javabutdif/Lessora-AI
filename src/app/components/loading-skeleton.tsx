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
          className={i === 0 ? styles.skeletonLine : `${styles.skeletonLine} ${styles.skeletonLineGap}`}
          style={{ width: `${60 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
