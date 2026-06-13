import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBookOpen, FaClock, FaExclamationTriangle, FaHistory, FaPlus, FaSpinner, FaUser } from "react-icons/fa";
import {
  getLessonPlanById,
  getCurrentUser,
  logoutUser,
  LessonPlanHistoryDetail,
} from "../services/api";

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
            color: "#0f172a",
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
            fontSize: "16px",
            lineHeight: "1.8",
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
            paddingLeft: "22px",
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#334155",
          }}
        >
          {block.items.map((item: string, itemIndex: number) => (
            <li key={itemIndex} style={{ marginBottom: "8px" }}>
              {item}
            </li>
          ))}
        </ListTag>
      );
    }

    return null;
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
          <span style={{ fontSize: "14px", color: "#475569", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <FaUser />
            {user?.name || "User"}
          </span>
          <button
            onClick={() => navigate("/generate")}
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
            <FaPlus />
            Generate
          </button>
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
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "32px 16px 56px" }}>
        {isLoading && (
          <div style={{ textAlign: "center", padding: "72px 20px", color: "#64748b" }}>
            <FaSpinner style={{ fontSize: "36px", marginBottom: "16px", animation: "spin 1s linear infinite" }} />
            <p style={{ margin: 0, fontSize: "16px" }}>Loading lesson plan...</p>
          </div>
        )}

        {error && !isLoading && (
          <div
            style={{
              borderRadius: "14px",
              padding: "20px",
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              textAlign: "center",
            }}
          >
            <FaExclamationTriangle style={{ fontSize: "28px", marginBottom: "10px" }} />
            <p style={{ margin: "0 0 10px", fontWeight: "700" }}>Failed to load lesson plan</p>
            <p style={{ margin: "0 0 16px", fontSize: "14px" }}>{error}</p>
            <button
              onClick={() => navigate("/history")}
              style={{
                padding: "8px 16px",
                background: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: "8px",
                color: "#b91c1c",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Back to History
            </button>
          </div>
        )}

        {!isLoading && !error && plan && (
          <>
            <section
              style={{
                background: "#ffffff",
                border: "1px solid rgba(148,163,184,0.22)",
                borderRadius: "16px",
                padding: "28px",
                marginBottom: "24px",
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
              }}
            >
              <p style={{ margin: "0 0 10px", color: "#2563eb", fontSize: "13px", fontWeight: "800", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Lesson Plan Preview
              </p>
              <h1 style={{ margin: "0 0 14px", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: "900", color: "#0f172a", lineHeight: "1.1" }}>
                {plan.title}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                <span style={{ padding: "8px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "999px", fontSize: "13px", color: "#1d4ed8", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <FaBookOpen />
                  {plan.subject}
                </span>
                <span style={{ padding: "8px 12px", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "999px", fontSize: "13px", color: "#6d28d9", fontWeight: "700" }}>
                  Grade: {plan.gradeLevel}
                </span>
                <span style={{ padding: "8px 12px", background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: "999px", fontSize: "13px", color: "#15803d", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <FaClock />
                  {plan.totalDuration} minutes
                </span>
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Created: {new Date(plan.createdAt).toLocaleString()}
              </div>
            </section>

            <section
              style={{
                background: "#ffffff",
                border: "1px solid rgba(148,163,184,0.22)",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                {plan.document.blocks.map((block, index) => renderBlock(block, index))}
              </div>
            </section>

            <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/history")}
                style={{
                  padding: "12px 24px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "10px",
                  color: "#1d4ed8",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Back to History
              </button>
              <button
                onClick={() => navigate("/generate")}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                }}
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
