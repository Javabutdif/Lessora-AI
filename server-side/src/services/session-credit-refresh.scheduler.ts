import cron, { ScheduledTask } from "node-cron";
import { Session } from "../schemas/session.schema";

const DEFAULT_MAX_ANON_CREDITS = 3;
const CREDIT_REFRESH_TIME_ZONE = "Asia/Manila";

export class SessionCreditRefreshScheduler {
  private static task: ScheduledTask | null = null;

  static initialize() {
    if (this.task) {
      return;
    }

    this.task = cron.schedule(
      "0 0 * * *",
      async () => {
        try {
          const result = await Session.updateMany(
            {},
            { $set: { aiResponseCredits: DEFAULT_MAX_ANON_CREDITS } },
          );
          console.log(
            `Session credit refresh completed: ${result.modifiedCount} sessions reset to ${DEFAULT_MAX_ANON_CREDITS} credits`,
          );
        } catch (error) {
          console.error("Session credit refresh failed:", error);
        }
      },
      {
        timezone: CREDIT_REFRESH_TIME_ZONE,
      },
    );

    console.log(
      `Session credit refresh scheduler started for 00:00 ${CREDIT_REFRESH_TIME_ZONE}`,
    );
  }
}
