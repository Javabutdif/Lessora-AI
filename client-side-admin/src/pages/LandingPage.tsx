import { useEffect } from "react";
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
import { setSeoMetadata } from "../utils/seo";

export default function LandingPage() {
  const navigate = useNavigate();
  const downloadAppUrl =
    "https://drive.google.com/file/d/1TUuA2d4tPZgIRkVijq2JUuDn7CO_W3Z_/view?usp=drive_link";
  const { data: landingMetrics } = useQuery({
    queryKey: ["landingMetrics"],
    queryFn: fetchLandingMetrics,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  });
  const numberFormatter = new Intl.NumberFormat();
  
  useEffect(() => {
    setSeoMetadata({
      title: "Lessora AI | AI-Powered Lesson Planning for Educators",
      description:
        "Lessora AI helps educators create structured lesson plans, objectives, activities, and assessments in minutes.",
    });
  }, []);

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
            width: "100%",
            maxWidth: "560px",
            margin: "0 auto",
            padding: "18px",
            borderRadius: "18px",
            background: "rgba(255, 255, 255, 0.72)",
            border: "1px solid #dbe4f0",
            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#7c3aed",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Start here
          </p>
          <a
            href={downloadAppUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              width: "100%",
              padding: "15px 24px",
              borderRadius: "14px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
              color: "#fff",
              fontWeight: "700",
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 12px 24px rgba(124, 58, 237, 0.18)",
            }}
          >
            Download App
          </a>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "14px 20px",
              borderRadius: "14px",
              border: "1px solid #c4b5fd",
              background: "#f5f3ff",
              color: "#6d28d9",
              fontWeight: "700",
            }}
          >
            Login
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
                  color: "#7c3aed",
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
        <section
          style={{
            textAlign: "left",
            padding: "26px",
            borderRadius: "18px",
            background: "#fff",
            border: "1px solid #dbe4f0",
            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              color: "#3b82f6",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Android App
          </p>
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "24px",
              fontWeight: "900",
              color: "#0f172a",
            }}
          >
            Built for teachers on the go
          </h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: "1.7" }}>
            The Android app helps you export lesson plan documents and refine
            lesson plan generation when you need quick updates from your mobile
            device.
          </p>
        </section>
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
