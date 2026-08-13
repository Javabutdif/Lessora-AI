# Public Lesson Plan Read Path Implementation Plan

**Goal:** Make preview and refine load lesson plan details from the public endpoint so public lesson plans no longer depend on session-owned history reads.

**Architecture:** Keep the data-fetch change at the page layer. Preview should always call `getPublicLessonPlanById()` and refine should do the same, while the preview metadata loader stays as-is because it already uses the public endpoint. Update the user-facing docs to match the new public read path and remove stale session-based wording.

**Tech Stack:** Next.js App Router, TypeScript, existing `api-client.ts` helpers, Markdown docs, `npm run build`.

---

## References

- spec: [2026-08-13-public-lesson-plan-read-path.md](../specs/archive/2026-08-13-public-lesson-plan-read-path.md)
- task brief: [2026-08-13-public-lesson-plan-read-path.md](../../ai/tasks/2026-08-13-public-lesson-plan-read-path.md)

## Steps

- [x] Update `src/app/(teacher)/preview/[id]/page.tsx` to always use `getPublicLessonPlanById()` for the initial fetch
- [x] Update `src/app/(teacher)/refine/[id]/page.tsx` to use `getPublicLessonPlanById()` for the initial fetch
- [x] Update `README.md` and `docs/ai/lessora-structure-workflow.md` to describe the public read path
- [x] Verify the build and a public preview/refine flow in the browser

## Validation

- [x] Run `npm run build`
- [x] Open a public lesson plan in preview and confirm no history endpoint is requested for the plan body
- [x] Open the matching refine page and confirm it loads the same public lesson plan

## Risks

- risk 1: any remaining public plans that are not marked public in the database will still 404 on the public detail endpoint
- risk 2: documentation edits can drift if they are not kept aligned with the page change

## Handoff notes

- keep the preview metadata loader unchanged; it already uses the public detail endpoint
