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
import styles from "./LandingPage.module.css";

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
            assessments.
          </p>
        </div>
        <div className={styles.userLandingCallout}>
          <p className={styles.userLandingCalloutLabel}>Start here</p>
          <a
            href={downloadAppUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.userLandingDownloadLink}
          >
            Download App
          </a>
          <button
            type="button"
            onClick={() => navigate("/support")}
            className={styles.userLandingSecondaryButton}
          >
            Support the project
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className={styles.userLandingSecondaryButton}
          >
            Login
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
              title: "Mobile Friendly",
              desc: "Works on any screen",
            },
          ].map((feature) => (
            <div key={feature.title} className={styles.userLandingFeatureCard}>
              <div className={styles.userLandingFeatureIcon}>{feature.icon}</div>
              <h3 className={styles.userLandingFeatureTitle}>{feature.title}</h3>
              <p className={styles.userLandingFeatureText}>{feature.desc}</p>
            </div>
          ))}
        </div>
        <section className={styles.userLandingAndroid}>
          <p className={styles.userLandingAndroidLabel}>Android App</p>
          <h2 className={styles.userLandingAndroidTitle}>
            Built for teachers on the go
          </h2>
          <p className={styles.userLandingAndroidBody}>
            The Android app helps you export lesson plan documents and refine
            lesson plan generation when you need quick updates from your mobile
            device.
          </p>
        </section>
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
      </div>
    </div>
  );
}
