import styles from "@/portal-theme.module.css";

type NavKey = "home" | "discover" | "generate" | "support";

const NAV_LINKS: { key: NavKey; href: string; label: string }[] = [
  { key: "home", href: "/home", label: "Home" },
  { key: "discover", href: "/discover", label: "Discover" },
  { key: "generate", href: "/generate", label: "New plan" },
  { key: "support", href: "/support", label: "Support" },
];

export default function SiteHeader({ current }: { current?: NavKey }) {
  return (
    <header className={styles.userAppHeader}>
      <div className={styles.userAppHeaderInner}>
        <a href="/home" className={`${styles.userAppBrandLink} ${styles.userAppBrand}`}>Lessora AI</a>
        <nav className={styles.userAppHeaderActions} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={styles.userAppHeaderLink}
              aria-current={current === link.key ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
