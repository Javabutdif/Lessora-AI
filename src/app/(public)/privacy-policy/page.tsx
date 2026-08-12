"use client";
import { useEffect, useMemo } from "react";
import { setSeoMetadata } from "@/app/utils/seo";
import styles from "@/portal-theme.module.css";

type InfoPageType = "privacy" | "terms" | "about";

const content: Record<InfoPageType, { title: string; updated: string; intro: string; sections: Array<{ heading: string; body: string }> }> = {
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: June 2026",
    intro: "Lessora AI is designed to support educators with lesson planning while treating personal information with care and respect.",
    sections: [
      { heading: "Information we use", body: "We may use basic account details, lesson planning inputs, saved plans, and app activity needed to provide and improve the service." },
      { heading: "How information helps the service", body: "Information is used to create lesson plans, keep accounts accessible, understand product usage, and maintain a reliable experience for educators." },
      { heading: "Your choices", body: "Users should only enter information they are comfortable using for lesson planning. Account access, saved work, and support requests can be managed through the Lessora AI experience." },
      { heading: "Our commitment", body: "Lessora AI aims to keep user information limited to what supports the product and to handle educator and classroom-related content responsibly. Support donations are handled through Paymongo-hosted checkout so Lessora AI does not collect card details directly." },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "Last updated: June 2026",
    intro: "These terms explain the basic expectations for using Lessora AI as an educator-focused lesson planning tool.",
    sections: [
      { heading: "Using Lessora AI", body: "Lessora AI helps users draft lesson plans, activities, objectives, and assessments. Users remain responsible for reviewing and adapting outputs before using them in class." },
      { heading: "Appropriate use", body: "The service should be used respectfully, lawfully, and for educational planning purposes. Users should avoid submitting sensitive personal details that are not needed for planning lessons." },
      { heading: "Content quality", body: "Lessora AI can save time and provide helpful structure, but generated plans may need human judgment, local context, and professional review." },
      { heading: "Service changes", body: "Lessora AI may update features, content, or availability over time to improve the experience for educators and learners." },
    ],
  },
  about: {
    title: "About Lessora AI",
    updated: "Less Planning, More Teaching",
    intro: "Lessora AI supports structured lesson planning with customizable templates, AI-assisted content generation, and multilingual support to help educators create lessons more efficiently.",
    sections: [
      { heading: "What Lessora AI does", body: "Lessora AI helps create structured lesson plans with learning objectives, activities, assessments, and clear flow for classroom use." },
      { heading: "Who it is for", body: "The platform is made for educators who want to spend less time formatting plans and more time preparing meaningful learning experiences." },
      { heading: "Why it exists", body: "Lesson planning can take a significant amount of time and effort. Lessora AI was created to give educators a faster starting point for developing structured lesson plans." },
      { heading: "Our goal", body: "Lessora AI aims to be practical, approachable, and supportive for everyday teaching work. If you want to help the project directly, the Support page offers one-time Paymongo donations." },
    ],
  },
};

export default function InfoPage({ params }: { params: Promise<{ page: InfoPageType }> }) {
  const page = useMemo(() => {
    if (typeof window === "undefined") return "privacy";
    const path = window.location.pathname;
    if (path.includes("terms")) return "terms";
    if (path.includes("about")) return "about";
    return "privacy";
  }, []);

  const pageContent = content[page];

  useEffect(() => {
    setSeoMetadata({
      title: `${pageContent.title} | Lessora AI`,
      description: pageContent.intro,
    });
  }, [pageContent]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-page)", color: "var(--color-ink-primary)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "var(--spacing-8)" }}>
        <header style={{ borderBottom: "1px solid var(--color-rule)", paddingBottom: "var(--spacing-6)", marginBottom: "var(--spacing-8)" }}>
          <a href="/home" style={{ fontFamily: "var(--font-family-display)", fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-ink-primary)", textDecoration: "none" }}>
            Lessora AI
          </a>
          <nav style={{ display: "flex", gap: "var(--spacing-4)", marginTop: "var(--spacing-4)", flexWrap: "wrap" }}>
            {[
              { label: "Home", href: "/home" },
              { label: "About", href: "/about" },
              { label: "Support", href: "/support" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms-and-conditions" },
            ].map((link) => (
              <a key={link.href} href={link.href} style={{ fontSize: "var(--font-size-sm)", color: "var(--color-ink-secondary)", textDecoration: "none" }}>
                {link.label}
              </a>
            ))}
          </nav>
        </header>
        <section style={{ marginBottom: "var(--spacing-8)" }}>
          <p style={{ fontFamily: "var(--font-family-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-tertiary)", margin: "0 0 var(--spacing-3)" }}>{pageContent.updated}</p>
          <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: "var(--font-size-3xl)", fontWeight: 700, margin: "0 0 var(--spacing-4)", lineHeight: "1.2" }}>{pageContent.title}</h1>
          <p style={{ color: "var(--color-ink-secondary)", lineHeight: "1.7" }}>{pageContent.intro}</p>
        </section>
        <section>
          {pageContent.sections.map((section) => (
            <article key={section.heading} style={{ marginBottom: "var(--spacing-8)" }}>
              <h2 style={{ fontFamily: "var(--font-family-display)", fontSize: "var(--font-size-lg)", fontWeight: 600, margin: "0 0 var(--spacing-3)", lineHeight: "1.35" }}>{section.heading}</h2>
              <p style={{ color: "var(--color-ink-secondary)", lineHeight: "1.7" }}>{section.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
