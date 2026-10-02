import SiteHeader from "@/app/components/site-header";
import LoadingSkeleton from "@/app/components/loading-skeleton";
import styles from "@/portal-theme.module.css";

export default function TeacherLoading() {
  return (
    <div className={styles.userAppPage}>
      <SiteHeader />
      <div className={styles.userAppContainerNarrow}>
        <LoadingSkeleton lines={8} />
      </div>
    </div>
  );
}
