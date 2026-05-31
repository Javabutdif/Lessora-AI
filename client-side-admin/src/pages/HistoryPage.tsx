import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      const fetchedPlans = await listRecentLessonPlans();
      setPlans(fetchedPlans);
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
    if (isNaN(date.getTime())) {
      return "Recently";
    }
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
          maxWidth: "1200px",
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
            Lesson Plan History
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            View and manage your generated lesson plans
          </p>
        </div>

        {/* Search Bar */}
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
              border: "1px solid rgba(148,163,184,0.28)",
              background: "rgba(5,11,22,0.6)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "16px",
              }}
            >
              ⏳
            </div>
            <p style={{ margin: 0, fontSize: "16px" }}>Loading your lesson plans...</p>
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
            <p style={{ margin: "0 0 12px", fontWeight: "600" }}>Failed to load history</p>
            <p style={{ margin: "0 0 16px", fontSize: "14px" }}>{error}</p>
            <button
              onClick={loadPlans}
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
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredPlans.length === 0 && plans.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "rgba(5,11,22,0.6)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                fontSize: "64px",
                marginBottom: "16px",
              }}
            >
              📚
            </div>
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
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Start creating your first lesson plan with AI
            </p>
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
              Generate Lesson Plan
            </button>
          </div>
        )}

        {/* No Search Results */}
        {!isLoading && !error && filteredPlans.length === 0 && plans.length > 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "rgba(5,11,22,0.6)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: "16px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "700" }}>
              No Results Found
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Try a different search term
            </p>
          </div>
        )}

        {/* Lesson Plans Grid */}
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
                  background: "rgba(5,11,22,0.6)",
                  border: "1px solid rgba(148,163,184,0.2)",
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(148,163,184,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#f3f4f6",
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
                      background: "rgba(59, 130, 246, 0.15)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#93c5fd",
                      fontWeight: "600",
                    }}
                  >
                    {plan.subject}
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      background: "rgba(124, 58, 237, 0.15)",
                      border: "1px solid rgba(124, 58, 237, 0.3)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#c4b5fd",
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
                    color: "rgba(255,255,255,0.5)",
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

// Made with Bob
