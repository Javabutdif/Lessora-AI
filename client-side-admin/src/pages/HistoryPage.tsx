import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaHistory,
  FaPlus,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";
import {
  listRecentLessonPlans,
  getCurrentUser,
  logoutUser,
  LessonPlanHistoryItem,
} from "../services/api";
import styles from "../styles/PortalTheme.module.css";

export default function HistoryPage() {
  const [plans, setPlans] = useState<LessonPlanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      setIsLoading(true);
      setError("");
      setPlans(await listRecentLessonPlans());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Recently";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const filteredPlans = plans.filter((plan) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      plan.title.toLowerCase().includes(query) ||
      plan.subject.toLowerCase().includes(query) ||
      plan.gradeLevel.toLowerCase().includes(query)
    );
  });

  return (
    <div className={styles.userAppPage}>
      <header className={styles.userAppHeader}>
        <h1 className={styles.userAppBrand}>Lessora AI</h1>
        <div className={styles.userAppHeaderActions}>
          <span className={styles.userAppUser}>{user?.name || "User"}</span>
          <button
            type="button"
            onClick={() => navigate("/generate")}
            className={styles.softSecondary}
          >
            <FaPlus />
            Generate
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className={styles.softDanger}
          >
            Logout
          </button>
        </div>
      </header>

      <div className={styles.userAppContainer}>
        <div className={styles.userAppHero}>
          <h2 className={styles.userAppHeroTitle}>Lesson Plan History</h2>
          <p className={styles.userAppHeroDescription}>
            View and manage your generated lesson plans
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, subject, or grade level..."
            className={styles.searchInputLg}
          />
        </div>

        {isLoading && (
          <div className={styles.userAppCenter}>
            <FaSpinner className={styles.userAppIconLarge} style={{ animation: "spin 1s linear infinite" }} />
            <p style={{ margin: 0, fontSize: 16 }}>Loading your lesson plans...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.errorPanel}>
            <FaExclamationTriangle className={styles.userAppIconMedium} />
            <p style={{ margin: "0 0 12px", fontWeight: 600 }}>Failed to load history</p>
            <p style={{ margin: "0 0 16px", fontSize: 14 }}>{error}</p>
            <button
              type="button"
              onClick={loadPlans}
              style={{
                padding: "8px 16px",
                background: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: 8,
                color: "#b91c1c",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading &&
          !error &&
          filteredPlans.length === 0 &&
          plans.length === 0 && (
            <div className={styles.userAppCenter} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-secondary)", borderRadius: 16 }}>
              <FaHistory className={styles.userAppIconXL} />
              <h3 className={styles.userAppCenterTitle}>No Lesson Plans Yet</h3>
              <p className={styles.userAppCenterText} style={{ marginBottom: 24 }}>
                Start creating your first lesson plan with AI
              </p>
              <button
                type="button"
                onClick={() => navigate("/generate")}
                className={styles.flatButton}
              >
                Generate Lesson Plan
              </button>
            </div>
          )}

        {!isLoading &&
          !error &&
          filteredPlans.length === 0 &&
          plans.length > 0 && (
            <div className={styles.userAppCenter} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-secondary)", borderRadius: 16 }}>
              <FaSearch className={styles.userAppIconLarge} style={{ fontSize: 48 }} />
              <h3 className={styles.userAppCenterTitle}>No Results Found</h3>
              <p className={styles.userAppCenterText}>Try a different search term</p>
            </div>
          )}

        {!isLoading && !error && filteredPlans.length > 0 && (
          <div className={styles.planGrid}>
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={styles.planTile}
                onClick={() => navigate(`/preview/${plan.id}`)}
              >
                <h3 className={styles.planTileTitle}>{plan.title}</h3>
                <div className={styles.planTileChipRow}>
                  <span className={`${styles.chip} ${styles.chipAccent}`}>
                    {plan.subject}
                  </span>
                  <span className={`${styles.chip} ${styles.chipPurple}`}>
                    {plan.gradeLevel}
                  </span>
                </div>
                <div className={styles.planTileMeta}>
                  <span>{plan.totalDuration} min</span>
                  <span>{formatDate(plan.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}