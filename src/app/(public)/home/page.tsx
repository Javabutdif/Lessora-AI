'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchLandingMetrics } from '@/app/lib/api-client';
import SiteHeader from '@/app/components/site-header';
import styles from '../landing.module.css';

// What a generated plan contains — each line matches something the generator actually produces
const PLAN_CONTENTS = [
  { term: 'Objectives', desc: 'Written for your topic and grade level.' },
  { term: 'Procedure', desc: 'Activities in the styles you pick, split across your sessions.' },
  { term: 'Assessment', desc: 'Checks for understanding you can use as written or adjust.' },
  { term: 'Formats', desc: 'Lessora standard, DepEd semi-detailed, detailed lesson plan, daily lesson log, MATATAG.' },
  { term: 'Export', desc: 'Download as PDF or Word and keep editing from there.' },
];

export default function LandingPage() {
  const { data: landingMetrics } = useQuery({
    queryKey: ['landingMetrics'],
    queryFn: fetchLandingMetrics,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  });
  const numberFormatter = new Intl.NumberFormat();

  return (
    <div className={styles.userLanding}>
      <SiteHeader current="home" />
      <main className={styles.userLandingHero}>
        <div>
          <h1 className={styles.userLandingTitle}>A lesson plan for tomorrow&apos;s class</h1>
          <p className={styles.userLandingDescription}>
            Enter the topic, grade level and class time. Lessora writes the objectives, procedure
            and assessment in the format you choose. No account needed.
          </p>
        </div>
        <div className={styles.userLandingCallout}>
          <a href="/generate" className={styles.userLandingPrimaryCta}>
            Start a lesson plan
          </a>
          <p className={styles.userLandingUsageNote}>
            Generate up to 3 lesson plans a day without an account.
          </p>
          <div className={styles.userLandingSecondaryLinks}>
            <a href="/discover" className={styles.userLandingSecondaryLink}>
              Browse plans from other teachers
            </a>
          </div>
        </div>

        <section className={styles.userLandingContents} aria-labelledby="plan-contents">
          <h2 id="plan-contents" className={styles.userLandingContentsTitle}>In each plan</h2>
          <dl className={styles.userLandingContentsList}>
            {PLAN_CONTENTS.map((item) => (
              <div key={item.term} className={styles.userLandingContentsRow}>
                <dt className={styles.userLandingContentsTerm}>{item.term}</dt>
                <dd className={styles.userLandingContentsDesc}>{item.desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className={styles.userLandingCount}>
          <span className={styles.userLandingCountValue}>{numberFormatter.format(landingMetrics?.totalLessonPlans ?? 0)}</span>
          {' '}lesson plans written so far. <a href="/support">Help keep Lessora free</a>.
        </p>
      </main>
    </div>
  );
}
