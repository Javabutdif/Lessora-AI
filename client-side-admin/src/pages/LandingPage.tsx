import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMobileAlt,
  FaRobot,
  FaBullseye,
  FaCheckCircle,
} from "react-icons/fa";
import LessoraLogo from "../assets/Transparent Logo.png";
import { fetchLandingMetrics } from "../services/api";

export default function LandingPage() {
  const navigate = useNavigate();
  const { data: landingMetrics } = useQuery({
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
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        color: "#0f172a",
      }}
    >
      <header
        style={{
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "18px",
          flexWrap: "wrap",
          paddingBottom: "20px",
          fontSize: "14px",
          fontWeight: "700",
        }}
      >
        <Link to="/about">About</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-and-conditions">Terms & Conditions</Link>
      </header>
      <div
        style={{
          maxWidth: "760px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <img
          src={LessoraLogo}
          alt="Lessora AI"
          style={{
            width: "260px",
            height: "auto",
            objectFit: "contain",
            margin: "0 auto",
          }}
        />
        <div>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.2em",
              color: "#2563eb",
              textTransform: "uppercase",
            }}
          >
            Less Planning, More Teaching
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(34px, 6vw, 56px)",
              fontWeight: "900",
              lineHeight: "1.05",
              color: "#475569",
            }}
          >
            AI-Powered Lesson Planning for Educators
          </h1>
          <p
            style={{
              margin: "18px auto 0",
              fontSize: "17px",
              color: "#475569",
              lineHeight: "1.8",
              maxWidth: "620px",
            }}
          >
            Create structured, professional lesson plans in minutes. Transform
            simple teacher inputs into organized activities, objectives, and
            assessments.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "14px 28px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
              color: "#fff",
              fontWeight: "700",
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "14px 28px",
              borderRadius: "10px",
              border: "1px solid #bfdbfe",
              background: "#eff6ff",
              color: "#1d4ed8",
              fontWeight: "700",
            }}
          >
            Create Account
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              icon: <FaCheckCircle />,
              title: "Structured Plans",
              desc: "Professional format",
            },
            {
              icon: <FaBullseye />,
              title: "Minutes Not Hours",
              desc: "Create plans instantly",
            },
            {
              icon: <FaRobot />,
              title: "AI-Powered",
              desc: "Smart generation",
            },
            {
              icon: <FaMobileAlt />,
              title: "Mobile Friendly",
              desc: "Works on any screen",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: "22px",
                borderRadius: "14px",
                background: "#fff",
                border: "1px solid #dbe4f0",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  color: "#2563eb",
                  marginBottom: "10px",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "16px",
                  fontWeight: "800",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {metrics.map((metric) => (
            <div
              key={metric.label}
              style={{
                padding: "24px",
                borderRadius: "14px",
                background: "#fff",
                border: "1px solid #dbe4f0",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
              }}
            >
              <p
                style={{
                  margin: "0 0 10px",
                  color: "#2563eb",
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
                  margin: 0,
                  color: "#0f172a",
                  fontSize: "40px",
                  fontWeight: "900",
                }}
              >
                {numberFormatter.format(metric.value ?? 0)}
              </p>
              <p
                style={{
                  margin: "12px 0 0",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                {metric.helper}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
