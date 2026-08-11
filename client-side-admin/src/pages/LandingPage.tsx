import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaMobileAlt,
  FaRobot,
  FaBullseye,
  FaCheckCircle,
} from "react-icons/fa";
import LessoraLogo from "../assets/Transparent Logo.png";
import { fetchLandingMetrics } from "../services/api";
import { setSeoMetadata } from "../utils/seo";
import ScrollReveal from "../components/ScrollReveal";
import styles from "./LandingPage.module.css";

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

  useEffect(() => {
    setSeoMetadata({
      title: "Lessora AI | AI-Powered Lesson Planning for Educators",
      description:
        "Lessora AI helps educators create structured lesson plans, objectives, activities, and assessments in minutes.",
    });
  }, []);

  const metrics = [
    {
      label: "Lesson plans created",
      value: landingMetrics?.totalLessonPlans,
      helper: "Generated plans saved on the platform",
    },
  ];

  return (
    <div className={styles.userLanding}>
      <header className={styles.userLandingNav}>
        <Link to="/about">About</Link>
        <Link to="/support">Support</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-and-conditions">Terms & Conditions</Link>
      </header>
      <div className={styles.userLandingHero}>
        <img
          src={LessoraLogo}
          alt="Lessora AI"
          className={styles.userLandingLogo}
        />
        <div>
          <p className={styles.userLandingEyebrow}>
            Less Planning, More Teaching
          </p>
          <h1 className={styles.userLandingTitle}>
            AI-Powered Lesson Planning for Educators
          </h1>
          <p className={styles.userLandingDescription}>
            Create structured, professional lesson plans in minutes. Transform
            simple teacher inputs into organized activities, objectives, and
            assessments. No account required.
          </p>
        </div>
        <div className={styles.userLandingCallout}>
          <p className={styles.userLandingCalloutLabel}>Start here</p>
          <button
            type="button"
            onClick={() => navigate("/generate")}
            className={styles.userLandingDownloadLink}
          >
            Generate Free Lesson Plan
          </button>
          <button
            type="button"
            onClick={() => navigate("/discover")}
            className={styles.userLandingSecondaryButton}
          >
            Browse Plans
          </button>
          <button
            type="button"
            onClick={() => navigate("/support")}
            className={styles.userLandingSecondaryButton}
          >
            Support the project
          </button>
        </div>
        <div className={styles.userLandingFeatureGrid}>
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
              title: "Browser Access",
              desc: "No download needed",
            },
          ].map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 80}>
              <div className={styles.userLandingFeatureCard}>
                <div className={styles.userLandingFeatureIcon}>{feature.icon}</div>
                <h3 className={styles.userLandingFeatureTitle}>{feature.title}</h3>
                <p className={styles.userLandingFeatureText}>{feature.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={400}>
          <div className={styles.userLandingMetricGrid}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.userLandingMetricCard}>
                <p className={styles.userLandingMetricLabel}>{metric.label}</p>
                <p className={styles.userLandingMetricValue}>
                  {numberFormatter.format(metric.value ?? 0)}
                </p>
                <p className={styles.userLandingMetricHelper}>{metric.helper}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
