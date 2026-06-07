# Daily Report JSON Format

## Goal

Keep the daily AI report structured so the backend can render a predictable email from JSON instead of freeform prose.

## References

- Spec: [2026-06-07-daily-report-json-format.md](../../../specs/2026-06-07-daily-report-json-format.md)
- Plan: [2026-06-07-daily-report-json-format.md](../../../plans/2026-06-07-daily-report-json-format.md)

## Relevant files

- `server-side/src/services/daily-report.service.ts`
- `server-side/src/services/activity-report.scheduler.ts`
- `server-side/src/services/openai.service.ts`

## Constraints

- keep the change small
- avoid new abstractions
- preserve the current email flow

## Status

- [x] inspected the current daily report flow
- [x] updated the report service to request structured JSON
- [x] run server type checking

## Next action

- none

## Notes

- The report now expects `summaryText`, `detailedAnalysis`, and `highlights` from OpenAI.
