import cron, { ScheduledTask } from "node-cron";
import { User } from "../schemas/user.schema";

const DEFAULT_REFRESH_START_DATE = "2026-06-09T00:00:00Z";
const DEFAULT_MAX_CREDITS = 5;

function getRefreshStartDate() {
  const configuredDate =
    process.env.CREDIT_REFRESH_START_DATE || DEFAULT_REFRESH_START_DATE;
  const startDate = new Date(configuredDate);

  if (Number.isNaN(startDate.getTime())) {
    console.warn(
      `Invalid CREDIT_REFRESH_START_DATE "${configuredDate}", using ${DEFAULT_REFRESH_START_DATE}`,
    );
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
    console.warn(
      `Invalid CREDIT_MAX_PER_USER "${process.env.CREDIT_MAX_PER_USER}", using ${DEFAULT_MAX_CREDITS}`,
    );
    return DEFAULT_MAX_CREDITS;
  }

  return configuredCredits;
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
      console.log(
        `Credit refresh scheduler will start on ${refreshStartDate.toISOString().slice(0, 10)} UTC (in ${Math.round(delayMs / 1000)} seconds)`,
      );
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
    const result = await User.updateMany(
      { isActive: true },
      { $set: { aiResponseCredits: maxCredits } },
    );

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      maxCredits,
    };
  }

  private static startScheduler() {
    if (this.task) {
      return;
    }

    this.task = cron.schedule(
      "0 0 * * *",
      async () => {
        try {
          const result = await this.refreshCreditsNow();
          console.log(
            `Credit refresh completed: ${result.modifiedCount}/${result.matchedCount} active users set to ${result.maxCredits} credits`,
          );
        } catch (error) {
          console.error("Credit refresh failed:", error);
        }
      },
      {
        timezone: "UTC",
      },
    );

    console.log("Credit refresh scheduler started for midnight UTC");
  }
}
