# Daily Report JSON Format Implementation Plan

**Goal:** make the daily AI report return structured JSON and render the email from that structure.

**Architecture:** daily-report service asks OpenAI for a small JSON object, parses it, and passes the parsed fields to `buildEmailHtml`.

## References

- spec: [2026-06-07-daily-report-json-format.md](../specs/2026-06-07-daily-report-json-format.md)
- task brief: [2026-06-07-daily-report-json-format.md](../ai/tasks/2026-06-07-daily-report-json-format.md)

## Steps

- [x] define a small JSON shape for the daily report
- [x] update the OpenAI prompt to return JSON only
- [x] parse the response and render the email from parsed fields
- [ ] run server TypeScript validation

## Validation

- [ ] `npx tsc --noEmit` in `server-side`
