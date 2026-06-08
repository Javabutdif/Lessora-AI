<!-- CLI-parsed fields (keys are case-sensitive; must appear as "- key: value" bullets:
  status        required  Values: todo | in progress | completed
  next action   required  Free-text description of the next step
  blockers      optional  Use "none" when clear
  spec          optional  Path like docs/specs/YYYY-MM-DD-slug.md  or "none"
  plan          optional  Path like docs/plans/YYYY-MM-DD-slug.md  or "none" (requires spec when set)

  Wrap file paths in backticks: - spec: `docs/specs/2026-06-08-foo.md`
  Key capitalisation matters: "- Status: todo" (capital S) will NOT be parsed.
-->

# Task Brief

## Summary

- task: add rate limiting to server-side API routes
- requested outcome: protect auth, user, admin, and AI endpoints with simple request throttling
- primary constraint: keep the solution lightweight and avoid introducing new dependencies

## Linked artifacts

- spec: `docs/specs/2026-06-08-server-side-rate-limiting.md`
- plan: `docs/plans/2026-06-08-server-side-rate-limiting.md`

## Current state

- status: in progress
- current owner: Codex
- next action: verify the auth-specific write limits and keep the API-wide limiter in place
- blockers: none

## Progress checklist

- [x] confirm the route groups that need coverage
- [x] implement the middleware and apply it to the server routes
- [ ] run type-check validation

## Scope

- in scope: server-side API request throttling for the exposed route groups
- out of scope: distributed rate limiting, persistence-backed counters, and client-side changes

## File ownership

- planner: Codex
- implementer: Codex
- reviewer: Codex
- tester: Codex

## Relevant files

- `server-side/src/app.ts`
- `server-side/src/routes/auth.routes.ts`
- `server-side/src/routes/user.routes.ts`
- `server-side/src/routes/admin.routes.ts`
- `server-side/src/routes/ai.routes.ts`
- `server-side/src/middleware/auth.middleware.ts`
- `server-side/src/middleware/rate-limit.middleware.ts`

## Acceptance criteria

- requests to the API route groups are throttled with a simple in-memory limit
- auth login, registration, and password reset traffic stay protected without overcomplicating the code
- existing behavior for healthy traffic remains unchanged

## Validation

- `cd server-side && npx tsc --noEmit`

## Risks or dependencies

- risk: in-memory counters reset on process restart
- dependency: route coverage stays aligned with the current API structure

## Handoff notes

- keep the first pass minimal and reuse existing route files rather than adding another abstraction layer
