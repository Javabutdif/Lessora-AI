import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Translate,
  House,
} from "@phosphor-icons/react";
import {
  generateLessonPlan,
  LessonPlanTemplate,
  ensureSession,
} from "../services/api";
import Dropdown from "../components/ui/Dropdown";
import styles from "../styles/PortalTheme.module.css";

const gradeOptions = [
  { label: "Preschool", value: "preschool" },
  { label: "Kindergarten", value: "kindergarten" },
  { label: "Grade 1", value: "grade1" },
  { label: "Grade 2", value: "grade2" },
  { label: "Grade 3", value: "grade3" },
  { label: "Grade 4", value: "grade4" },
  { label: "Grade 5", value: "grade5" },
  { label: "Grade 6", value: "grade6" },
  { label: "Grade 7", value: "grade7" },
  { label: "Grade 8", value: "grade8" },
  { label: "Grade 9", value: "grade9" },
  { label: "Grade 10", value: "grade10" },
  { label: "Grade 11", value: "grade11" },
  { label: "Grade 12", value: "grade12" },
  { label: "Senior High School", value: "seniorhigh" },
];

const templateOptions: {
  label: string;
  value: LessonPlanTemplate;
  description: string;
}[] = [
  { label: "Lessora AI Template", value: "lessora-ai", description: "Modern, comprehensive lesson plan format" },
  { label: "DepEd Semi-Detailed", value: "deped-semi-detailed", description: "Official DepEd format for Philippines" },
  { label: "Detailed Lesson Plan", value: "detailed-lesson-plan", description: "Reference-based detailed lesson plan format" },
  { label: "Daily Lesson Log", value: "daily-lesson-log", description: "JSON-based daily log structure" },
  { label: "Matatag Curriculum Lesson Plan", value: "matatag", description: "JSON-based Matatag curriculum format" },
];

const languageOptions = [
  { label: "English", value: "english" },
  { label: "Tagalog", value: "tagalog" },
];

const activityOptions = [
  "Gamified",
  "Collaborative Learning",
  "Hands-on Learning",
  "Inquiry-Based",
  "Discussion-Based",
  "Lecture-Based",
  "Project-Based",
  "Individual Work",
  "Pair Work",
  "Group Work",
  "ICT-Assisted",
  "Creative Activities",
];

export default function GeneratePlanPage() {
  const [topicSubject, setTopicSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [duration, setDuration] = useState("");
  const [goalsStandards, setGoalsStandards] = useState("");
  const [selectedActivityPreferences, setSelectedActivityPreferences] = useState<string[]>([]);
  const [activityPreferenceNotes, setActivityPreferenceNotes] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<LessonPlanTemplate>("lessora-ai");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);
  const navigate = useNavigate();

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setError("");

    const parsedDuration = Number(duration);
    if (!topicSubject.trim() || !selectedGrade || !duration.trim()) {
      setError("Please fill in all required fields");
      setIsGenerating(false);
      return;
    }

    if (!Number.isInteger(parsedDuration) || parsedDuration < 5) {
      setError("Duration must be a whole number of at least 5 minutes");
      setIsGenerating(false);
      return;
    }

    try {
      await ensureSession();
      const gradeLabels: Record<string, string> = {
        preschool: "Preschool",
        kindergarten: "Kindergarten",
        grade1: "Grade 1",
        grade2: "Grade 2",
        grade3: "Grade 3",
        grade4: "Grade 4",
        grade5: "Grade 5",
        grade6: "Grade 6",
        grade7: "Grade 7",
        grade8: "Grade 8",
        grade9: "Grade 9",
        grade10: "Grade 10",
        grade11: "Grade 11",
        grade12: "Grade 12",
        seniorhigh: "Senior High School",
      };
      const response = await generateLessonPlan({
        title: topicSubject.trim(),
        subject: topicSubject.trim(),
        gradeLevel: gradeLabels[selectedGrade] || selectedGrade,
        duration: parsedDuration,
        numberOfSessions: 1,
        userDraftText: goalsStandards.trim() || undefined,
        templateNotes: undefined,
        activityPreferences: selectedActivityPreferences,
        activityPreferenceNotes: activityPreferenceNotes.trim() || undefined,
        templateId: selectedTemplate,
        language: selectedLanguage,
      });

      navigate(`/preview/${response.lessonPlanId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate lesson plan");
    } finally {
      setIsGenerating(false);
    }
  }

  function toggleActivity(option: string) {
    setSelectedActivityPreferences((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  return (
    <div className={styles.userAppPage}>
      <header className={styles.userAppHeader}>
        <Link to="/" className={styles.userAppBrandLink}>
          <h1 className={styles.userAppBrand}>Lessora AI</h1>
        </Link>
        <div className={styles.userAppHeaderActions}>
          <Link to="/" className={styles.softSecondary} style={{ padding: "var(--spacing-2) var(--spacing-3)" }}>
            <House weight="bold" size={16} /> Home
          </Link>
          <button
            type="button"
            onClick={() => navigate("/discover")}
            className={styles.softSecondary}
          >
            Browse
          </button>
        </div>
      </header>

      <div className={styles.userAppContainerNarrow}>
        <div className={styles.userAppHero}>
          <h2 className={styles.userAppHeroTitle}>Generate Lesson Plan</h2>
          <p className={styles.userAppHeroDescription}>
            Tell us what you are teaching and we will build a complete, structured plan for you.
          </p>
        </div>

        <div className={styles.formHelperBanner}>
          <p className={styles.formHelperBannerText}>
            Fields marked with an asterisk are required. Everything else is optional — only fill in what helps your class.
          </p>
        </div>

        <form onSubmit={handleGenerate} className={styles.planCard}>
          <div className={styles.formColumn}>
            {/* REQUIRED SECTION */}
            <h3 className={styles.formSectionTitle}>The basics</h3>

            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                <BookOpen weight="fill" size={14} className={styles.labelIcon} />
                Topic / Subject <span className={styles.errorAsterisk}>*</span>
              </span>
              <input
                type="text"
                value={topicSubject}
                onChange={(e) => setTopicSubject(e.target.value)}
                placeholder="e.g., Photosynthesis, World War II, Fractions"
                disabled={isGenerating}
                required
                className={styles.userAuthInput}
              />
              <span className={styles.fieldHelper}>What are your students learning about this lesson?</span>
            </label>

            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                <GraduationCap weight="fill" size={14} className={styles.labelIcon} />
                Grade Level <span className={styles.errorAsterisk}>*</span>
              </span>
              <Dropdown
                options={gradeOptions.map((g) => ({ value: g.value, label: g.label }))}
                value={selectedGrade}
                onChange={(v) => setSelectedGrade(v)}
                placeholder="Select grade level"
                disabled={isGenerating}
                fullWidth
              />
              <span className={styles.fieldHelper}>What grade are your students in?</span>
            </label>

            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                Duration (minutes) <span className={styles.errorAsterisk}>*</span>
              </span>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 60"
                min={5}
                disabled={isGenerating}
                required
                className={styles.userAuthInput}
              />
              <span className={styles.fieldHelper}>How long is your class period?</span>
            </label>

            <hr className={styles.sectionDivider} />

            {/* OPTIONAL SECTION */}
            <button
              type="button"
              onClick={() => setShowPreferences((v) => !v)}
              className={styles.compactToggle}
            >
              {showPreferences ? "Hide preferences" : "Show preferences"}
            </button>

            {showPreferences && (
              <div className={styles.formColumnNoTopPad}>
                <label className={styles.prefField}>
                  <span className={styles.prefFieldLabel}>
                    <Translate weight="fill" size={14} className={styles.labelIcon} />
                    Language
                  </span>
                  <Dropdown
                    options={languageOptions}
                    value={selectedLanguage}
                    onChange={(v) => setSelectedLanguage(v)}
                    disabled={isGenerating}
                    fullWidth
                  />
                </label>

                <label className={styles.prefField}>
                  <span className={styles.prefFieldLabel}>Template</span>
                  <Dropdown
                    options={templateOptions.map((t) => ({ value: t.value, label: t.label }))}
                    value={selectedTemplate}
                    onChange={(v) => setSelectedTemplate(v as LessonPlanTemplate)}
                    disabled={isGenerating}
                    fullWidth
                  />
                </label>

                <div className={styles.prefField}>
                  <span className={styles.prefFieldLabel}>Activity Preferences</span>
                  <div className={styles.activityGroup}>
                    {activityOptions.map((option) => {
                      const isActive = selectedActivityPreferences.includes(option);
                      return (
                        <label
                          key={option}
                          className={`${styles.activityChip} ${isActive ? styles.activityChipSelected : ""} ${isGenerating ? styles.activityChipDisabled : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={isActive}
                            disabled={isGenerating}
                            onChange={() => toggleActivity(option)}
                            className={styles.selectPointer}
                          />
                          <span className={`${styles.activityChipText} ${isActive ? styles.activityChipTextSelected : ""}`}>
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label className={styles.prefField}>
                  <span className={styles.prefFieldLabel}>Additional Activity Notes (optional)</span>
                  <input
                    type="text"
                    value={activityPreferenceNotes}
                    onChange={(e) => setActivityPreferenceNotes(e.target.value)}
                    placeholder="e.g., Avoid role playing, Use simple classroom materials"
                    disabled={isGenerating}
                    className={styles.userAuthInput}
                  />
                </label>

                <label className={styles.prefField}>
                  <span className={styles.prefFieldLabel}>Learning Goals / Standards (optional)</span>
                  <textarea
                    value={goalsStandards}
                    onChange={(e) => setGoalsStandards(e.target.value)}
                    placeholder="Add any specific learning objectives, standards, or notes..."
                    disabled={isGenerating}
                    rows={4}
                    className={styles.userAuthTextarea}
                  />
                </label>
              </div>
            )}

            {error ? (
              <div className={styles.userAuthError} role="alert">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={isGenerating}
              className={`${styles.flatButton} ${styles.flatButtonXLarge}`}
            >
              {isGenerating ? "Generating..." : "Generate Lesson Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
