import cron, { ScheduledTask } from "node-cron";
import { User } from "../schemas/user.schema";
import { ResendService } from "./resend.service";

const DEFAULT_REFRESH_START_DATE = "2026-06-09T00:00:00+08:00";
const DEFAULT_MAX_CREDITS = 5;
const CREDIT_REFRESH_TIME_ZONE = "Asia/Manila";
const CREDIT_REFRESH_NOTIFICATION_EMAIL = "jamesgenabio31@gmail.com";

function getRefreshStartDate() {
  const configuredDate = process.env.CREDIT_REFRESH_START_DATE || DEFAULT_REFRESH_START_DATE;
  const startDate = new Date(configuredDate);

  if (Number.isNaN(startDate.getTime())) {
    console.warn(`Invalid CREDIT_REFRESH_START_DATE "${configuredDate}", using ${DEFAULT_REFRESH_START_DATE}`);
    return new Date(DEFAULT_REFRESH_START_DATE);
  }

  return startDate;
}

function getMaxCredits() {
  const configuredCredits = Number.parseInt(
    process.env.CREDIT_MAX_PER_USER || String(DEFAULT_MAX_CREDITS),
    10,
  );

  if (!Number.isFinite(configuredCredits) || configuredCredits < 0) {
    console.warn(`Invalid CREDIT_MAX_PER_USER "${process.env.CREDIT_MAX_PER_USER}", using ${DEFAULT_MAX_CREDITS}`);
    return DEFAULT_MAX_CREDITS;
  }

  return configuredCredits;
}

function formatRefreshTimestamp(date: Date) {
  return date.toLocaleString("en-PH", {
    timeZone: CREDIT_REFRESH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function buildCreditRefreshEmailHtml(params: {
  status: "success" | "failed";
  timestamp: Date;
  matchedCount?: number;
  modifiedCount?: number;
  maxCredits?: number;
  errorMessage?: string;
}) {
  const heading = params.status === "success" ? "Credit Refresh Completed" : "Credit Refresh Failed";
  const intro =
    params.status === "success"
      ? "The daily AI response credit refresh ran on the server."
      : "The daily AI response credit refresh encountered an error on the server.";

  const details =
    params.status === "success"
      ? `
      <ul>
        <li>Run time: ${formatRefreshTimestamp(params.timestamp)} ${CREDIT_REFRESH_TIME_ZONE}</li>
        <li>Active users matched: ${params.matchedCount ?? 0}</li>
        <li>Users updated: ${params.modifiedCount ?? 0}</li>
        <li>Credits set per active user: ${params.maxCredits ?? DEFAULT_MAX_CREDITS}</li>
      </ul>
    `
      : `
      <ul>
        <li>Failure time: ${formatRefreshTimestamp(params.timestamp)} ${CREDIT_REFRESH_TIME_ZONE}</li>
        <li>Error: ${params.errorMessage || "Unknown error"}</li>
      </ul>
    `;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 8px;">Lessora AI ${heading}</h2>
      <p style="margin-top: 0;">${intro}</p>
      ${details}
    </div>
  `;
}

export class CreditRefreshScheduler {
  private static task: ScheduledTask | null = null;
  private static startTimeout: NodeJS.Timeout | null = null;

  static initialize(now = new Date()) {
    if (this.task || this.startTimeout) {
      return;
    }

    const refreshStartDate = getRefreshStartDate();

    if (now < refreshStartDate) {
      const delayMs = refreshStartDate.getTime() - now.getTime();
      console.log(`Credit refresh scheduler will start on ${refreshStartDate.toLocaleString("en-PH", { timeZone: CREDIT_REFRESH_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })} ${CREDIT_REFRESH_TIME_ZONE} (in ${Math.round(delayMs / 1000)} seconds)`);
      this.startTimeout = setTimeout(() => {
        this.startTimeout = null;
        this.startScheduler();
      }, delayMs);
      return;
    }

    this.startScheduler();
  }

  static async refreshCreditsNow() {
    const maxCredits = getMaxCredits();
    const result = await User.updateMany({ isActive: true }, { $set: { aiResponseCredits: maxCredits } });
    return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount, maxCredits };
  }

  private static async sendRefreshNotification(params: {
    status: "success" | "failed";
    timestamp: Date;
    matchedCount?: number;
    modifiedCount?: number;
    maxCredits?: number;
    errorMessage?: string;
  }) {
    const subject =
      params.status === "success"
        ? `Lessora AI Credit Refresh Success - ${formatRefreshTimestamp(params.timestamp)}`
        : `Lessora AI Credit Refresh Failed - ${formatRefreshTimestamp(params.timestamp)}`;

    await ResendService.send({
      to: CREDIT_REFRESH_NOTIFICATION_EMAIL,
      subject,
      html: buildCreditRefreshEmailHtml(params),
    });
  }

  private static startScheduler() {
    if (this.task) return;

    this.task = cron.schedule(
      "0 0 * * *",
      async () => {
        try {
          const result = await this.refreshCreditsNow();
          const refreshedAt = new Date();
          console.log(`Credit refresh completed: ${result.modifiedCount}/${result.matchedCount} active users set to ${result.maxCredits} credits`);
          try {
            await this.sendRefreshNotification({ status: "success", timestamp: refreshedAt, matchedCount: result.matchedCount, modifiedCount: result.modifiedCount, maxCredits: result.maxCredits });
          } catch (notificationError) {
            console.error("Credit refresh success notification failed:", notificationError);
          }
        } catch (error) {
          console.error("Credit refresh failed:", error);
          try {
            await this.sendRefreshNotification({ status: "failed", timestamp: new Date(), errorMessage: error instanceof Error ? error.message : "Unknown error" });
          } catch (notificationError) {
            console.error("Credit refresh failure notification failed:", notificationError);
          }
        }
      },
      { timezone: CREDIT_REFRESH_TIME_ZONE },
    );

    console.log(`Credit refresh scheduler started for 00:00 ${CREDIT_REFRESH_TIME_ZONE}`);
  }
}
