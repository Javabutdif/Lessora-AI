# Lesson Plan History 404 Fallback Implementation Plan

**Goal:** Stop legacy lesson plan history requests from returning 404 when `aiDocument` is missing but `draftText` still exists.

**Architecture:** Keep the change in `src/lib/services/openai.service.ts`. Add a small internal fallback that turns the stored `draftText` back into a `LessonPlanDocument`, then reuse that fallback in both detail getters so the API contract stays unchanged for preview and refine callers.

**Tech Stack:** Next.js App Router, TypeScript, MongoDB/Mongoose models, existing `npm run build` validation.

---

## References

- spec: [2026-08-13-lesson-plan-history-load-race.md](../specs/archive/2026-08-13-lesson-plan-history-load-race.md)
- task brief: [2026-08-13-lesson-plan-history-load-race.md](../../ai/tasks/2026-08-13-lesson-plan-history-load-race.md)

## Steps

- [x] Add a draft-text parser that reconstructs a lesson plan document for legacy records
- [x] Use the parser in both `getPublicLessonPlanById` and `getLessonPlanById`
- [x] Verify the build and the affected preview/refine flows

## Validation

- [x] Run `npm run build`
- [x] Manually open a legacy history item in preview and refine

## Risks

- risk 1: the fallback parser may not exactly mirror every old record's original structure
- risk 2: malformed legacy draft text could still fail if it is too incomplete to reconstruct

## Handoff notes

- keep the public response shape unchanged so no client-side branching is needed
