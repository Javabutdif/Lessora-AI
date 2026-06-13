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
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)", color: "#0f172a" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.82)",
          borderBottom: "1px solid rgba(148,163,184,0.2)",
          backdropFilter: "blur(12px)",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>Lessora AI</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "14px", color: "#475569" }}>{user?.name || "User"}</span>
          <button
            onClick={() => navigate("/history")}
            style={{
              padding: "8px 16px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              color: "#1d4ed8",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaHistory />
            History
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              color: "#b91c1c",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px 48px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: "800", color: "#0f172a" }}>
            Generate Lesson Plan
          </h2>
          <p style={{ margin: 0, fontSize: "16px", color: "#475569" }}>
            Create a professional lesson plan in minutes with AI
          </p>
        </div>

        <form
          onSubmit={handleGenerate}
          style={{
            background: "#ffffff",
            border: "1px solid rgba(148,163,184,0.22)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                <FaBookOpen style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
                Topic/Subject <span style={{ color: "#ef4444" }}>*</span>
              </span>
              <input
                type="text"
                value={topicSubject}
                onChange={(e) => setTopicSubject(e.target.value)}
                placeholder="e.g., Photosynthesis, World War II, Fractions"
                disabled={isGenerating}
                required
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                <FaGraduationCap style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
                Grade Level <span style={{ color: "#ef4444" }}>*</span>
              </span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                disabled={isGenerating}
                required
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                }}
              >
                <option value="">Select grade level</option>
                {gradeOptions.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                <FaLanguage style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
                Language <span style={{ color: "#ef4444" }}>*</span>
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isGenerating}
                required
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                }}
              >
                <option value="">Select language</option>
                {languageOptions.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                <FaBookOpen style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
                Duration (minutes) <span style={{ color: "#ef4444" }}>*</span>
              </span>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 60"
                min="5"
                disabled={isGenerating}
                required
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </label>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                Template
              </span>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as LessonPlanTemplate)}
                disabled={isGenerating}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  fontSize: "14px",
                }}
              >
                {templateOptions.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label} - {template.description}
                  </option>
                ))}
              </select>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                Learning Goals/Standards (Optional)
              </span>
              <textarea
                value={goalsStandards}
                onChange={(e) => setGoalsStandards(e.target.value)}
                placeholder="Add any specific learning objectives, standards, or notes..."
                disabled={isGenerating}
                rows={4}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </label>

            {error && (
              <div
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              style={{
                padding: "16px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
                color: "#fff",
                cursor: isGenerating ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: "16px",
                opacity: isGenerating ? 0.7 : 1,
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
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
