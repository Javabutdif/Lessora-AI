# Daily AI Credit Refresh Specification

## Feature overview

Users receive a daily refresh of their AI response credits, resetting to 5 credits each day at midnight UTC. The refresh system launches on June 9, 2026 and continues daily thereafter.

## Current state

- Users have `aiResponseCredits` field in User schema (default: 5)
- Credits are consumed when users generate lessons via OpenAI
- No automatic refresh mechanism currently exists

## Implementation approach

### Configuration

Add to `.env`:

```
CREDIT_REFRESH_START_DATE=2026-06-09T00:00:00Z
CREDIT_MAX_PER_USER=5
```

### Scheduler service

Create `server-side/src/services/credit-refresh.scheduler.ts`:

```typescript
import cron from "node-cron";
import { User } from "../schemas/user.schema";

const REFRESH_START_DATE = new Date(process.env.CREDIT_REFRESH_START_DATE);
const MAX_CREDITS = parseInt(process.env.CREDIT_MAX_PER_USER || "5");

export class CreditRefreshScheduler {
  static initialize() {
    const now = new Date();

    // If refresh date hasn't arrived, wait and then start
    if (now < REFRESH_START_DATE) {
      const delayMs = REFRESH_START_DATE.getTime() - now.getTime();
      console.log(`Credit refresh will start on ${REFRESH_START_DATE}`);
      setTimeout(() => this.startScheduler(), delayMs);
    } else {
      this.startScheduler();
    }
  }

  private static startScheduler() {
    // Run daily at midnight UTC
    cron.schedule("0 0 * * *", async () => {
      try {
        const result = await User.updateMany(
          { isActive: true },
          { aiResponseCredits: MAX_CREDITS },
        );
        console.log(`✓ Credit refresh: ${result.modifiedCount} users updated`);
      } catch (error) {
        console.error("✗ Credit refresh failed:", error);
      }
    });
    console.log("Credit refresh scheduler started");
  }
}
```

### App integration

In `server-side/src/app.ts`:

```typescript
import { CreditRefreshScheduler } from "./services/credit-refresh.scheduler";

// After database connection
CreditRefreshScheduler.initialize();
```

## Behavior

- Runs daily at **midnight UTC** starting June 9, 2026
- Resets all `isActive: true` users to 5 credits
- Runs silently (just console logs for verification)
- Credits do NOT accumulate (always reset to max, not add to current)

## Dependencies

- `node-cron` npm package
- Existing User schema with `isActive` field
- Environment variables for start date and max credits

## Testing

- Manually trigger or use `setTimeout` to test before June 9
- Verify database shows users with 5 credits after refresh
- Check console logs confirm execution
