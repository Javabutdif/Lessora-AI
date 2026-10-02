import styles from "@/portal-theme.module.css";

// Ink widths per ruled line, so the placeholder reads like a written page, not a bar chart
const LINE_WIDTHS = [72, 88, 64, 80, 56, 76, 68, 84];

export default function LoadingSkeleton({ lines = 3, label = "Loading" }: { lines?: number; label?: string }) {
  return (
    <div className={styles.ruledSkeleton} role="status" aria-live="polite">
      <p className={styles.ruledSkeletonLabel}>{label}…</p>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={styles.ruledSkeletonLine}>
          <span className={styles.ruledSkeletonInk} style={{ width: `${LINE_WIDTHS[i % LINE_WIDTHS.length]}%` }} />
        </div>
      ))}
    </div>
  );
}
