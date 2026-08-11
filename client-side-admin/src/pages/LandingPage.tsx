import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  Target,
  Clock,
  Browser,
} from "@phosphor-icons/react";
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
      title: "Lessora AI | Lesson Plans Made Simply",
      description:
        "Lessora AI helps educators create structured lesson plans, objectives, activities, and assessments — no account required.",
    });
  }, []);

  const metrics = [
    {
      label: "Lesson plans created",
      value: landingMetrics?.totalLessonPlans,
      helper: "Plans shared with teachers across the platform",
    },
  ];

  return (
    <div className={styles.userLanding}>
      <header className={styles.userLandingNav}>
        <Link to="/about">About</Link>
        <Link to="/support">Support</Link>
        <Link to="/privacy-policy">Privacy</Link>
        <Link to="/terms-and-conditions">Terms</Link>
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
            Lesson Plans, Made Simply
          </h1>
          <p className={styles.userLandingDescription}>
            Transform your topic and grade level into a structured, professional
            lesson plan — complete with activities, objectives, and assessments.
            No account needed.
          </p>
          <p className={styles.userLandingOnboarding}>
            Just tell us what you are teaching. We handle the rest.
          </p>
        </div>
        <div className={styles.userLandingCallout}>
          <p className={styles.userLandingCalloutLabel}>Start here</p>
          <button
            type="button"
            onClick={() => navigate("/generate")}
            className={styles.userLandingPrimaryCta}
          >
            Start Planning
          </button>
        </div>
        <div className={styles.userLandingSecondaryLinks}>
          <button
            type="button"
            onClick={() => navigate("/discover")}
            className={styles.userLandingSecondaryLink}
          >
            Browse Plans
          </button>
          <button
            type="button"
            onClick={() => navigate("/support")}
            className={styles.userLandingSecondaryLink}
          >
            Support the project
          </button>
        </div>
        <div className={styles.userLandingFeatureGrid}>
          {[
            {
              icon: <CheckCircle weight="fill" size={24} />,
              title: "Professional Format",
              desc: "Structured, curriculum-ready plans you can use immediately",
            },
            {
              icon: <Clock weight="fill" size={24} />,
              title: "Save Your Evenings",
              desc: "Create a full lesson plan in minutes, not hours",
            },
            {
              icon: <Target weight="fill" size={24} />,
              title: "Guided by Your Input",
              desc: "Your topic, your standards, your classroom context",
            },
            {
              icon: <Browser weight="fill" size={24} />,
              title: "Works Anywhere",
              desc: "Open it in any browser — no download, no install",
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
