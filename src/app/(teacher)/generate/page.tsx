"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Translate, House } from "@phosphor-icons/react";
import { generateLessonPlan, LessonPlanTemplate, ensureSession } from "@/app/lib/api-client";
import Dropdown from "@/app/components/ui/dropdown";
import styles from "@/portal-theme.module.css";

const gradeOptions = [
  "Preschool", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4",
  "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12", "Senior High School",
];

const templateOptions: { label: string; value: LessonPlanTemplate; description: string }[] = [
  { label: "Lessora AI Template", value: "lessora-ai", description: "Modern, comprehensive lesson plan format" },
  { label: "DepEd Semi-Detailed", value: "deped-semi-detailed", description: "Official DepEd format for Philippines" },
  { label: "Detailed Lesson Plan", value: "detailed-lesson-plan", description: "Reference-based detailed lesson plan format" },
  { label: "Daily Lesson Log", value: "daily-lesson-log", description: "JSON-based daily log structure" },
  { label: "Matatag Curriculum", value: "matatag", description: "JSON-based Matatag curriculum format" },
];

const languageOptions = ["English", "Tagalog"];
const activityOptions = ["Gamified", "Collaborative Learning", "Hands-on Learning", "Inquiry-Based", "Discussion-Based", "Lecture-Based", "Project-Based", "Individual Work"];

export default function GeneratePlanPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("Grade 1");
  const [duration, setDuration] = useState(60);
  const [numberOfSessions, setNumberOfSessions] = useState(1);
  const [language, setLanguage] = useState("English");
  const [templateId, setTemplateId] = useState<LessonPlanTemplate>("lessora-ai");
  const [userDraftText, setUserDraftText] = useState("");
  const [templateNotes, setTemplateNotes] = useState("");
  const [activityPreferences, setActivityPreferences] = useState<string[]>([]);
  const [activityPreferenceNotes, setActivityPreferenceNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await ensureSession();
      const result = await generateLessonPlan({
        title, subject, gradeLevel, duration, numberOfSessions,
        language: language.toLowerCase(),
        templateId, userDraftText: userDraftText || undefined,
        templateNotes: templateNotes || undefined,
        activityPreferences: activityPreferences.length ? activityPreferences : undefined,
        activityPreferenceNotes: activityPreferenceNotes || undefined,
      });
      router.push(`/preview/${result.lessonPlanId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate lesson plan");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleActivity(pref: string) {
    setActivityPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
    );
  }

  return (
    <div className={styles.userAppPage}>
      <header className={styles.userAppHeader}>
        <a href="/home" className={styles.userAppBrandLink}>
          <h1 className={styles.userAppBrand}>Lessora AI</h1>
        </a>
        <nav className={styles.userAppHeaderActions}>
          <a href="/home" className={styles.softSecondary}><House weight="bold" size={16} /> Home</a>
          <a href="/discover" className={styles.softSecondary}>Browse Plans</a>
          <a href="/support" className={styles.softSecondary}>Support</a>
        </nav>
      </header>

      <div className={styles.userAppContainer}>
        <div className={styles.userAppHero}>
          <p className={styles.eyebrow}>Generate</p>
          <h2 className={styles.userAppHeroTitle}>Create a Lesson Plan</h2>
          <p className={styles.userAppHeroDescription}>Fill in the details below and Let AI build a structured, classroom-ready plan.</p>
        </div>

        {error && (
          <div className={styles.errorPanel}>
            <p className={styles.centerTitle}>Generation failed</p>
            <p className={styles.centerText}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.userAppForm}>
          <div className={styles.userAppFormGrid}>
            <label className={styles.formFieldGap}>
              <span className={styles.formLabel}>Topic / Title *</span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., The Water Cycle" className={styles.userAppInput} />
            </label>

            <label className={styles.formFieldGap}>
              <span className={styles.formLabel}>Subject *</span>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g., Science" className={styles.userAppInput} />
            </label>

            <label className={styles.formFieldGap}>
              <span className={styles.formLabel}>Grade Level *</span>
              <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} className={styles.userAppSelect}>
                {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>

            <label className={styles.formFieldGap}>
              <span className={styles.formLabel}>Duration (minutes) *</span>
              <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={5} max={600} required className={styles.userAppInput} />
            </label>

            <label className={styles.formFieldGap}>
              <span className={styles.formLabel}>Number of Sessions *</span>
              <input type="number" value={numberOfSessions} onChange={(e) => setNumberOfSessions(Number(e.target.value))} min={1} max={20} required className={styles.userAppInput} />
            </label>

            <label className={styles.formFieldGap}>
              <span className={styles.formLabel}>Language *</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={styles.userAppSelect}>
                {languageOptions.map((l) => <option key={l} value={l.toLowerCase()}>{l}</option>)}
              </select>
            </label>
          </div>

          <label className={styles.formFieldGap} style={{ marginTop: 16 }}>
            <span className={styles.formLabel}>Lesson Plan Template</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {templateOptions.map((t) => (
                <div key={t.value} onClick={() => setTemplateId(t.value)} className={`${styles.templateOption} ${templateId === t.value ? styles.templateOptionSelected : ""}`}>
                  <div className={styles.templateOptionLabel}>{t.label}</div>
                  <div className={styles.templateOptionDesc}>{t.description}</div>
                </div>
              ))}
            </div>
          </label>

          <label className={styles.formFieldGap} style={{ marginTop: 16 }}>
            <span className={styles.formLabel}>Teacher Draft / Specific Goals (optional)</span>
            <textarea value={userDraftText} onChange={(e) => setUserDraftText(e.target.value)} rows={4} placeholder="Share any specific standards, objectives, or notes..." className={styles.userAppTextarea} />
          </label>

          <label className={styles.formFieldGap} style={{ marginTop: 16 }}>
            <span className={styles.formLabel}>Activity Preferences (optional)</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {activityOptions.map((opt) => (
                <button key={opt} type="button" onClick={() => toggleActivity(opt)} className={`${styles.activityBtn} ${activityPreferences.includes(opt) ? styles.activityBtnSelected : ""}`}>
                  {opt}
                </button>
              ))}
            </div>
            <textarea value={activityPreferenceNotes} onChange={(e) => setActivityPreferenceNotes(e.target.value)} rows={2} placeholder="Any additional notes about activities..." className={styles.userAppTextarea} style={{ marginTop: 8 }} />
          </label>

          <label className={styles.formFieldGap} style={{ marginTop: 16 }}>
            <span className={styles.formLabel}>Template Notes (optional)</span>
            <textarea value={templateNotes} onChange={(e) => setTemplateNotes(e.target.value)} rows={3} placeholder="Any specific requirements for the template..." className={styles.userAppTextarea} />
          </label>

          <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center" }}>
            <button type="submit" disabled={isLoading} className={styles.flatButton} style={{ minWidth: 160 }}>
              {isLoading ? "Generating..." : "Generate Plan"}
            </button>
            <a href="/discover" className={styles.softSecondary}>Browse existing plans</a>
          </div>
        </form>
      </div>
    </div>
  );
}
