import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaHistory,
  FaPlus,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";
import {
  listRecentLessonPlans,
  getCurrentUser,
  logoutUser,
  LessonPlanHistoryItem,
} from "../services/api";

export default function HistoryPage() {
  const [plans, setPlans] = useState<LessonPlanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      setIsLoading(true);
      setError("");
      setPlans(await listRecentLessonPlans());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Recently";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const filteredPlans = plans.filter((plan) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      plan.title.toLowerCase().includes(query) ||
      plan.subject.toLowerCase().includes(query) ||
      plan.gradeLevel.toLowerCase().includes(query)
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        color: "#0f172a",
      }}
    >
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
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>
          Lessora AI
        </h1>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "14px", color: "#475569" }}>
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

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "32px",
              fontWeight: "800",
              color: "#475569",
            }}
          >
            Lesson Plan History
          </h2>
          <p style={{ margin: 0, fontSize: "16px", color: "#475569" }}>
            View and manage your generated lesson plans
          </p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, subject, or grade level..."
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              background: "#fff",
              color: "#0f172a",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {isLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#64748b",
            }}
          >
            <FaSpinner style={{ fontSize: "40px", marginBottom: "16px" }} />
            <p style={{ margin: 0, fontSize: "16px" }}>
              Loading your lesson plans...
            </p>
          </div>
        )}

        {error && !isLoading && (
          <div
            style={{
              borderRadius: "12px",
              padding: "20px",
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              textAlign: "center",
            }}
          >
            <FaExclamationTriangle
              style={{ fontSize: "32px", marginBottom: "12px" }}
            />
            <p style={{ margin: "0 0 12px", fontWeight: "600" }}>
              Failed to load history
            </p>
            <p style={{ margin: "0 0 16px", fontSize: "14px" }}>{error}</p>
            <button
              onClick={loadPlans}
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
              Try Again
            </button>
          </div>
        )}

        {!isLoading &&
          !error &&
          filteredPlans.length === 0 &&
          plans.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#ffffff",
                border: "1px solid rgba(148,163,184,0.22)",
                borderRadius: "16px",
              }}
            >
              <FaHistory
                style={{
                  fontSize: "64px",
                  marginBottom: "16px",
                  color: "#2563eb",
                }}
              />
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                No Lesson Plans Yet
              </h3>
              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: "14px",
                  color: "#64748b",
                }}
              >
                Start creating your first lesson plan with AI
              </p>
              <button
                onClick={() => navigate("/generate")}
                style={{
                  padding: "12px 24px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                }}
              >
                Generate Lesson Plan
              </button>
            </div>
          )}

        {!isLoading &&
          !error &&
          filteredPlans.length === 0 &&
          plans.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#ffffff",
                border: "1px solid rgba(148,163,184,0.22)",
                borderRadius: "16px",
              }}
            >
              <FaSearch
                style={{
                  fontSize: "48px",
                  marginBottom: "16px",
                  color: "#2563eb",
                }}
              />
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                No Results Found
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                Try a different search term
              </p>
            </div>
          )}

        {!isLoading && !error && filteredPlans.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => navigate(`/preview/${plan.id}`)}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(148,163,184,0.22)",
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#0f172a",
                  }}
                >
                  {plan.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 10px",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#1d4ed8",
                      fontWeight: "600",
                    }}
                  >
                    {plan.subject}
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      background: "#f5f3ff",
                      border: "1px solid #ddd6fe",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#6d28d9",
                      fontWeight: "600",
                    }}
                  >
                    {plan.gradeLevel}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  <span>{plan.totalDuration} min</span>
                  <span>{formatDate(plan.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
