# Spec: Lesson Plan History

## Purpose

Persist generated lesson plans to MongoDB and show them as recent plans in the mobile dashboard.

## Scope

- in scope: save generated lesson plan documents, list recent user plans, fetch plan details, display recent plans, open saved plans, export saved plans
- out of scope: deleting plans, renaming plans, cross-user sharing, saving later edits back to MongoDB

## Proposed behavior

When an authenticated user successfully generates a lesson plan, the backend saves the generated JSON document and metadata to MongoDB. The dashboard recent plans section reads the user's latest generated plans from the backend. Tapping a recent plan opens the Generate Plan screen with the saved document loaded in preview mode. The user can edit the loaded document locally and export it through the existing export endpoint.

## Acceptance criteria

- [x] Successful AI generation creates a `LessonPlan` document owned by the authenticated user.
- [x] Recent plans endpoint returns only the authenticated user's plans.
- [x] Plan detail endpoint returns only a plan owned by the authenticated user.
- [x] Dashboard displays recent plans from MongoDB instead of static cards.
- [x] Tapping a recent plan opens it in the Generate Plan preview/editor flow.
- [x] Export works for loaded history plans using the existing export endpoint.

## Constraints

- technical: reuse the existing `LessonPlan` model
- product: history belongs to the signed-in teacher only
- delivery: keep saved-plan editing local until an explicit save/update feature is requested

## Risks and open questions

- risk: existing generated plans before this change will not appear unless stored in MongoDB
- question: future work may add update/delete/folders/search

## Related docs

- plan: [2026-05-28-lesson-plan-history.md](../plans/2026-05-28-lesson-plan-history.md)
- task brief: [2026-05-28-lesson-plan-history.md](../ai/tasks/2026-05-28-lesson-plan-history.md)
