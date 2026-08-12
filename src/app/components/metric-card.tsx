"use client";

import { useState } from "react";
import styles from "./metric-card.module.css";

interface MetricCardProps {
  title: string;
  value: number;
  helper: string;
  icon: string;
  loading?: boolean;
  error?: string;
  lastUpdated?: string;
}

export default function MetricCard({ title, value, helper, icon, loading, error, lastUpdated }: MetricCardProps) {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.skeletonLine} style={{ width: "60%" }} />
        <div className={styles.skeletonLine} style={{ width: "40%", marginTop: 8 }} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.value}>{value.toLocaleString()}</div>
      <div className={styles.helper}>{helper}</div>
      {lastUpdated && <div className={styles.updated}>Last updated: {lastUpdated}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
