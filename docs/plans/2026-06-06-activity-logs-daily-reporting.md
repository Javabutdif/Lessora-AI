# Activity Logs and Daily Reporting Implementation Plan

**Goal:** add lightweight activity logging plus a daily reporting scheduler that aggregates logs, asks OpenAI for founder-style analysis, and emails the result to the owner.

**Architecture:** server-side event logging into a raw logs collection, daily aggregation into a daily metric collection, then OpenAI analysis and email delivery from a scheduled job.

**Tech Stack:** Node.js, Express, TypeScript, MongoDB, Mongoose, OpenAI, email service, cron scheduler.

---

## References

- spec: [2026-06-06-activity-logs-daily-reporting.md](../specs/2026-06-06-activity-logs-daily-reporting.md)
- task brief: [2026-06-06-activity-logs-daily-reporting.md](../ai/tasks/2026-06-06-activity-logs-daily-reporting.md)

## Steps

### Phase 1: Data model and event capture

- [ ] add a logs schema for raw activity events
- [ ] add a daily metric schema for aggregated reporting
- [ ] wire event logging into login, registration, and lesson generation flows
- [ ] ensure lesson plan subject/category is captured with generation events

### Phase 2: Scheduler and aggregation

- [ ] create a scheduler service for the end-of-day reporting job
- [ ] define the Pacific-time schedule at `22:00 PST`
- [ ] fetch and aggregate log counts on the server
- [ ] create and store the daily metric record

### Phase 3: OpenAI analysis and email

- [ ] send the aggregated metric summary to OpenAI
- [ ] request both a short summary and a detailed analysis
- [ ] use a friendly founder voice for Lessora AI
- [ ] email the final report to `jamesgenabio31@gmail.com`

### Phase 4: Validation

- [ ] verify logs are created for the target events
- [ ] verify the daily metric counts match the raw logs
- [ ] verify the report email is delivered successfully
- [ ] run TypeScript validation for the server

## Validation

- [ ] `npx tsc --noEmit` in `server-side`
- [ ] manual scheduler run with sample data
- [ ] manual email delivery check in dev

## Risks

- risk 1: Pacific timezone handling must be explicit to avoid running at the wrong time
- risk 2: the OpenAI prompt should stay compact so outputs remain predictable
- risk 3: event capture must not interfere with existing auth or lesson generation flows
