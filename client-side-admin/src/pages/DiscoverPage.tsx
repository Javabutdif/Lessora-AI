import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Warning,
  Spinner,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { listPublicLessonPlans, PublicLessonPlan } from "../services/api";
import ScrollReveal from "../components/ScrollReveal";
import styles from "../styles/PortalTheme.module.css";

const ALL_GRADES = [
  "All Grades",
  "Preschool",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Senior High School",
];

const ALL_SUBJECTS = [
  "All Subjects",
  "Mathematics",
  "Science",
  "English",
  "Filipino",
  "Araling Panlipunan",
  "MAPEH",
  "Technology and Livelihood Education",
  "Values Education",
];

export default function DiscoverPage() {
  const [plans, setPlans] = useState<PublicLessonPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    listPublicLessonPlans()
      .then(setPlans)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load plans"))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      !searchQuery ||
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "All Subjects" ||
      plan.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesGrade =
      selectedGrade === "All Grades" ||
      plan.gradeLevel.toLowerCase() === selectedGrade.toLowerCase();
    return matchesSearch && matchesSubject && matchesGrade;
  });

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Recently";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className={styles.userAppPage}>
      <header className={styles.userAppHeader}>
        <h1 className={styles.userAppBrand}>Lessora AI</h1>
        <nav className={styles.userAppHeaderActions}>
          <button
            type="button"
            onClick={() => navigate("/generate")}
            className={styles.softSecondary}
          >
            New Plan
          </button>
          <button
            type="button"
            onClick={() => navigate("/support")}
            className={styles.softSecondary}
          >
            Support
          </button>
        </nav>
      </header>

      <div className={styles.userAppContainer}>
        <div className={styles.userAppHero}>
          <p className={styles.eyebrow}>Discover</p>
          <h2 className={styles.userAppHeroTitle}>All Lesson Plans</h2>
          <p className={styles.userAppHeroDescription}>
            Explore lesson plans shared by teachers across the platform.
          </p>
        </div>

        <div className={styles.filterBar}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, subject, or grade..."
            className={styles.searchInputLg}
          />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={styles.filterSelect}
          >
            {ALL_SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className={styles.filterSelect}
          >
            {ALL_GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {isLoading && (
          <div className={styles.userAppCenter}>
            <Spinner weight="fill" size={32} className={styles.spin} />
            <p className={styles.centerTextSmall}>Loading plans...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.errorPanel}>
            <Warning size={28} className={styles.iconWithBottom} />
            <p className={styles.centerTitle}>Failed to load plans</p>
            <p className={styles.centerText}>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={styles.softSecondary}
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && filteredPlans.length === 0 && plans.length === 0 && (
          <div className={styles.userAppCenter}>
            <MagnifyingGlass weight="fill" size={48} className={styles.iconWithBottomLarge} />
            <h3 className={styles.userAppCenterTitle}>No Plans Yet</h3>
            <p className={styles.userAppCenterText} style={{ marginBottom: 24 }}>
              Be the first teacher to share a lesson plan.
            </p>
            <button
              type="button"
              onClick={() => navigate("/generate")}
              className={styles.flatButton}
            >
              Create Your First Plan
            </button>
          </div>
        )}

        {!isLoading && !error && filteredPlans.length === 0 && plans.length > 0 && (
          <div className={styles.userAppCenter}>
            <MagnifyingGlass weight="fill" size={40} className={styles.iconWithBottomLarge} />
            <h3 className={styles.userAppCenterTitle}>No Results Found</h3>
            <p className={styles.userAppCenterText}>Try a different search term or filter</p>
          </div>
        )}

        {!isLoading && !error && filteredPlans.length > 0 && (
          <div className={styles.planGrid}>
            {filteredPlans.map((plan, index) => (
              <ScrollReveal key={plan.id} delay={index * 40}>
                <div
                  className={styles.planTile}
                  onClick={() => navigate(`/preview/${plan.id}?public=true`)}
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
                    <span>{formatDate(plan.createdAt)}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
