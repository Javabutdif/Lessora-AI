import cron, { ScheduledTask } from "node-cron";
import { DailyReportService } from "./daily-report.service";

export class ActivityReportScheduler {
  private static task: ScheduledTask | null = null;

  static initialize() {
    if (this.task) {
      return;
    }

    this.task = cron.schedule(
      "0 22 * * *",
      async () => {
        try {
          const metric = await DailyReportService.runForDate();
          console.log(
            `Daily activity report sent for ${metric.reportDate}`,
          );
        } catch (error) {
          console.error("Daily activity report failed:", error);
        }
      },
      {
        timezone: "America/Los_Angeles",
      },
    );

    console.log("Daily activity reporting scheduler started for 22:00 PST");
  }
}
