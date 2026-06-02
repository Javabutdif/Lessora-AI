import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LessoraLogo from "../assets/Transparent Logo.png";
import LandingScreenshot from "../assets/Landing.png";
import GenerationScreenshot1 from "../assets/generation1.png";
import GenerationScreenshot2 from "../assets/generation2.png";
import HistoryScreenshot from "../assets/history.png";
import GenerateScreenshot from "../assets/generate.png";
import { fetchLandingMetrics } from "../services/api";

export default function LandingPage() {
  const navigate = useNavigate();
  const {
    data: landingMetrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery({
    queryKey: ["landingMetrics"],
    queryFn: fetchLandingMetrics,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  });
  const numberFormatter = new Intl.NumberFormat();
  const metrics = [
    {
      label: "Active educators",
      value: landingMetrics?.activeUsers,
      helper: "Educators using Lessora",
    },
    {
      label: "Lesson plans created",
      value: landingMetrics?.totalLessonPlans,
      helper: "Generated plans saved on the platform",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "#fff",
        background:
          "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1425 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124, 58, 237, 0.12), transparent 70%)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: "700px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <img
            src={LessoraLogo}
            alt="Lessora AI"
            style={{
              width: "280px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 40px rgba(59, 130, 246, 0.2))",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(90deg, transparent, #3b82f6)",
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.2em",
                color: "#60a5fa",
                textTransform: "uppercase",
              }}
            >
              Less Planning, More Teaching
            </p>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "linear-gradient(90deg, #7c3aed, transparent)",
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p
            style={{
              fontSize: "32px",
              fontWeight: "800",
              margin: "0",
              lineHeight: "1.2",
              color: "#f3f4f6",
              letterSpacing: "-0.5px",
            }}
          >
            AI-Powered Lesson Planning for Educators
          </p>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.75)",
              margin: "0",
              lineHeight: "1.8",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              fontWeight: "400",
            }}
          >
            Create structured, professional lesson plans in minutes. Transform
            simple teacher inputs into organized activities, objectives, and
            assessments. Focus on what matters—engaging with your students.
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <button
            onClick={() =>
              window.open(
                "https://drive.google.com/file/d/1TUuA2d4tPZgIRkVijq2JUuDn7CO_W3Z_/view?usp=drivesdk",
                "_blank",
              )
            }
            style={{
              padding: "16px 44px",
              fontSize: "16px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow:
                "0 12px 40px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              minWidth: "220px",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = "translateY(-4px)";
              btn.style.boxShadow =
                "0 16px 48px rgba(59, 130, 246, 0.45), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = "translateY(0)";
              btn.style.boxShadow =
                "0 12px 40px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
          >
            📱 Download App
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "16px 44px",
              fontSize: "16px",
              fontWeight: "700",
              background: "rgba(59, 130, 246, 0.08)",
              color: "#60a5fa",
              border: "1.5px solid rgba(59, 130, 246, 0.5)",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              minWidth: "220px",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "rgba(59, 130, 246, 0.15)";
              btn.style.transform = "translateY(-4px)";
              btn.style.borderColor = "rgba(59, 130, 246, 0.8)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "rgba(59, 130, 246, 0.08)";
              btn.style.transform = "translateY(0)";
              btn.style.borderColor = "rgba(59, 130, 246, 0.5)";
            }}
          >
            Login
          </button>
        </div>

        {/* Metrics Section */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "-8px",
          }}
        >
          {metrics.map((metric) => (
            <div
              key={metric.label}
              style={{
                padding: "24px",
                minHeight: "132px",
                borderRadius: "12px",
                background: "rgba(8, 15, 32, 0.72)",
                border: "1px solid rgba(96, 165, 250, 0.22)",
                boxShadow: "0 16px 44px rgba(2, 8, 23, 0.28)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  margin: "0 0 10px",
                  color: "#60a5fa",
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {metric.label}
              </p>
              <p
                style={{
                  margin: "0",
                  color: "#f8fafc",
                  fontSize: "42px",
                  fontWeight: "900",
                  lineHeight: "1",
                }}
              >
                {metricsLoading
                  ? "--"
                  : metricsError
                    ? "Live"
                    : numberFormatter.format(metric.value ?? 0)}
              </p>
              <p
                style={{
                  margin: "12px 0 0",
                  color: "rgba(255,255,255,0.66)",
                  fontSize: "13px",
                  fontWeight: "600",
                  lineHeight: "1.45",
                }}
              >
                {metricsError
                  ? "Metrics refresh when the API is online"
                  : metric.helper}
              </p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            width: "100%",
            marginTop: "20px",
          }}
        >
          {[
            {
              icon: "⚡",
              title: "Minutes Not Hours",
              desc: "Create plans instantly",
            },
            {
              icon: "🎯",
              title: "Structured Plans",
              desc: "Professional format",
            },
            { icon: "🤖", title: "AI-Powered", desc: "Smart generation" },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                padding: "28px 24px",
                background: "rgba(59, 130, 246, 0.03)",
                border: "1px solid rgba(59, 130, 246, 0.15)",
                borderRadius: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(59, 130, 246, 0.08)";
                el.style.borderColor = "rgba(59, 130, 246, 0.3)";
                el.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(59, 130, 246, 0.03)";
                el.style.borderColor = "rgba(59, 130, 246, 0.15)";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "14px" }}>
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  margin: "0 0 6px",
                  color: "#e5e7eb",
                  letterSpacing: "0.2px",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.65)",
                  margin: "0",
                  fontWeight: "500",
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile Screenshots Section */}
        <div
          style={{
            width: "100%",
            marginTop: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "800",
                margin: "0",
                color: "#f3f4f6",
              }}
            >
              Experience the App
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.65)",
                margin: "0",
                fontWeight: "500",
              }}
            >
              See how Lessora AI simplifies lesson planning
            </p>
          </div>

          {/* Screenshots Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "20px",
              width: "100%",
            }}
          >
            {[
              { img: LandingScreenshot, title: "Landing" },
              { img: GenerationScreenshot1, title: "Generation" },
              { img: GenerationScreenshot2, title: "Continuation" },
              { img: HistoryScreenshot, title: "History" },
              { img: GenerateScreenshot, title: "Generate" },
            ].map((screenshot, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  aspectRatio: "9/20",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(-8px)";
                  el.style.boxShadow = "0 16px 48px rgba(59, 130, 246, 0.25)";
                  el.style.borderColor = "rgba(59, 130, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 8px 32px rgba(59, 130, 246, 0.15)";
                  el.style.borderColor = "rgba(59, 130, 246, 0.2)";
                }}
              >
                <img
                  src={screenshot.img}
                  alt={screenshot.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(10, 14, 39, 0.8), transparent)",
                    padding: "16px 12px 12px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#f3f4f6",
                      margin: "0",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {screenshot.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            marginTop: "40px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(59, 130, 246, 0.1)",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.5)",
              margin: "0",
              letterSpacing: "0.3px",
            }}
          >
            © 2026 Lessora AI. Empowering educators with AI.
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              margin: "0",
              fontWeight: "500",
              letterSpacing: "0.2px",
            }}
          >
            Developed by <span style={{ color: "#60a5fa" }}>Javabutdif</span>
          </p>
        </div>
      </div>
    </div>
  );
}
