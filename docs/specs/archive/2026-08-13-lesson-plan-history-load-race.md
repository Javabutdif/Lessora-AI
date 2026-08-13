# Spec: Lesson Plan History 404 Fallback

## Purpose

Make legacy lesson plans open reliably in preview and refine even when the stored `aiDocument` is missing but `draftText` is still available.

## Scope

- in scope:
  - history detail lookup for lesson plans
  - public detail lookup for public lesson plans
  - fallback reconstruction from `draftText`
- out of scope:
  - route changes
  - discover page changes
  - schema migrations
  - auth/session changes

## Proposed behavior

When a lesson plan record does not have `aiDocument`, the service should reconstruct a readable `LessonPlanDocument` from stored legacy content instead of throwing `NotFoundError`. The preferred source is `draftText`; if that is missing, fall back to `description` and `sessions`.

The reconstructed response should preserve the existing response shape so preview and refine pages keep working without any client-side changes. Newer records that already have `aiDocument` should continue to use the stored structured document.

## Acceptance criteria

- [x] History detail requests for legacy plans return `200` with a usable document payload
- [x] Public lesson plan detail requests continue to work for existing public records
- [x] Preview and refine pages can render legacy plans without a 404 error

## Constraints

- technical: keep the fallback inside the service layer so API callers do not need to branch on legacy data
- product: do not change the public discover flow or history URLs
- delivery: no database migration or new dependency

## Risks and open questions

- risk: reconstructed legacy documents may not exactly match the original generated structure
- question: are there any stored lesson plans with both `draftText` and `description` missing, which would still need a separate handling path?

## Related docs

- plan: [2026-08-13-lesson-plan-history-load-race.md](../../plans/archive/2026-08-13-lesson-plan-history-load-race.md)
- task brief: [2026-08-13-lesson-plan-history-load-race.md](../../ai/tasks/2026-08-13-lesson-plan-history-load-race.md)
