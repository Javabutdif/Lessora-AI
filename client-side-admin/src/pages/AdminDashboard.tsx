import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  API_BASE,
  fetchAdminStats,
  fetchDashboardMetrics,
} from "../services/api";
import { Button, Card, Badge, Skeleton } from "../components/ui";
import MetricCard from "../components/MetricCard";
import styles from "./AdminDashboard.module.css";

interface StatCard {
  label: string;
  value: number | string;
  helper: string;
  accent: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    activeUsers: number;
    totalLessonPlans: number;
    publishedLessonPlans: number;
    generatedLast7Days: number;
    generationRate: number;
  } | null>(null);
  const [status, setStatus] = useState("loading");
  const [serverMessage, setServerMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    data: dashboardMetrics,
    isLoading: metricsLoading,
    isFetching: metricsFetching,
    error: metricsError,
  } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: fetchDashboardMetrics,
    refetchInterval: 60_000,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 3,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const statsPayload = await fetchAdminStats();
        if (!mounted) return;

        setStats(statsPayload);

        const healthResponse = await fetch(`${API_BASE}/api/health`, {
          headers: {
            "X-Client-Type": "web",
          },
        });
        const healthPayload = await healthResponse.json();
        setStatus(healthPayload.status === "ok" ? "online" : "degraded");
        setServerMessage(
          `Backend ${healthPayload.status} • ${new Date(healthPayload.timestamp).toLocaleTimeString()}`,
        );
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard metrics",
        );
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo<StatCard[]>(() => {
    if (!stats) {
      return [];
    }

    return [
      {
        label: "Total users",
        value: stats.totalUsers,
        helper: "Registered accounts in shared backend",
        accent: "#60a5fa",
      },
      {
        label: "Active users",
        value: stats.activeUsers,
        helper: "Users with recent login activity",
        accent: "#22c55e",
      },
      {
        label: "Lesson plans",
        value: stats.totalLessonPlans,
        helper: "Stored generated plans across the platform",
        accent: "#f59e0b",
      },
      {
        label: "Published plans",
        value: stats.publishedLessonPlans,
        helper: "Plans marked published",
        accent: "#fb7185",
      },
      {
        label: "7-day generations",
        value: stats.generatedLast7Days,
        helper: "Recent AI lesson generation activity",
        accent: "#2dd4bf",
      },
      {
        label: "Generation rate",
        value: `${stats.generationRate}/day`,
        helper: "Average daily generation volume",
        accent: "#c084fc",
      },
    ];
  }, [stats]);

  const metricsLastUpdated = dashboardMetrics?.lastUpdated
    ? new Date(dashboardMetrics.lastUpdated).toLocaleTimeString()
    : undefined;
  const metricsErrorMessage =
    metricsError instanceof Error
      ? metricsError.message
      : metricsError
        ? "Unable to load dashboard metrics"
        : undefined;

  function handleLogout() {
    localStorage.removeItem("lessora-admin-token");
    localStorage.removeItem("lessora-admin-user");
    navigate("/admin/login");
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header Section */}
        <Card className={styles.header} padding="lg">
          <div className={styles.headerContent}>
            <p className={styles.headerLabel}>Lessora Admin</p>
            <h1 className={styles.headerTitle}>Platform dashboard</h1>
            <p className={styles.headerDescription}>
              Shared backend analytics for the web and mobile platform.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Badge
              variant={status === "online" ? "success" : "warning"}
              size="md"
            >
              {status === "online" ? "Backend online" : "Checking backend"}
            </Badge>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => navigate("/admin/lesson-plans")}
              ariaLabel="Navigate to lesson plan history"
            >
              Lesson plans
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => navigate("/admin/users")}
              ariaLabel="Navigate to user management"
            >
              Users
            </Button>
            <Button
              variant="ghost"
              size="medium"
              onClick={handleLogout}
              ariaLabel="Logout from admin dashboard"
            >
              Logout
            </Button>
          </div>
        </Card>

        {/* Info Cards Grid */}
        <div className={styles.infoGrid}>
          <Card padding="md" className={styles.infoCard}>
            <p className={styles.infoCardLabel}>Shared backend</p>
            <h2 className={styles.infoCardTitle}>
              {serverMessage || "Checking connection…"}
            </h2>
          </Card>

          <Card padding="md" className={styles.infoCard}>
            <p className={styles.infoCardLabel}>Admin session</p>
            <h2 className={styles.infoCardTitle}>Protected</h2>
            <p className={styles.infoCardDescription}>
              Admin portal uses the same bearer-token session as the backend.
            </p>
          </Card>

          <Card padding="md" className={styles.infoCard}>
            <p className={styles.infoCardLabel}>Connected clients</p>
            <h2 className={styles.infoCardTitle}>2</h2>
            <p className={styles.infoCardDescription}>
              Mobile client + web admin on one backend.
            </p>
          </Card>
        </div>

        {/* Statistics Section */}
        <Card padding="md" className={styles.statsSection}>
          <div className={styles.statsHeader}>
            <div className={styles.statsHeaderContent}>
              <p className={styles.statsLabel}>Statistics</p>
              <h2 className={styles.statsTitle}>Platform metrics</h2>
            </div>
            <div className={styles.statsStatus}>
              {metricsFetching ? "Updating metrics..." : "Refreshes every 60s"}
            </div>
          </div>

          <div className={styles.dashboardMetricsGrid}>
            <MetricCard
              title="Active users"
              value={dashboardMetrics?.activeUsers ?? 0}
              helper="Active verified teacher accounts"
              icon="AU"
              loading={metricsLoading}
              error={metricsErrorMessage}
              lastUpdated={metricsLastUpdated}
            />
            <MetricCard
              title="Lesson plans generated"
              value={dashboardMetrics?.totalLessonPlans ?? 0}
              helper="Total plans stored across the platform"
              icon="LP"
              loading={metricsLoading}
              error={metricsErrorMessage}
              lastUpdated={metricsLastUpdated}
            />
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          {/* Metrics Grid or Loading Skeletons */}
          {!stats && !error ? (
            <div className={styles.skeletonGrid}>
              <Skeleton variant="metric" count={6} />
            </div>
          ) : (
            <div className={styles.metricsGrid}>
              {cards.map((card) => (
                <article
                  key={card.label}
                  className={styles.metricCard}
                  style={{ borderColor: `${card.accent}33` }}
                >
                  <div className={styles.metricHeader}>
                    <span className={styles.metricLabel}>{card.label}</span>
                    <span
                      className={styles.metricDot}
                      style={{ background: card.accent }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className={styles.metricValue}>{card.value}</div>
                  <div className={styles.metricHelper}>{card.helper}</div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Made with Bob
