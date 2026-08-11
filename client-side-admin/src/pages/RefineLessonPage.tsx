import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";
import {
  getLessonPlanById,
  refineLessonPlan,
  LessonPlanTemplate,
  LessonPlanHistoryDetail,
  ensureSession,
} from "../services/api";
import styles from "../styles/PortalTheme.module.css";

type RefineOption = { key: string; label: string };

const templateSections: Record<LessonPlanTemplate, RefineOption[]> = {
  "lessora-ai": [
    { key: "lesson overview", label: "Lesson Overview" },
    { key: "learning objectives", label: "Learning Objectives" },
    { key: "materials", label: "Materials" },
    { key: "procedure", label: "Procedure" },
    { key: "assessment", label: "Assessment" },
    { key: "teacher notes", label: "Teacher Notes" },
  ],
  "deped-semi-detailed": [
    { key: "metadata", label: "Metadata" },
    { key: "learning competencies", label: "Learning Competencies" },
    { key: "objectives", label: "Objectives" },
    { key: "content", label: "Content" },
    { key: "learning resources", label: "Learning Resources" },
    { key: "procedure", label: "Procedure" },
    { key: "assessment", label: "Assessment" },
    { key: "assignment", label: "Assignment" },
    { key: "remarks", label: "Remarks" },
    { key: "reflection", label: "Reflection" },
  ],
  "detailed-lesson-plan": [
    { key: "objectives", label: "Objectives" },
    { key: "content", label: "Content" },
    { key: "learning resources", label: "Learning Resources" },
    { key: "procedure", label: "Procedures" },
    { key: "evaluation", label: "Evaluation" },
    { key: "reflection", label: "Reflection" },
  ],
  "daily-lesson-log": [
    { key: "objectives", label: "Objectives" },
    { key: "content", label: "Content" },
    { key: "learning resources", label: "Learning Resources" },
    { key: "procedures", label: "Procedures" },
    { key: "evaluation", label: "Evaluation" },
    { key: "remarks", label: "Remarks" },
    { key: "reflection", label: "Reflection" },
  ],
  matatag: [
    { key: "curriculum content", label: "Curriculum Content" },
    { key: "learning resources", label: "Learning Resources" },
    { key: "teaching and learning procedure", label: "Teaching and Learning Procedure" },
    { key: "evaluating learning", label: "Evaluating Learning" },
    { key: "reflection", label: "Reflection" },
  ],
};

function getTemplateId(plan: LessonPlanHistoryDetail): LessonPlanTemplate {
  if (plan.templateId) return plan.templateId;
  const hasDepEd = plan.document?.blocks?.some(
    (b) => b.type === "heading" && b.text === "I. Metadata",
  );
  return hasDepEd ? "deped-semi-detailed" : "lessora-ai";
}

export default function RefineLessonPage() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<LessonPlanHistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    void ensureSession();
    getLessonPlanById(id)
      .then(setPlan)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load plan"))
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  function toggleSection(key: string) {
    setSelectedSections((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  }

  async function handleRefine() {
    if (!id || !plan) return;
    if (selectedSections.length === 0 || !prompt.trim()) {
      setError("Select at least one section and enter a refinement prompt.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const result = await refineLessonPlan({
        lessonPlanId: id,
        selectedSections,
        refinementRequest: prompt.trim(),
      });
      navigate(`/preview/${result.lessonPlanId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refinement failed");
    } finally {
      setIsSubmitting(false);
    }
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
            Generate
          </button>
          <button
            type="button"
            onClick={() => navigate("/discover")}
            className={styles.softSecondary}
          >
            Discover
          </button>
        </nav>
      </header>

      <div className={styles.userAppContainerNarrow}>
        <div className={styles.userAppHero}>
          <p className={styles.eyebrow}>Refine</p>
          <h2 className={styles.userAppHeroTitle}>Refine Lesson Plan</h2>
          <p className={styles.userAppHeroDescription}>
            Choose the parts you want AI to improve, then describe what to change.
          </p>
        </div>

        {isLoading && (
          <div className={styles.userAppCenter}>
            <FaSpinner className={styles.spin} style={{ fontSize: 28, marginBottom: 16 }} />
            <p style={{ color: "var(--color-ink-tertiary)" }}>Loading plan...</p>
          </div>
        )}

        {!isLoading && !error && plan && (
          <>
          {(() => {
            const templateId = getTemplateId(plan);
            const options = templateSections[templateId] ?? templateSections["lessora-ai"];
            return (
            <section className={styles.workspacePanel}>
            <div className={styles.workspaceCard}>
              <p className={styles.planCardTitle}>Plan: {plan.title}</p>
              <div className={styles.chipRow} style={{ marginTop: "var(--spacing-3)" }}>
                <span className={`${styles.chip} ${styles.chipAccent}`}>{plan.subject}</span>
                <span className={`${styles.chip} ${styles.chipPurple}`}>{plan.gradeLevel}</span>
                <span className={`${styles.chip} ${styles.chipSuccess}`}>{plan.totalDuration} min</span>
              </div>
            </div>

            <div className={styles.workspaceCard}>
              <h3 className={styles.panelTitle}>What to refine?</h3>
              <div style={{ display: "grid", gap: "var(--spacing-3)", marginTop: "var(--spacing-4)" }}>
                {options.map((opt) => {
                  const checked = selectedSections.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => toggleSection(opt.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "var(--spacing-3) var(--spacing-4)",
                        border: `1px solid ${checked ? "var(--color-accent)" : "var(--color-rule)"}`,
                        background: checked ? "var(--color-accent-soft)" : "transparent",
                        borderRadius: 0,
                        cursor: "pointer",
                        fontFamily: "var(--font-family-base)",
                        fontSize: 14,
                        color: checked ? "var(--color-accent)" : "var(--color-ink-primary)",
                        textAlign: "left",
                        width: "100%",
                        transition: "border-color var(--transition-fast), background-color var(--transition-fast)",
                      }}
                    >
                      <span>{opt.label}</span>
                      {checked && <FaCheck color="var(--color-accent)" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.workspaceCard}>
              <h3 className={styles.panelTitle}>Refinement Prompt</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Make the procedure more engaging and add clearer student instructions"
                rows={4}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--color-ink-primary)",
                  borderRadius: 0,
                  color: "var(--color-ink-primary)",
                  padding: "var(--spacing-3) 0",
                  fontSize: 16,
                  fontFamily: "var(--font-family-base)",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: "var(--line-height-relaxed)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div className={styles.errorBanner} role="alert" style={{ margin: "var(--spacing-4) 0" }}>
                <FaExclamationTriangle style={{ marginRight: 8 }} />
                {error}
                <button
                  type="button"
                  onClick={handleRefine}
                  disabled={isSubmitting}
                  className={styles.inlineLink}
                  style={{ marginLeft: 12 }}
                >
                  Try again
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: "var(--spacing-3)", flexWrap: "wrap", marginTop: "var(--spacing-6)" }}>
              <button
                type="button"
                onClick={() => navigate("/generate")}
                className={styles.secondaryButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRefine}
                disabled={isSubmitting}
                className={styles.flatButton}
              >
                {isSubmitting ? "Refining..." : "Refine Lesson Plan"}
              </button>
            </div>
          </section>
            );
          })()}
          </>
        )}
      </div>
    </div>
  );
}
