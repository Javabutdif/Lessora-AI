"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateLessonPlan, LessonPlanTemplate, ensureSession, getSessionInfo } from "@/app/lib/api-client";
import SiteHeader from "@/app/components/site-header";
import styles from "@/portal-theme.module.css";

const gradeOptions = [
  "Preschool", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4",
  "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12", "Senior High School",
];

// Descriptions list the sections each template produces (same sections the refine page offers)
const templateOptions: { label: string; value: LessonPlanTemplate; description: string }[] = [
  { label: "Lessora standard", value: "lessora-ai", description: "Overview, objectives, materials, procedure, assessment, teacher notes" },
  { label: "DepEd semi-detailed", value: "deped-semi-detailed", description: "Competencies, objectives, content, resources, procedure, assessment, assignment, reflection" },
  { label: "Detailed lesson plan", value: "detailed-lesson-plan", description: "Objectives, content, resources, procedures, evaluation, reflection" },
  { label: "Daily lesson log", value: "daily-lesson-log", description: "Objectives, content, resources, procedures, evaluation, remarks, reflection" },
  { label: "MATATAG curriculum", value: "matatag", description: "Curriculum content, resources, procedure, assessment, remarks, reflection" },
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
  const [language, setLanguage] = useState("english");
  const [templateId, setTemplateId] = useState<LessonPlanTemplate>("lessora-ai");
  const [userDraftText, setUserDraftText] = useState("");
  const [templateNotes, setTemplateNotes] = useState("");
  const [activityPreferences, setActivityPreferences] = useState<string[]>([]);
  const [activityPreferenceNotes, setActivityPreferenceNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [sessionsRemainingToday, setSessionsRemainingToday] = useState<number | null>(null);

  useEffect(() => {
    void ensureSession().then(() => loadSessionInfo());
  }, []);

  async function loadSessionInfo() {
    try {
      const info = await getSessionInfo();
      setCreditsRemaining(info.creditsRemaining);
      setSessionsRemainingToday(info.sessionsRemainingToday);
    } catch {
      // Session info unavailable — proceed without display
    }
  }

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
      setCreditsRemaining(result.remainingResponses);
      await loadSessionInfo();
      router.push(`/preview/${result.lessonPlanId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate lesson plan";
      if (message.includes("5 sessions used today") || message.includes("RATE_LIMITED_DAILY")) {
        setError("You have used all 5 sessions for today. Try again tomorrow.");
      } else {
        setError(message);
      }
      await loadSessionInfo();
    } finally {
      setIsLoading(false);
    }
  }

  function toggleActivity(pref: string) {
    setActivityPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref],
    );
  }

  const minutesPerSession = numberOfSessions > 0 ? Math.max(1, Math.floor(duration / numberOfSessions)) : duration;

  return (
    <div className={styles.userAppPage}>
      <SiteHeader current="generate" />

      <main className={styles.userAppContainerNarrow}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>New lesson plan</h1>
          <p className={styles.pageIntro}>
            Fill in parts I to III. Part IV is optional and helps the plan fit your class.
          </p>
        </div>

        {error && (
          <div className={styles.errorPanel} role="alert">
            <p className={styles.centerTitle}>The plan was not generated</p>
            <p className={styles.centerText}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} aria-busy={isLoading}>
          <fieldset disabled={isLoading} className={styles.worksheet}>
            <section className={styles.worksheetPart} aria-labelledby="part-lesson">
              <h2 id="part-lesson" className={styles.worksheetPartTitle}>
                <span className={styles.worksheetNumeral}>I.</span> The lesson
              </h2>
              <div className={styles.worksheetFields}>
                <label className={`${styles.formFieldGap} ${styles.worksheetFieldWide}`}>
                  <span className={styles.formLabel}>Topic</span>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="The water cycle" className={styles.userAppInput} />
                </label>
                <label className={styles.formFieldGap}>
                  <span className={styles.formLabel}>Subject</span>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Science" className={styles.userAppInput} />
                </label>
                <label className={styles.formFieldGap}>
                  <span className={styles.formLabel}>Grade level</span>
                  <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} className={styles.userAppSelect}>
                    {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </label>
              </div>
            </section>

            <section className={styles.worksheetPart} aria-labelledby="part-time">
              <h2 id="part-time" className={styles.worksheetPartTitle}>
                <span className={styles.worksheetNumeral}>II.</span> Class time
              </h2>
              <div className={styles.worksheetFieldsThree}>
                <label className={styles.formFieldGap}>
                  <span className={styles.formLabel}>Total minutes</span>
                  <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={5} max={600} required className={styles.userAppInput} />
                </label>
                <label className={styles.formFieldGap}>
                  <span className={styles.formLabel}>Sessions</span>
                  <input type="number" value={numberOfSessions} onChange={(e) => setNumberOfSessions(Number(e.target.value))} min={1} max={20} required className={styles.userAppInput} />
                </label>
                <label className={styles.formFieldGap}>
                  <span className={styles.formLabel}>Language</span>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className={styles.userAppSelect}>
                    {languageOptions.map((l) => <option key={l} value={l.toLowerCase()}>{l}</option>)}
                  </select>
                </label>
              </div>
              <p className={styles.worksheetHint}>
                {numberOfSessions > 1
                  ? `${numberOfSessions} sessions of about ${minutesPerSession} minutes each`
                  : `One session of ${duration} minutes`}
              </p>
            </section>

            <fieldset className={styles.worksheetPart}>
              <legend className={styles.worksheetPartTitle}>
                <span className={styles.worksheetNumeral}>III.</span> Format
              </legend>
              <div className={styles.choiceList}>
                {templateOptions.map((t) => (
                  <label key={t.value} className={styles.choiceRow}>
                    <input
                      type="radio"
                      name="template"
                      value={t.value}
                      checked={templateId === t.value}
                      onChange={() => setTemplateId(t.value)}
                      className={styles.choiceInput}
                    />
                    <span>
                      <span className={styles.choiceLabel}>{t.label}</span>
                      <span className={styles.choiceDesc}>{t.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <section className={styles.worksheetPart} aria-labelledby="part-notes">
              <h2 id="part-notes" className={styles.worksheetPartTitle}>
                <span className={styles.worksheetNumeral}>IV.</span> Notes for the plan
                <span className={styles.worksheetOptional}>optional</span>
              </h2>

              <label className={styles.formFieldGap}>
                <span className={styles.formLabel}>Goals, standards or your own draft</span>
                <textarea value={userDraftText} onChange={(e) => setUserDraftText(e.target.value)} rows={4} placeholder="Students can explain evaporation and condensation using a diagram." className={styles.userAppTextarea} />
              </label>

              <fieldset className={styles.worksheetSubgroup}>
                <legend className={styles.formLabel}>Activity styles</legend>
                <div className={styles.checkGrid}>
                  {activityOptions.map((opt) => (
                    <label key={opt} className={styles.checkRow}>
                      <input
                        type="checkbox"
                        checked={activityPreferences.includes(opt)}
                        onChange={() => toggleActivity(opt)}
                        className={styles.choiceInput}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                <textarea value={activityPreferenceNotes} onChange={(e) => setActivityPreferenceNotes(e.target.value)} rows={2} placeholder="No materials beyond paper and pencils" aria-label="Notes about activities" className={`${styles.userAppTextarea} ${styles.activityNotesTextarea}`} />
              </fieldset>

              <label className={`${styles.formFieldGap} ${styles.worksheetSubgroup}`}>
                <span className={styles.formLabel}>Notes on the format</span>
                <textarea value={templateNotes} onChange={(e) => setTemplateNotes(e.target.value)} rows={3} placeholder="Include a rubric in the assessment" className={styles.userAppTextarea} />
              </label>
            </section>
          </fieldset>

          <div className={styles.worksheetSubmit}>
            <button type="submit" disabled={isLoading} aria-busy={isLoading} className={styles.flatButton}>
              {isLoading ? "Generating…" : "Generate lesson plan"}
            </button>
            {isLoading ? (
              <p className={styles.busyNote} aria-live="polite">Writing your plan. Keep this tab open.</p>
            ) : (
              (sessionsRemainingToday !== null || creditsRemaining !== null) && (
                <p className={styles.worksheetHint}>
                  {sessionsRemainingToday !== null && `${sessionsRemainingToday} of 5 sessions left today`}
                  {sessionsRemainingToday !== null && creditsRemaining !== null && " · "}
                  {creditsRemaining !== null && `${creditsRemaining} credits left`}
                </p>
              )
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
