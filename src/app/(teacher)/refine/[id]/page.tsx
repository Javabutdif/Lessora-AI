"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPublicLessonPlanById, refineLessonPlan, LessonPlanTemplate, LessonPlanHistoryDetail, ensureSession } from "@/app/lib/api-client";
import SiteHeader from "@/app/components/site-header";
import LoadingSkeleton from "@/app/components/loading-skeleton";
import styles from "@/portal-theme.module.css";

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
    { key: "procedure", label: "Procedure" },
    { key: "assessment", label: "Assessment" },
    { key: "remarks", label: "Remarks" },
    { key: "reflection", label: "Reflection" },
  ],
};

export default function RefineLessonPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<LessonPlanHistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [refinementRequest, setRefinementRequest] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    void ensureSession();
    if (id) loadPlan(id);
  }, [id]);

  async function loadPlan(planId: string) {
    try {
      setIsLoading(true);
      setError("");
      const data = await getPublicLessonPlanById(planId);
      setPlan(data);
      setSelectedSections([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lesson plan");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleSection(key: string) {
    setSelectedSections((prev) => prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]);
  }

  async function handleRefine() {
    if (!plan || selectedSections.length === 0 || !refinementRequest.trim()) return;
    try {
      setIsRefining(true);
      const result = await refineLessonPlan({
        lessonPlanId: plan.id,
        selectedSections,
        refinementRequest,
      });
      router.push(`/preview/${result.lessonPlanId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refinement failed");
    } finally {
      setIsRefining(false);
    }
  }

  return (
    <div className={styles.userAppPage}>
      <SiteHeader />

      <main className={styles.userAppContainerNarrow}>
        {isLoading && <LoadingSkeleton lines={6} label="Loading lesson plan" />}

        {error && !isLoading && !plan && (
          <div className={styles.errorPanel} role="alert">
            <p className={styles.centerTitle}>This lesson plan could not be loaded</p>
            <p className={styles.centerText}>{error}</p>
            <a href="/generate" className={styles.softSecondary}>Start a new plan</a>
          </div>
        )}

        {!isLoading && plan && (
          <>
            <div className={styles.pageHead}>
              <p className={styles.metaLine}>{plan.subject} · {plan.gradeLevel} · {plan.totalDuration} min</p>
              <h1 className={styles.pageTitle}>Refine: {plan.title}</h1>
              <p className={styles.pageIntro}>Tick the sections to rewrite and say what should change. The rest of the plan stays as it is.</p>
            </div>

            <fieldset disabled={isRefining} className={styles.worksheet}>
              <fieldset className={styles.worksheetPart}>
                <legend className={styles.worksheetPartTitle}>
                  <span className={styles.worksheetNumeral}>I.</span> Sections to rewrite
                </legend>
                <div className={styles.refineChecklist}>
                  {(templateSections[plan.templateId || "lessora-ai"] || templateSections["lessora-ai"]).map((opt) => (
                    <label key={opt.key} className={styles.checkRow}>
                      <input
                        type="checkbox"
                        checked={selectedSections.includes(opt.key)}
                        onChange={() => toggleSection(opt.key)}
                        className={styles.choiceInput}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <section className={styles.worksheetPart} aria-labelledby="part-change">
                <h2 id="part-change" className={styles.worksheetPartTitle}>
                  <span className={styles.worksheetNumeral}>II.</span> What should change
                </h2>
                <textarea value={refinementRequest} onChange={(e) => setRefinementRequest(e.target.value)} rows={4} aria-labelledby="part-change" placeholder="Make the activities more hands-on for Grade 4 and add examples from the market or barangay." className={styles.userAppTextarea} />
              </section>
            </fieldset>

            {error && !isRefining && <p className={`${styles.errorText} ${styles.refineErrorText}`} role="alert">{error}</p>}

            <div className={styles.worksheetSubmit}>
              <button type="button" onClick={handleRefine} disabled={isRefining || selectedSections.length === 0 || !refinementRequest.trim()} aria-busy={isRefining} className={styles.flatButton}>
                {isRefining ? "Refining…" : "Refine plan"}
              </button>
              {isRefining ? (
                <p className={styles.busyNote} aria-live="polite">Rewriting the sections you ticked. Keep this tab open.</p>
              ) : (
                <a href={`/preview/${plan.id}`} className={styles.softSecondary}>Back to the plan</a>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
