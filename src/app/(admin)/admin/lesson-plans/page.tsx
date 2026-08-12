"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchAdminLessonPlans, AdminLessonPlanHistoryItem } from "@/app/lib/api-client";
import LoadingSkeleton from "@/app/components/loading-skeleton";
import styles from "./plans.module.css";

export default function AdminLessonPlansPage() {
  const router = useRouter();
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["adminLessonPlans"],
    queryFn: fetchAdminLessonPlans,
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>All Lesson Plans</h1>
          <button type="button" onClick={() => router.push("/admin/dashboard")} className={styles.btnBack}>Back to Dashboard</button>
        </header>

        {isLoading && <LoadingSkeleton lines={5} />}

        {error && <div className={styles.error}>{typeof error === 'string' ? error : String(error)}</div>}

        {!isLoading && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Grade</th>
                <th>Duration</th>
                <th>Created</th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              {plans?.map((plan) => (
                <tr key={plan.id}>
                  <td className={styles.cellTitle}>{plan.title}</td>
                  <td>{plan.subject}</td>
                  <td>{plan.gradeLevel}</td>
                  <td>{plan.totalDuration} min</td>
                  <td>{new Date(plan.createdAt).toLocaleDateString()}</td>
                  <td>{plan.createdBy.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && (!plans || plans.length === 0) && (
          <div className={styles.empty}>No lesson plans found.</div>
        )}
      </div>
    </div>
  );
}
