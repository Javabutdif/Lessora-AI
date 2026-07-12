<!-- CLI-parsed fields (keys are case-sensitive; must appear as "- key: value" bullets):
  status        required  Values: todo | in progress | completed
  next action   required  Free-text description of the next step
  blockers      optional  Use "none" when clear
  spec          optional  Path like docs/specs/YYYY-MM-DD-slug.md  or "none"
  plan          optional  Path like docs/plans/YYYY-MM-DD-slug.md  or "none" (requires spec when set)

  Wrap file paths in backticks: - spec: `docs/specs/2026-04-04-foo.md`
  Key capitalisation matters: "- Status: todo" (capital S) will NOT be parsed.
-->

# Paymongo Support Donation

## Summary

- task: Document a future Paymongo-powered support donation flow for Lessora AI.
- requested outcome: Add a clear public donation path, describe the Paymongo checkout and webhook flow, and keep the docs aligned so implementation can start from the same scope.
- primary constraint: Keep the first pass simple; prefer Paymongo-hosted checkout over custom payment handling.

## Linked artifacts

- spec: `docs/specs/2026-07-12-paymongo-support-donation.md`
- plan: `docs/plans/2026-07-12-Paymongo-Support-Donation.md`

## Current state

- status: completed
- current owner: implementer
- next action: none
- blockers: none

## Progress checklist

- [x] Define the donation use case and scope
- [x] Write the implementation spec
- [x] Write the implementation plan
- [x] Link the task brief to the spec and plan
- [x] Verify filenames and references match the date and topic

## Scope

- in scope: donation entry point, QRPh-only Paymongo-hosted checkout, webhook confirmation, thank-you state, and the docs needed to hand the work off
- out of scope: custom card entry UI, recurring subscriptions, donation analytics, code implementation in client or server

## File ownership

- planner: n/a
- implementer: n/a
- reviewer: n/a
- tester: n/a

## Relevant files

- `docs/plans/2026-07-12-Paymongo-Support-Donation.md`
- `docs/specs/2026-07-12-paymongo-support-donation.md`
- `docs/ai/tasks/2026-07-12-paymongo-support-donation.md`

## Acceptance criteria

- [x] docs describe the donation user journey and the Paymongo handoff clearly
- [x] spec and plan are linked from the task brief
- [x] scope is limited to support donations and not broader payments
- [x] filenames use the same date and topic across artifacts

## Validation

- [x] Confirm the three linked docs use matching paths and titles
- [x] Review the docs for consistent scope and assumptions

## Risks or dependencies

- risk 1: Paymongo product choice could shift between payment links and checkout sessions if product constraints change.
- risk 2: donation amounts or labels may need product signoff before implementation.

## Handoff notes

- The next implementation step should start from the spec and keep the payment surface minimal unless product asks for more flexibility.
