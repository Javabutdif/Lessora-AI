import { useEffect } from "react";
import { Link } from "react-router-dom";
import LessoraLogo from "../assets/Transparent Logo.png";
import { setSeoMetadata } from "../utils/seo";
import styles from "../styles/PortalTheme.module.css";

type InfoPageType = "privacy" | "terms" | "about";
type InfoContent = { title: string; updated: string; intro: string; sections: Array<{ heading: string; body: string }> };

const content: Record<InfoPageType, InfoContent> = {
  privacy: { title: "Privacy Policy", updated: "Last updated: June 2026", intro: "Lessora AI is designed to support educators with lesson planning while treating personal information with care and respect.", sections: [{ heading: "Information we use", body: "We may use basic account details, lesson planning inputs, saved plans, and app activity needed to provide and improve the service." }, { heading: "How information helps the service", body: "Information is used to create lesson plans, keep accounts accessible, understand product usage, and maintain a reliable experience for educators." }, { heading: "Your choices", body: "Users should only enter information they are comfortable using for lesson planning. Account access, saved work, and support requests can be managed through the Lessora AI experience." }, { heading: "Our commitment", body: "Lessora AI aims to keep user information limited to what supports the product and to handle educator and classroom-related content responsibly. Support donations are handled through Paymongo-hosted checkout so Lessora AI does not collect card details directly." }] },
  terms: { title: "Terms & Conditions", updated: "Last updated: June 2026", intro: "These terms explain the basic expectations for using Lessora AI as an educator-focused lesson planning tool.", sections: [{ heading: "Using Lessora AI", body: "Lessora AI helps users draft lesson plans, activities, objectives, and assessments. Users remain responsible for reviewing and adapting outputs before using them in class." }, { heading: "Appropriate use", body: "The service should be used respectfully, lawfully, and for educational planning purposes. Users should avoid submitting sensitive personal details that are not needed for planning lessons." }, { heading: "Content quality", body: "Lessora AI can save time and provide helpful structure, but generated plans may need human judgment, local context, and professional review." }, { heading: "Service changes", body: "Lessora AI may update features, content, or availability over time to improve the experience for educators and learners." }] },
  about: { title: "About Lessora AI", updated: "Less Planning, More Teaching", intro: "Lessora AI supports structured lesson planning with customizable templates, AI-assisted content generation, and multilingual support to help educators create lessons more efficiently.", sections: [{ heading: "What Lessora AI does", body: "Lessora AI helps create structured lesson plans with learning objectives, activities, assessments, and clear flow for classroom use." }, { heading: "Who it is for", body: "The platform is made for educators who want to spend less time formatting plans and more time preparing meaningful learning experiences." }, { heading: "Why it exists", body: "Lesson planning can take a significant amount of time and effort. Lessora AI was created to give educators a faster starting point for developing structured lesson plans." }, { heading: "Our goal", body: "Lessora AI aims to be practical, approachable, and supportive for everyday teaching work. If you want to help the project directly, the Support page offers one-time Paymongo donations." }] },
};

export default function InfoPage({ page }: { page: InfoPageType }) {
  const pageContent = content[page];

  useEffect(() => {
    setSeoMetadata({
      title: `${pageContent.title} | Lessora AI`,
      description: pageContent.intro,
    });
  }, [pageContent]);

  return (
    <main className={styles.userAuthPage} style={{ alignItems: "flex-start" }}>
      <div className={styles.infoMaxWidth}>
        <header className={styles.infoPageHeader}>
          <Link to="/" className={styles.infoLogo}>Lessora AI</Link>
          <nav className={styles.infoNav}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/support">Support</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>
        </header>
        <section className={styles.infoHeroSection}>
          <p className={styles.infoEyebrow}>{pageContent.updated}</p>
          <h1 className={styles.infoHeroTitle}>{pageContent.title}</h1>
          <p className={styles.infoIntro}>{pageContent.intro}</p>
        </section>
        <section className={styles.infoBody}>
          {pageContent.sections.map((section) => (
            <article key={section.heading} className={styles.infoArticle}>
              <h2 className={styles.infoSectionHeading}>{section.heading}</h2>
              <p className={styles.infoSectionBody}>{section.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
