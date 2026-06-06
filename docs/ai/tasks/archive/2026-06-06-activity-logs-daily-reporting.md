# Activity Logs and Daily Reporting Task Brief

## Summary

- task: add raw activity logging for key user events and a daily reporting pipeline that aggregates logs into daily metrics, analyzes them with OpenAI, and emails the report
- requested outcome:
  1. create a logs schema for user login, registration, lesson plan generation, and lesson plan subject/category tracking
  2. create a daily metric schema populated by a scheduled end-of-day job
  3. send the daily metric summary to OpenAI for short and detailed analysis in a friendly founder voice
  4. email the final report to `jamesgenabio31@gmail.com`
- primary constraint: keep the implementation simple and aligned with the existing routes -> controllers -> services -> schemas structure

## Linked artifacts

- spec: `docs/specs/2026-06-06-activity-logs-daily-reporting.md`
- plan: `docs/plans/2026-06-06-activity-logs-daily-reporting.md`

## Current state

- status: complete
- current owner: development
- next action: none
- blockers: none

## Progress checklist

- [x] define log event types and payload fields
- [x] define daily metric aggregation fields
- [x] define scheduler timing and date window rules
- [x] define OpenAI prompt style and email report format

## Scope

- in scope:
  - raw activity logging for auth and lesson generation events
  - daily aggregation into a new metric document
  - scheduled end-of-day processing
  - OpenAI analysis of the daily metric summary
  - email delivery of the report to the owner account
- out of scope:
  - admin-facing dashboards for this data
  - realtime analytics views
  - complex multi-tenant reporting
  - broad event tracking beyond the requested actions

## File ownership

- planner: unassigned
- implementer: unassigned
- reviewer: unassigned
- tester: unassigned

## Relevant files

- `server-side/src/schemas/`
- `server-side/src/services/`
- `server-side/src/controllers/`
- `server-side/src/routes/`
- `server-side/src/app.ts`
- `docs/specs/2026-06-06-activity-logs-daily-reporting.md`
- `docs/plans/2026-06-06-activity-logs-daily-reporting.md`

## Acceptance criteria

- criterion 1: the backend records raw logs for user login, registration, and lesson plan generation
- criterion 2: logs include the lesson plan subject/category when available
- criterion 3: a daily metric document is created from the log counts
- criterion 4: the scheduler runs at the configured end-of-day time in Pacific time
- criterion 5: OpenAI receives the aggregated metric summary and returns both a short summary and a detailed analysis
- criterion 6: the resulting report is emailed to `jamesgenabio31@gmail.com`

## Validation

- command 1: `npx tsc --noEmit` in `server-side`
- command 2: manual scheduler run against sample log data
- command 3: confirm report email delivery in a local/dev mail flow

## Risks or dependencies

- risk 1: timezone handling for `22:00 PST` must be explicit so the job does not run at the wrong local time
- risk 2: the OpenAI prompt should stay concise so analysis stays consistent and affordable
- dependency 1: existing OpenAI and email delivery infrastructure
- dependency 2: lesson generation code must expose the subject/category at log time

## Handoff notes

- use a single log collection with an event type field instead of separate collections for each action
- keep the daily metric as an aggregated snapshot, not a copy of the raw logs
- use a friendly founder voice in the OpenAI prompt, with both a short summary and a detailed analysis
- implementation completed and verified with `npx tsc --noEmit`
