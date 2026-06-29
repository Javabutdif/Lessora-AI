import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBookOpen, FaClock, FaExclamationTriangle, FaHistory, FaPlus, FaSpinner, FaUser } from "react-icons/fa";
import {
  getLessonPlanById,
  getCurrentUser,
  logoutUser,
  LessonPlanHistoryDetail,
} from "../services/api";
import styles from "../styles/PortalTheme.module.css";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<LessonPlanHistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (id) loadPlan(id);
  }, [id]);

  async function loadPlan(planId: string) {
    try {
      setIsLoading(true);
      setError("");
      setPlan(await getLessonPlanById(planId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lesson plan");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  function renderBlock(block: any, index: number) {
    if (block.type === "heading") {
      const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
      const fontSize = block.level === 1 ? "28px" : block.level === 2 ? "22px" : "18px";
      return (
        <HeadingTag
          key={index}
          style={{
            margin: index === 0 ? "0 0 14px" : "28px 0 12px",
            fontSize,
            fontWeight: 800,
            color: "var(--color-ink-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          {block.text}
        </HeadingTag>
      );
    }

    if (block.type === "paragraph") {
      return (
        <p
          key={index}
          style={{
            margin: "0 0 16px",
            fontSize: 16,
            lineHeight: 1.8,
            color: "#334155",
          }}
        >
          {block.text}
        </p>
      );
    }

    if (block.type === "list") {
      const ListTag = block.style === "numbered" ? "ol" : "ul";
      return (
        <ListTag
          key={index}
          style={{
            margin: "0 0 18px",
            paddingLeft: 22,
            fontSize: 16,
            lineHeight: 1.8,
            color: "#334155",
          }}
        >
          {block.items.map((item: string, itemIndex: number) => (
            <li key={itemIndex} style={{ marginBottom: 8 }}>
              {item}
            </li>
          ))}
        </ListTag>
      );
    }

    return null;
  }

  return (
    <div className={styles.userAppPage}>
      <header className={styles.userAppHeader}>
        <h1 className={styles.userAppBrand}>Lessora AI</h1>
        <div className={styles.userAppHeaderActions}>
          <span className={styles.userAppUser}>
            <FaUser />
            {user?.name || "User"}
          </span>
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
            onClick={() => navigate("/history")}
            className={styles.softSecondary}
          >
            <FaHistory />
            History
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

      <div className={styles.userAppContainerDoc}>
        {isLoading && (
          <div className={styles.userAppCenterLarge}>
            <FaSpinner
              className={styles.userAppIconLarge}
              style={{ fontSize: 36, animation: "spin 1s linear infinite" }}
            />
            <p style={{ margin: 0, fontSize: 16 }}>Loading lesson plan...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.errorPanel} style={{ borderRadius: 14 }}>
            <FaExclamationTriangle style={{ fontSize: 28, marginBottom: 10 }} />
            <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Failed to load lesson plan</p>
            <p style={{ margin: "0 0 16px", fontSize: 14 }}>{error}</p>
            <button
              type="button"
              onClick={() => navigate("/history")}
              className={styles.softDanger}
            >
              Back to History
            </button>
          </div>
        )}

        {!isLoading && !error && plan && (
          <>
            <section className={styles.planCardSpacious}>
              <p className={styles.planCardTitle}>Lesson Plan Preview</p>
              <h1 className={styles.planCardHeading}>{plan.title}</h1>
              <div className={styles.chipRow}>
                <span className={`${styles.chip} ${styles.chipAccent}`}>
                  <FaBookOpen />
                  {plan.subject}
                </span>
                <span className={`${styles.chip} ${styles.chipPurple}`}>
                  Grade: {plan.gradeLevel}
                </span>
                <span className={`${styles.chip} ${styles.chipSuccess}`}>
                  <FaClock />
                  {plan.totalDuration} minutes
                </span>
              </div>
              <div className={styles.planCardMeta}>
                Created: {new Date(plan.createdAt).toLocaleString()}
              </div>
            </section>

            <section className={styles.planCardBody}>
              <div style={{ maxWidth: 760, margin: "0 auto" }}>
                {plan.document.blocks.map((block, index) => renderBlock(block, index))}
              </div>
            </section>

            <div className={styles.userAppActionRow}>
              <button
                type="button"
                onClick={() => navigate("/history")}
                className={styles.softSecondary}
              >
                Back to History
              </button>
              <button
                type="button"
                onClick={() => navigate("/generate")}
                className={styles.flatButton}
              >
                Generate New Plan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}