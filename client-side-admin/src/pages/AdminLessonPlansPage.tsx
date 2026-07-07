import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Table } from "../components/ui";
import {
  AdminLessonPlanHistoryItem,
  fetchAdminLessonPlans,
} from "../services/api";
import { TableColumn } from "../types/components";
import styles from "./AdminLessonPlansPage.module.css";

export default function AdminLessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<AdminLessonPlanHistoryItem[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    void loadLessonPlans();
  }, []);

  async function loadLessonPlans() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAdminLessonPlans();
      setLessonPlans(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load lesson plans",
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const filteredLessonPlans = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return lessonPlans;
    }

    return lessonPlans.filter((lessonPlan) =>
      [
        lessonPlan.title,
        lessonPlan.subject,
        lessonPlan.gradeLevel,
        lessonPlan.createdBy.name,
        lessonPlan.createdBy.email,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [lessonPlans, searchQuery]);

  const columns: TableColumn[] = [
    {
      key: "title",
      label: "Lesson plan",
      width: "28%",
    },
    {
      key: "subject",
      label: "Subject",
      width: "16%",
    },
    {
      key: "gradeLevel",
      label: "Grade",
      width: "14%",
    },
    {
      key: "createdAt",
      label: "Created",
      width: "20%",
      render: (value: string) => formatDate(value),
    },
    {
      key: "createdBy",
      label: "Created by",
      width: "22%",
      render: (value: AdminLessonPlanHistoryItem["createdBy"]) => (
        <span className={styles.creatorCell}>
          <span className={styles.creatorName}>{value.name}</span>
          <span className={styles.creatorEmail}>{value.email}</span>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <p className={styles.headerLabel}>Lesson Plan History</p>
            <h1 className={styles.headerTitle}>Admin lesson plans</h1>
            <p className={styles.headerDescription}>
              Review generated lesson plans and see which teacher account
              created each one.
            </p>
          </div>

          <Button
            variant="secondary"
            size="medium"
            onClick={() => navigate("/admin/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchField}>
            <Input
              label="Search"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search title, subject, grade, or teacher"
              fullWidth
              name="lesson-plan-search"
            />
          </div>
          <p className={styles.resultCount}>
            {filteredLessonPlans.length}{" "}
            {filteredLessonPlans.length === 1 ? "plan" : "plans"}
          </p>
        </div>

        {error ? (
          <div className={styles.errorBanner} role="alert">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="small"
              onClick={() => void loadLessonPlans()}
            >
              Try again
            </Button>
          </div>
        ) : null}

        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            data={filteredLessonPlans}
            loading={loading}
            emptyMessage={
              searchQuery
                ? "No lesson plans match that search."
                : "No lesson plans found."
            }
          />
        </div>
      </div>
    </div>
  );
}
