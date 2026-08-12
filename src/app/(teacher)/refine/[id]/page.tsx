"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Spinner, Warning, Check, House } from "@phosphor-icons/react";
import { getLessonPlanById, refineLessonPlan, LessonPlanTemplate, LessonPlanHistoryDetail } from "@/app/lib/api-client";
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
    if (id) loadPlan(id);
  }, [id]);

  async function loadPlan(planId: string) {
    try {
      setIsLoading(true);
      setError("");
      const data = await getLessonPlanById(planId);
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
      <header className={styles.userAppHeader}>
        <a href="/home" className={styles.userAppBrandLink}><h1 className={styles.userAppBrand}>Lessora AI</h1></a>
        <div className={styles.userAppHeaderActions}>
          <a href="/home" className={styles.softSecondary}><House weight="bold" size={16} /> Home</a>
          <button type="button" onClick={() => router.back()} className={styles.softSecondary}>Back</button>
        </div>
      </header>

      <div className={styles.userAppContainer}>
        <div className={styles.userAppHero}>
          <p className={styles.eyebrow}>Refine</p>
          <h2 className={styles.userAppHeroTitle}>Refine Your Lesson Plan</h2>
          <p className={styles.userAppHeroDescription}>Select sections to update and describe what you&apos;d like to change.</p>
        </div>

        {isLoading && (
          <div className={styles.userAppCenter}>
            <Spinner weight="fill" size={32} className={styles.spin} />
            <p className={styles.centerTextSmall}>Loading...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.errorPanel}>
            <Warning size={28} className={styles.iconWithBottom} />
            <p className={styles.centerTitle}>Failed to load plan</p>
            <p className={styles.centerText}>{error}</p>
            <button type="button" onClick={() => router.push("/generate")} className={styles.softSecondary}>Back to Generate</button>
          </div>
        )}

        {!isLoading && !error && plan && (
          <>
            <section className={styles.planCardSpacious}>
              <p className={styles.planCardTitle}>{plan.title}</p>
              <div className={styles.chipRow}>
                <span className={`${styles.chip} ${styles.chipAccent}`}>{plan.subject}</span>
                <span className={`${styles.chip} ${styles.chipPurple}`}>{plan.gradeLevel}</span>
              </div>
            </section>

            <section style={{ marginTop: 24 }}>
              <h3 style={{ fontFamily: "var(--font-family-display)", fontSize: "var(--font-size-lg)", fontWeight: 600, marginBottom: 16 }}>Select sections to refine</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(templateSections[plan.templateId || "lessora-ai"] || templateSections["lessora-ai"]).map((opt) => (
                  <button key={opt.key} type="button" onClick={() => toggleSection(opt.key)} style={{ padding: "8px 16px", border: `2px solid ${selectedSections.includes(opt.key) ? "var(--color-accent)" : "var(--color-rule)"}`, borderRadius: 4, background: selectedSections.includes(opt.key) ? "var(--color-accent-tint)" : "transparent", color: selectedSections.includes(opt.key) ? "var(--color-accent)" : "var(--color-ink-secondary)", cursor: "pointer", fontSize: 13, fontWeight: selectedSections.includes(opt.key) ? 600 : 400 }}>
                    {selectedSections.includes(opt.key) && <Check weight="fill" size={12} style={{ marginRight: 4 }} />}
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            <section style={{ marginTop: 24 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>What would you like to change?</span>
                <textarea value={refinementRequest} onChange={(e) => setRefinementRequest(e.target.value)} rows={4} placeholder="e.g., Make the activities more interactive for Grade 4 students, add more real-world examples..." className={styles.userAppTextarea} />
              </label>
            </section>

            {error && <p className={styles.errorText} style={{ marginTop: 16 }}>{error}</p>}

            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button type="button" onClick={handleRefine} disabled={isRefining || selectedSections.length === 0 || !refinementRequest.trim()} className={styles.flatButton}>
                {isRefining ? "Refining..." : "Refine Plan"}
              </button>
              <button type="button" onClick={() => router.push(`/preview/${plan.id}`)} className={styles.softSecondary}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
