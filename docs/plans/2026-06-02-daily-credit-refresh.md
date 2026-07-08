# Daily AI Credit Refresh Implementation Plan

**Goal:** Implement automatic daily reset of user AI response credits starting June 9, 2026.

**Architecture:** Node.js cron scheduler running daily at 00:00 Asia/Manila, executes bulk user credit update with simple console logging.

**Tech Stack:** node-cron, Express, TypeScript, MongoDB.

---

## References

- spec: [2026-06-02-daily-credit-refresh.md](../specs/2026-06-02-daily-credit-refresh.md)
- task brief: [2026-06-02-user-auth-credits-admin-features.md](../ai/tasks/2026-06-02-user-auth-credits-admin-features.md)

## Steps

### Phase 1: Setup & scheduler (1 day)

- [x] Install `node-cron` in server-side
- [ ] Add environment variables to `.env`:
  - `CREDIT_REFRESH_START_DATE=2026-06-09T00:00:00+08:00`
  - `CREDIT_MAX_PER_USER=5`
- [x] Create `server-side/src/services/credit-refresh.scheduler.ts`
  - Implement startup date check and delay activation
  - Implement cron job at 00:00 Asia/Manila
  - Add console logging for execution
  - Send email notification after each scheduled run with success or failure details
- [x] Register scheduler in `server-side/src/app.ts` after DB connection

### Phase 2: Testing (1 day)

- [x] Test scheduler initializes correctly through TypeScript compilation
- [x] Add `CreditRefreshScheduler.initialize(now)` and `refreshCreditsNow()` seams for manual date/DB testing
- [ ] Verify database updates: create test users, trigger refresh, check credits reset to 5
- [ ] Verify console logs show execution
- [ ] Verify notification email is sent for both success and failure paths
- [x] Run `npx tsc --noEmit`

## Validation

- [x] `npx tsc --noEmit` passes
- [ ] Manual test: users' credits reset to 5 after refresh
- [ ] Console logs confirm daily execution
- [ ] Notification email confirms refresh result

## Risks

- risk 1: Server restart loses scheduler (mitigation: cron resumes, no data lost)
- risk 2: Verify June 9 date is correct before deploy
- dependency 1: Ensure User schema has `isActive` field
