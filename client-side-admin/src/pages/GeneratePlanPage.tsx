import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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
  {
    label: "Lessora AI Template",
    value: "lessora-ai",
    description: "Modern, comprehensive lesson plan format",
  },
  {
    label: "DepEd Semi-Detailed",
    value: "deped-semi-detailed",
    description: "Official DepEd format for Philippines",
  },
  {
    label: "Detailed Lesson Plan",
    value: "detailed-lesson-plan",
    description: "Reference-based detailed lesson plan format",
  },
  {
    label: "Daily Lesson Log",
    value: "daily-lesson-log",
    description: "JSON-based daily log structure",
  },
  {
    label: "Matatag Curriculum Lesson Plan",
    value: "matatag",
    description: "JSON-based Matatag curriculum format",
  },
];

const languageOptions = [
  { label: "English", value: "english" },
  { label: "Tagalog", value: "tagalog" },
];

export default function GeneratePlanPage() {
  const [topicSubject, setTopicSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [duration, setDuration] = useState("");
  const [numberOfSessions, setNumberOfSessions] = useState("1");
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
    const parsedSessions = Number(numberOfSessions);

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

    if (!Number.isInteger(parsedSessions) || parsedSessions < 1) {
      setError("Number of sessions must be at least 1");
      setIsGenerating(false);
      return;
    }

    try {
      const response = await generateLessonPlan({
        title: topicSubject.trim(),
        subject: topicSubject.trim(),
        gradeLevel: selectedGrade,
        duration: parsedDuration,
        numberOfSessions: parsedSessions,
        userDraftText: goalsStandards.trim() || undefined,
        templateId: selectedTemplate,
        language: selectedLanguage,
      });

      console.log("Lesson plan generated:", response.lessonPlanId);
      navigate(`/preview/${response.lessonPlanId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate lesson plan",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1425 100%)",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(5,11,22,0.6)",
          borderBottom: "1px solid rgba(148,163,184,0.1)",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
          Lessora AI
        </h1>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
            {user?.name || "User"}
          </span>
          <button
            onClick={() => navigate("/history")}
            style={{
              padding: "8px 16px",
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "8px",
              color: "#60a5fa",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            History
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              color: "#fca5a5",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "32px",
              fontWeight: "800",
            }}
          >
            Generate Lesson Plan
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Create a professional lesson plan in minutes with AI
          </p>
        </div>

        <form
          onSubmit={handleGenerate}
          style={{
            background: "rgba(5,11,22,0.6)",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Topic/Subject */}
            <label
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
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
                  border: "1px solid rgba(148,163,184,0.28)",
                  background: "#020817",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </label>

            {/* Grade Level */}
            <label
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
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
                  border: "1px solid rgba(148,163,184,0.28)",
                  background: "#020817",
                  color: "#fff",
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

            {/* Grade Level */}
            <label
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
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
                  border: "1px solid rgba(148,163,184,0.28)",
                  background: "#020817",
                  color: "#fff",
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

            {/* Duration and Sessions Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <label
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
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
                    border: "1px solid rgba(148,163,184,0.28)",
                    background: "#020817",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </label>

              <label
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Number of Sessions
                </span>
                <input
                  type="number"
                  value={numberOfSessions}
                  onChange={(e) => setNumberOfSessions(e.target.value)}
                  placeholder="1"
                  min="1"
                  disabled={isGenerating}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(148,163,184,0.28)",
                    background: "#020817",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </label>
            </div>

            {/* Template Selection */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                Template
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {templateOptions.map((template) => (
                  <label
                    key={template.value}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "16px",
                      background:
                        selectedTemplate === template.value
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(148,163,184,0.05)",
                      border:
                        selectedTemplate === template.value
                          ? "1px solid rgba(59, 130, 246, 0.5)"
                          : "1px solid rgba(148,163,184,0.15)",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={template.value}
                      checked={selectedTemplate === template.value}
                      onChange={(e) =>
                        setSelectedTemplate(
                          e.target.value as LessonPlanTemplate,
                        )
                      }
                      disabled={isGenerating}
                      style={{ marginTop: "2px" }}
                    />
                    <div>
                      <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                        {template.label}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        {template.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Goals/Standards (Optional) */}
            <label
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
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
                  border: "1px solid rgba(148,163,184,0.28)",
                  background: "#020817",
                  color: "#fff",
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
                  background: "rgba(239,68,68,0.18)",
                  color: "#fecdd3",
                  border: "1px solid rgba(248,113,113,0.3)",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
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
                transition: "all 0.3s",
                opacity: isGenerating ? 0.7 : 1,
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
              }}
            >
              {isGenerating ? "Generating..." : "🚀 Generate Lesson Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Made with Bob
