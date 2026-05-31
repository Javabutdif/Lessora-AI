import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, fetchAdminStats } from "../services/api";

interface StatCard {
  label: string;
  value: number | string;
  helper: string;
  accent: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    activeUsers: number;
    totalLessonPlans: number;
    publishedLessonPlans: number;
    generatedLast7Days: number;
    generationRate: number;
  } | null>(null);
  const [status, setStatus] = useState("loading");
  const [serverMessage, setServerMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const statsPayload = await fetchAdminStats();
        if (!mounted) return;

        setStats(statsPayload);

        const healthResponse = await fetch(`${API_BASE}/api/health`);
        const healthPayload = await healthResponse.json();
        setStatus(healthPayload.status === "ok" ? "online" : "degraded");
        setServerMessage(
          `Backend ${healthPayload.status} • ${new Date(healthPayload.timestamp).toLocaleTimeString()}`,
        );
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard metrics",
        );
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo<StatCard[]>(() => {
    if (!stats) {
      return [];
    }

    return [
      {
        label: "Total users",
        value: stats.totalUsers,
        helper: "Registered accounts in shared backend",
        accent: "#60a5fa",
      },
      {
        label: "Active users",
        value: stats.activeUsers,
        helper: "Users with recent login activity",
        accent: "#22c55e",
      },
      {
        label: "Lesson plans",
        value: stats.totalLessonPlans,
        helper: "Stored generated plans across the platform",
        accent: "#f59e0b",
      },
      {
        label: "Published plans",
        value: stats.publishedLessonPlans,
        helper: "Plans marked published",
        accent: "#fb7185",
      },
      {
        label: "7-day generations",
        value: stats.generatedLast7Days,
        helper: "Recent AI lesson generation activity",
        accent: "#2dd4bf",
      },
      {
        label: "Generation rate",
        value: `${stats.generationRate}/day`,
        helper: "Average daily generation volume",
        accent: "#c084fc",
      },
    ];
  }, [stats]);

  function handleLogout() {
    localStorage.removeItem("lessora-admin-token");
    localStorage.removeItem("lessora-admin-user");
    navigate("/admin/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#fff",
        padding: "24px",
        background: "linear-gradient(180deg, #020817, #040b18 35%, #01060f)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            borderRadius: "24px",
            padding: "18px 20px",
            background: "rgba(5,11,22,0.86)",
            border: "1px solid rgba(96,165,250,0.22)",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                color: "#60a5fa",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Lessora Admin
            </p>
            <h1 style={{ margin: 0, fontSize: "30px" }}>Platform dashboard</h1>
            <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.68)" }}>
              Shared backend analytics for the web and mobile platform.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                borderRadius: "999px",
                padding: "8px 10px",
                background:
                  status === "online"
                    ? "rgba(34,197,94,0.16)"
                    : "rgba(245,158,11,0.16)",
                color: status === "online" ? "#86efac" : "#fde68a",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {status === "online" ? "Backend online" : "Checking backend"}
            </div>
            <button
              onClick={() => navigate("/admin/users")}
              style={{
                borderRadius: "10px",
                border: "1px solid rgba(96,165,250,0.4)",
                background: "rgba(96,165,250,0.1)",
                color: "#60a5fa",
                cursor: "pointer",
                padding: "9px 12px",
              }}
            >
              Users
            </button>
            <button
              onClick={handleLogout}
              style={{
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.4)",
                background: "#020817",
                color: "#fff",
                cursor: "pointer",
                padding: "9px 12px",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "18px",
          }}
        >
          <section
            style={{
              borderRadius: "22px",
              padding: "18px",
              background: "rgba(5,11,22,0.86)",
              border: "1px solid rgba(148,163,184,0.18)",
            }}
          >
            <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.62)" }}>
              Shared backend
            </p>
            <h2 style={{ margin: "0", fontSize: "28px" }}>
              {serverMessage || "Checking connection…"}
            </h2>
          </section>

          <section
            style={{
              borderRadius: "22px",
              padding: "18px",
              background: "rgba(5,11,22,0.86)",
              border: "1px solid rgba(148,163,184,0.18)",
            }}
          >
            <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.62)" }}>
              Admin session
            </p>
            <h2 style={{ margin: "0", fontSize: "28px" }}>Protected</h2>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.66)" }}>
              Admin portal uses the same bearer-token session as the backend.
            </p>
          </section>

          <section
            style={{
              borderRadius: "22px",
              padding: "18px",
              background: "rgba(5,11,22,0.86)",
              border: "1px solid rgba(148,163,184,0.18)",
            }}
          >
            <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.62)" }}>
              Connected clients
            </p>
            <h2 style={{ margin: "0", fontSize: "28px" }}>2</h2>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.66)" }}>
              Mobile client + web admin on one backend.
            </p>
          </section>
        </div>

        <section
          style={{
            borderRadius: "24px",
            padding: "18px",
            background: "rgba(5,11,22,0.86)",
            border: "1px solid rgba(148,163,184,0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "14px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 6px",
                  color: "#60a5fa",
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Statistics
              </p>
              <h2 style={{ margin: 0, fontSize: "24px" }}>Platform metrics</h2>
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
              {stats ? "Live backend metrics" : "Loading metrics…"}
            </div>
          </div>

          {error ? (
            <div
              style={{
                borderRadius: "12px",
                padding: "12px 14px",
                background: "rgba(239,68,68,0.16)",
                color: "#fecdd3",
                border: "1px solid rgba(248,113,113,0.26)",
              }}
            >
              {error}
            </div>
          ) : null}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "14px",
            }}
          >
            {cards.map((card) => (
              <article
                key={card.label}
                style={{
                  borderRadius: "18px",
                  padding: "16px",
                  background: "rgba(2,8,23,0.88)",
                  border: `1px solid ${card.accent}33`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {card.label}
                  </span>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "999px",
                      background: card.accent,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    marginBottom: "8px",
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{ color: "rgba(255,255,255,0.62)", fontSize: "13px" }}
                >
                  {card.helper}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
