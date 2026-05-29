# Lesson Plan Preview History Implementation Plan

**Goal:** Fix TypeScript errors in untracked files for the `LessonPlanPreviewScreen` and history functionality, and formally track them in the repo's AI workflow.

**Architecture:** Update navigation parameter types in `HomeScreen` and add nullable check in `LessonPlanPreviewScreen`.

**Tech Stack:** React Native, TypeScript

---

## References

- spec: [2026-05-29-lesson-plan-preview-history.md](../specs/2026-05-29-lesson-plan-preview-history.md)
- task brief: [2026-05-29-lesson-plan-preview-history.md](../ai/tasks/2026-05-29-lesson-plan-preview-history.md)
- product doc: none

## Steps

- [x] Fix navigation type errors in `HomeScreen.tsx`
- [x] Fix undefined guard in `LessonPlanPreviewScreen.tsx`
- [x] Update internal workflow docs (task, spec, plan)

## Validation

- [x] Run `npx tsc --noEmit` in `client-side`.
- [x] Run `npm run workflow -- check --task docs/ai/tasks/2026-05-29-lesson-plan-preview-history.md`.

## Risks

- risk 1: none
- risk 2: none

## Handoff notes

- anything the next agent needs to know: none
