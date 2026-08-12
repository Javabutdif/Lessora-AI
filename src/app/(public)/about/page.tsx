"use client";
import { useEffect } from "react";
import { setSeoMetadata } from "@/app/utils/seo";
import styles from "@/portal-theme.module.css";

const content: Record<string, { title: string; updated: string; intro: string; sections: Array<{ heading: string; body: string }> }> = {
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

export default function AboutPage() {
  const pageContent = content.about;

  useEffect(() => {
    setSeoMetadata({
      title: `${pageContent.title} | Lessora AI`,
      description: pageContent.intro,
    });
  }, []);

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
