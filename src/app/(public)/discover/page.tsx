"use client";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getPublicLessonPlanById,
  listPublicLessonPlans,
  PublicLessonPlan,
} from "@/app/lib/api-client";
import { setSeoMetadata } from "@/app/utils/seo";
import ScrollReveal from "@/app/components/scroll-reveal";
import Dropdown from "@/app/components/ui/dropdown";
import { Warning, Spinner, MagnifyingGlass, House } from "@phosphor-icons/react";
import styles from "@/portal-theme.module.css";

const ALL_GRADES = ["All Grades", "Preschool", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Senior High School"];
const ALL_SUBJECTS = ["All Subjects", "Mathematics", "Science", "English", "Filipino", "Araling Panlipunan", "MAPEH", "Technology and Livelihood Education", "Values Education"];

export default function DiscoverPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["publicPlans"],
    queryFn: listPublicLessonPlans,
  });

  useEffect(() => {
    setSeoMetadata({ title: "Discover Lesson Plans | Lessora AI", description: "Browse lesson plans shared by teachers." });
  }, []);

  const filteredPlans = useMemo(() => {
    if (!plans) return [];
    return plans.filter((plan) => {
      const matchesSearch = !searchQuery || plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) || plan.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "All Subjects" || plan.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchesGrade = selectedGrade === "All Grades" || plan.gradeLevel.toLowerCase() === selectedGrade.toLowerCase();
      return matchesSearch && matchesSubject && matchesGrade;
    });
  }, [plans, searchQuery, selectedSubject, selectedGrade]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Recently";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function handleNavigate(planId: string) {
    setNavigatingId(planId);
    router.push(`/preview/${planId}?public=true`);
  }

  return (
    <div className={styles.userAppPage}>
      <header className={styles.userAppHeader}>
        <a href="/home" className={styles.userAppBrandLink}>
          <h1 className={styles.userAppBrand}>Lessora AI</h1>
        </a>
        <nav className={styles.userAppHeaderActions}>
           <a href="/home" className={styles.softSecondary}><House size={16} /> Home</a>
           <button type="button" onClick={() => router.push("/generate")} className={styles.softSecondary}>New Plan</button>
           <a href="/support" className={styles.softSecondary}>Support</a>
        </nav>
      </header>

      <div className={styles.userAppContainer}>
        <div className={styles.userAppHero}>
          <p className={styles.eyebrow}>Discover</p>
          <h2 className={styles.userAppHeroTitle}>All Lesson Plans</h2>
          <p className={styles.userAppHeroDescription}>Explore lesson plans shared by teachers across the platform.</p>
        </div>

        <div className={styles.filterBar}>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by topic, subject, or grade..." className={styles.searchInputLg} />
          <Dropdown options={ALL_SUBJECTS.filter((s) => s !== "All Subjects").map((s) => ({ value: s, label: s }))} value={selectedSubject === "All Subjects" ? "" : selectedSubject} onChange={(v) => setSelectedSubject(v || "All Subjects")} placeholder="All Subjects" />
          <Dropdown options={ALL_GRADES.filter((g) => g !== "All Grades").map((g) => ({ value: g, label: g }))} value={selectedGrade === "All Grades" ? "" : selectedGrade} onChange={(v) => setSelectedGrade(v || "All Grades")} placeholder="All Grades" />
        </div>

        {isLoading && (
          <div className={styles.userAppCenter}>
            <Spinner weight="fill" size={32} className={styles.spin} />
            <p className={styles.centerTextSmall}>Loading plans...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.errorPanel}>
            <Warning size={28} className={styles.iconWithBottom} />
            <p className={styles.centerTitle}>Failed to load plans</p>
            <p className={styles.centerText}>{typeof error === 'string' ? error : String(error)}</p>
            <button type="button" onClick={() => window.location.reload()} className={styles.softSecondary}>Try Again</button>
          </div>
        )}

        {!isLoading && !error && (!plans || plans.length === 0) && (
          <div className={styles.userAppCenter}>
            <MagnifyingGlass weight="fill" size={48} className={styles.iconWithBottomLarge} />
            <h3 className={styles.userAppCenterTitle}>No Plans Yet</h3>
            <p className={styles.userAppCenterText} style={{ marginBottom: 24 }}>Be the first teacher to share a lesson plan.</p>
            <button type="button" onClick={() => router.push("/generate")} className={styles.flatButton}>Create Your First Plan</button>
          </div>
        )}

        {!isLoading && !error && filteredPlans.length === 0 && plans && plans.length > 0 && (
          <div className={styles.userAppCenter}>
            <MagnifyingGlass weight="fill" size={40} className={styles.iconWithBottomLarge} />
            <h3 className={styles.userAppCenterTitle}>No Results Found</h3>
            <p className={styles.userAppCenterText}>Try a different search term or filter</p>
          </div>
        )}

        {!isLoading && !error && filteredPlans.length > 0 && (
          <div className={styles.planGrid}>
            {filteredPlans.map((plan, index) => (
              <ScrollReveal key={plan.id} delay={index * 40}>
                <div
                  className={styles.planTile}
                  onClick={() => navigatingId !== plan.id && handleNavigate(plan.id)}
                  style={{ opacity: navigatingId === plan.id ? 0.5 : 1, cursor: navigatingId === plan.id ? "default" : "pointer" }}
                >
                  {navigatingId === plan.id ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "20px 0" }}>
                      <Spinner weight="fill" size={20} className={styles.spin} />
                      <span style={{ fontSize: 13, color: "var(--color-ink-secondary)" }}>Loading...</span>
                    </div>
                  ) : (
                    <>
                      <h3 className={styles.planTileTitle}>{plan.title}</h3>
                      <div className={styles.planTileChipRow}>
                        <span className={`${styles.chip} ${styles.chipAccent}`}>{plan.subject}</span>
                        <span className={`${styles.chip} ${styles.chipPurple}`}>{plan.gradeLevel}</span>
                      </div>
                      <div className={styles.planTileMeta}>
                        <span>{plan.totalDuration} min</span>
                        <span>{formatDate(plan.createdAt)}</span>
                      </div>
                    </>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
