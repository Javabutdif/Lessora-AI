"use client";
import { useMemo, useState, MouseEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { listPublicLessonPlans } from "@/app/lib/api-client";
import ScrollReveal from "@/app/components/scroll-reveal";
import Dropdown from "@/app/components/ui/dropdown";
import SiteHeader from "@/app/components/site-header";
import LoadingSkeleton from "@/app/components/loading-skeleton";
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

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>, planId: string) {
    // Modified clicks (new tab, new window) behave like a normal link
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    if (navigatingId) return;
    setNavigatingId(planId);
    router.push(`/preview/${planId}?public=true`);
  }

  return (
    <div className={styles.userAppPage}>
      <SiteHeader current="discover" />

      <main className={styles.userAppContainer}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Lesson plans from other teachers</h1>
          <p className={styles.pageIntro}>Open any plan to read it, download it, or refine a copy for your own class.</p>
        </div>

        <div className={styles.filterBar}>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by topic, subject or grade" aria-label="Search lesson plans" className={styles.searchInputLg} />
          <Dropdown options={ALL_SUBJECTS.filter((s) => s !== "All Subjects").map((s) => ({ value: s, label: s }))} value={selectedSubject === "All Subjects" ? "" : selectedSubject} onChange={(v) => setSelectedSubject(v || "All Subjects")} placeholder="All subjects" />
          <Dropdown options={ALL_GRADES.filter((g) => g !== "All Grades").map((g) => ({ value: g, label: g }))} value={selectedGrade === "All Grades" ? "" : selectedGrade} onChange={(v) => setSelectedGrade(v || "All Grades")} placeholder="All grades" />
        </div>

        {isLoading && <LoadingSkeleton lines={6} label="Loading lesson plans" />}

        {error && !isLoading && (
          <div className={styles.errorPanel} role="alert">
            <p className={styles.centerTitle}>Lesson plans could not be loaded</p>
            <p className={styles.centerText}>{typeof error === 'string' ? error : String(error)}</p>
            <button type="button" onClick={() => window.location.reload()} className={styles.softSecondary}>Reload the page</button>
          </div>
        )}

        {!isLoading && !error && (!plans || plans.length === 0) && (
          <div className={styles.userAppCenter}>
            <h2 className={styles.userAppCenterTitle}>No lesson plans yet</h2>
            <p className={styles.userAppCenterText}>Plans appear here once teachers generate them.</p>
            <a href="/generate" className={styles.flatButton}>Write the first one</a>
          </div>
        )}

        {!isLoading && !error && filteredPlans.length === 0 && plans && plans.length > 0 && (
          <div className={styles.userAppCenter}>
            <h2 className={styles.userAppCenterTitle}>No plans match</h2>
            <p className={styles.userAppCenterText}>Try a shorter search, or set subject and grade back to all.</p>
          </div>
        )}

        {!isLoading && !error && filteredPlans.length > 0 && (
          <div className={styles.planGrid}>
            {filteredPlans.map((plan, index) => (
              <ScrollReveal key={plan.id} delay={index * 40}>
                <article className={navigatingId === plan.id ? `${styles.planTile} ${styles.planTileNavigating}` : styles.planTile}>
                  <a
                    href={`/preview/${plan.id}?public=true`}
                    onClick={(event) => handleNavigate(event, plan.id)}
                    aria-busy={navigatingId === plan.id}
                    className={styles.planTileLink}
                  >
                    <p className={styles.metaLine}>{plan.subject} · {plan.gradeLevel} · {plan.totalDuration} min</p>
                    <h2 className={styles.planTileTitle}>{plan.title}</h2>
                    <div className={styles.planTileMeta}>
                      <span>{navigatingId === plan.id ? "Opening…" : formatDate(plan.createdAt)}</span>
                    </div>
                  </a>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
