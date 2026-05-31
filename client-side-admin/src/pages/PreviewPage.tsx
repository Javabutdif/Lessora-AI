import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    if (id) {
      loadPlan(id);
    }
  }, [id]);

  async function loadPlan(planId: string) {
    try {
      setIsLoading(true);
      setError("");
      const fetchedPlan = await getLessonPlanById(planId);
      setPlan(fetchedPlan);
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
      const marginTop = index === 0 ? "0" : "24px";
      return (
        <HeadingTag
          key={index}
          style={{
            margin: `${marginTop} 0 12px`,
            fontSize,
            fontWeight: "700",
            color: "#f3f4f6",
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
            fontSize: "15px",
            lineHeight: "1.7",
            color: "rgba(255,255,255,0.85)",
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
            margin: "0 0 16px",
            paddingLeft: "24px",
            fontSize: "15px",
            lineHeight: "1.7",
            color: "rgba(255,255,255,0.85)",
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1425 100%)",
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
            onClick={() => navigate("/generate")}
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
            Generate
          </button>
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
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* Loading State */}
        {isLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
            <p style={{ margin: 0, fontSize: "16px" }}>Loading lesson plan...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div
            style={{
              borderRadius: "12px",
              padding: "20px",
              background: "rgba(239,68,68,0.18)",
              color: "#fecdd3",
              border: "1px solid rgba(248,113,113,0.3)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
            <p style={{ margin: "0 0 12px", fontWeight: "600" }}>Failed to load lesson plan</p>
            <p style={{ margin: "0 0 16px", fontSize: "14px" }}>{error}</p>
            <button
              onClick={() => navigate("/history")}
              style={{
                padding: "8px 16px",
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(248,113,113,0.4)",
                borderRadius: "8px",
                color: "#fecdd3",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Back to History
            </button>
          </div>
        )}

        {/* Lesson Plan Content */}
        {!isLoading && !error && plan && (
          <>
            {/* Header Info */}
            <div
              style={{
                background: "rgba(5,11,22,0.6)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <h1
                style={{
                  margin: "0 0 16px",
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#f3f4f6",
                }}
              >
                {plan.title}
              </h1>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    padding: "6px 12px",
                    background: "rgba(59, 130, 246, 0.15)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#93c5fd",
                    fontWeight: "600",
                  }}
                >
                  📚 {plan.subject}
                </span>
                <span
                  style={{
                    padding: "6px 12px",
                    background: "rgba(124, 58, 237, 0.15)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#c4b5fd",
                    fontWeight: "600",
                  }}
                >
                  🎓 {plan.gradeLevel}
                </span>
                <span
                  style={{
                    padding: "6px 12px",
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#86efac",
                    fontWeight: "600",
                  }}
                >
                  ⏱️ {plan.totalDuration} minutes
                </span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Created: {new Date(plan.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Document Content */}
            <div
              style={{
                background: "rgba(5,11,22,0.6)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: "12px",
                padding: "32px",
              }}
            >
              {plan.document.blocks.map((block, index) => renderBlock(block, index))}
            </div>

            {/* Action Buttons */}
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => navigate("/history")}
                style={{
                  padding: "12px 24px",
                  background: "rgba(148,163,184,0.1)",
                  border: "1px solid rgba(148,163,184,0.3)",
                  borderRadius: "10px",
                  color: "#cbd5e1",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                ← Back to History
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

// Made with Bob
