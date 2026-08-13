# Lesson Plan History 404 Fallback

## Summary

- task: Fix lesson plan history detail requests that return 404 for older records
- requested outcome: legacy lesson plans open in preview and refine even when `aiDocument` is missing
- primary constraint: keep the fix narrow and preserve the public discover flow

## Linked artifacts

- spec: `docs/specs/archive/2026-08-13-lesson-plan-history-load-race.md`
- plan: `docs/plans/archive/2026-08-13-lesson-plan-history-load-race.md`

## Current state

- status: completed
- current owner: qa
- next action: none
- blockers: none

## Progress checklist

- [x] Read the affected files and traced the 404 to the detail lookup path
- [x] Draft the fallback behavior and scope
- [x] Implement the service-side document reconstruction
- [x] Validate with build and manual history/detail checks

## Scope

- in scope: `src/lib/services/openai.service.ts`, task/spec/plan docs
- out of scope: public discover UI changes, route shape changes, schema migrations, auth changes

## File ownership

- planner: Codex
- implementer: Codex
- reviewer: Codex
- tester: Codex

## Relevant files

- `src/lib/services/openai.service.ts`
- `src/lib/schemas/lesson.schema.ts`
- `src/app/api/ai/lesson-plan/history/[id]/route.ts`
- `src/app/api/ai/lesson-plan/public/[id]/route.ts`
- `src/app/(teacher)/preview/[id]/page.tsx`
- `src/app/(teacher)/refine/[id]/page.tsx`

## Acceptance criteria

- history detail requests for legacy lesson plans return 200 instead of 404 when `draftText` is present
- preview and refine pages can open the same legacy plan without showing the "Failed to load lesson plan" panel

## Validation

- `npm run build`
- manual browser check for a legacy history item

## Risks or dependencies

- risk: legacy reconstruction may only approximate older records when `aiDocument` and `draftText` are both missing
- dependency: stored `description` or `sessions` data must exist for the broader fallback to work

## Handoff notes

- the implementation should stay in the service layer so the API contract does not change for callers
