# Public Lesson Plan Read Path

## Summary

- task: Make lesson plan preview and refine load public lesson details instead of session-owned history details
- requested outcome: public lesson plans open cleanly in preview and refine without relying on ownership-gated history reads
- primary constraint: keep the change narrow to the public read path and documentation

## Linked artifacts

- spec: `docs/specs/archive/2026-08-13-public-lesson-plan-read-path.md`
- plan: `docs/plans/archive/2026-08-13-public-lesson-plan-read-path.md`

## Current state

- status: completed
- current owner: qa
- next action: none
- blockers: none

## Progress checklist

- [x] Confirmed preview currently branches on `?public=true`
- [x] Confirmed refine still reads the session-owned history endpoint directly
- [x] Confirmed preview metadata already uses the public detail endpoint
- [x] Implement the public read path in both pages
- [x] Update the behavior docs and README wording

## Scope

- in scope: `src/app/(teacher)/preview/[id]/page.tsx`, `src/app/(teacher)/refine/[id]/page.tsx`, `README.md`, `docs/ai/lessora-structure-workflow.md`
- out of scope: admin auth, backend route behavior, lesson-plan generation logic, schema changes

## File ownership

- planner: Codex
- implementer: Codex
- reviewer: Codex
- tester: Codex

## Relevant files

- `src/app/(teacher)/preview/[id]/page.tsx`
- `src/app/(teacher)/refine/[id]/page.tsx`
- `src/app/(teacher)/preview/[id]/layout.tsx`
- `src/app/lib/api-client.ts`
- `README.md`
- `docs/ai/lessora-structure-workflow.md`

## Acceptance criteria

- `/preview/[id]` loads public plans without using the history detail endpoint
- `/refine/[id]` loads public plans without using the history detail endpoint
- docs no longer describe the preview/refine read path as session-owned

## Validation

- `npm run build`
- manual browser check on a known public lesson plan ID

## Risks or dependencies

- risk: if any public plans are not actually marked public in the database, the public detail endpoint will still return 404
- dependency: the existing public detail endpoint and metadata loader remain unchanged

## Handoff notes

- the preview metadata loader already follows the public endpoint, so the page components should match it
