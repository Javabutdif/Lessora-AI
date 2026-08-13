"use client";
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

  return (
    <main className={styles.infoPageShell}>
      <div className={styles.infoPageInner}>
        <header className={styles.infoPageHeader}>
          <a href="/home" className={styles.infoPageBrand}>
            Lessora AI
          </a>
          <nav className={styles.infoPageNav} aria-label="Information navigation">
            {[
              { label: "Home", href: "/home" },
              { label: "About", href: "/about" },
              { label: "Support", href: "/support" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms-and-conditions" },
            ].map((link) => (
              <a key={link.href} href={link.href} className={styles.infoPageLink}>
                {link.label}
              </a>
            ))}
          </nav>
        </header>
        <section className={styles.infoPageSection}>
          <p className={styles.infoPageUpdated}>{pageContent.updated}</p>
          <h1 className={styles.infoPageTitle}>{pageContent.title}</h1>
          <p className={styles.infoPageIntro}>{pageContent.intro}</p>
        </section>
        <section>
          {pageContent.sections.map((section) => (
            <article key={section.heading} className={styles.infoPageArticle}>
              <h2 className={styles.infoPageSectionTitle}>{section.heading}</h2>
              <p className={styles.infoPageSectionBody}>{section.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
