"use client";
import { useEffect } from "react";
import { setSeoMetadata } from "@/app/utils/seo";
import styles from "@/portal-theme.module.css";

const content: Record<string, { title: string; updated: string; intro: string; sections: Array<{ heading: string; body: string }> }> = {
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
};

export default function TermsPage() {
  const pageContent = content.terms;

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
