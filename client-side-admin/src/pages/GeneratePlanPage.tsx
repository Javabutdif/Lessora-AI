import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaGraduationCap,
  FaHistory,
  FaLanguage,
  FaRobot,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  generateLessonPlan,
  getCurrentUser,
  logoutUser,
  LessonPlanTemplate,
} from "../services/api";
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
  const navigate = useNavigate();
  const user = getCurrentUser();

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
      const response = await generateLessonPlan({
        title: topicSubject.trim(),
        subject: topicSubject.trim(),
        gradeLevel: selectedGrade,
        duration: parsedDuration,
        numberOfSessions: 1,
        userDraftText: goalsStandards.trim() || undefined,
        templateNotes: goalsStandards.trim() || undefined,
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

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div className={styles.userAppPage}>
      <header className={styles.userAppHeader}>
        <h1 className={styles.userAppBrand}>Lessora AI</h1>
        <div className={styles.userAppHeaderActions}>
          <span className={styles.userAppUser}>{user?.name || "User"}</span>
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
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      <div className={styles.userAppContainerNarrow}>
        <div className={styles.userAppHero}>
          <h2 className={styles.userAppHeroTitle}>Generate Lesson Plan</h2>
          <p className={styles.userAppHeroDescription}>
            Create a professional lesson plan in minutes with AI
          </p>
        </div>

        <form onSubmit={handleGenerate} className={styles.planCard}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                <FaBookOpen style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />
                Topic/Subject <span style={{ color: "var(--color-error)" }}>*</span>
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
            </label>

            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                <FaGraduationCap style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />
                Grade Level <span style={{ color: "var(--color-error)" }}>*</span>
              </span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                disabled={isGenerating}
                required
                className={styles.userAuthInput}
                style={{ cursor: "pointer" }}
              >
                <option value="">Select grade level</option>
                {gradeOptions.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                Activity Preferences
              </span>
              <div className={styles.userAuthCheckboxGroup} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
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
                ].map((option) => (
                  <label key={option} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      checked={selectedActivityPreferences.includes(option)}
                      disabled={isGenerating}
                      onChange={() => {
                        setSelectedActivityPreferences((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option],
                        );
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                Additional Activity Preferences (optional)
              </span>
              <input
                type="text"
                value={activityPreferenceNotes}
                onChange={(e) => setActivityPreferenceNotes(e.target.value)}
                placeholder="Examples: Avoid role playing, Use simple classroom materials"
                disabled={isGenerating}
                className={styles.userAuthInput}
              />
            </label>

            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                <FaLanguage style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />
                Language <span style={{ color: "var(--color-error)" }}>*</span>
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isGenerating}
                required
                className={styles.userAuthInput}
                style={{ cursor: "pointer" }}
              >
                <option value="">Select language</option>
                {languageOptions.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                <FaBookOpen style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />
                Duration (minutes) <span style={{ color: "var(--color-error)" }}>*</span>
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
            </label>

            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>Template</span>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as LessonPlanTemplate)}
                disabled={isGenerating}
                className={styles.userAuthInput}
                style={{ cursor: "pointer" }}
              >
                {templateOptions.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label} - {template.description}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.userAuthField}>
              <span className={styles.userAuthLabel}>
                Learning Goals/Standards (Optional)
              </span>
              <textarea
                value={goalsStandards}
                onChange={(e) => setGoalsStandards(e.target.value)}
                placeholder="Add any specific learning objectives, standards, or notes..."
                disabled={isGenerating}
                rows={4}
                className={styles.userAuthTextarea}
              />
            </label>

            {error ? <div className={styles.userAuthError}>{error}</div> : null}

            <button
              type="submit"
              disabled={isGenerating}
              className={`${styles.flatButton} ${styles.flatButtonXLarge}`}
            >
              <FaRobot />
              {isGenerating ? "Generating..." : "Generate Lesson Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}