import { CreditRefreshScheduler } from "./services/credit-refresh.scheduler";
import { ActivityReportScheduler } from "./services/activity-report.scheduler";
import { SessionCreditRefreshScheduler } from "./services/session-credit-refresh.scheduler";

export function initializeSchedulers() {
  CreditRefreshScheduler.initialize();
  ActivityReportScheduler.initialize();
  SessionCreditRefreshScheduler.initialize();
  console.log("All schedulers initialized");
}
