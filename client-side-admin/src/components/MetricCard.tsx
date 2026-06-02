import styles from "./MetricCard.module.css";

type MetricCardProps = {
  title: string;
  value: number | string;
  helper: string;
  icon?: string;
  loading?: boolean;
  error?: string;
  lastUpdated?: string;
};

export default function MetricCard({
  title,
  value,
  helper,
  icon,
  loading = false,
  error,
  lastUpdated,
}: MetricCardProps) {
  if (loading) {
    return (
      <article className={styles.metricCard} aria-busy="true">
        <div className={styles.header}>
          <span className={styles.skeletonTitle} />
          {icon && <span className={styles.icon}>{icon}</span>}
        </div>
        <span className={styles.skeletonValue} />
        <span className={styles.skeletonHelper} />
      </article>
    );
  }

  return (
    <article className={styles.metricCard}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <p className={styles.value}>{value}</p>
          <p className={styles.helper}>{helper}</p>
          {lastUpdated && (
            <p className={styles.updated}>Updated {lastUpdated}</p>
          )}
        </>
      )}
    </article>
  );
}
