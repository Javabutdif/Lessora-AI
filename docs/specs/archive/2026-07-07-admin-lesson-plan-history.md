# Spec: Admin Lesson Plan History

## Purpose

Add a small admin-only lesson-plan history view so administrators can see which teacher accounts are generating lesson plans and when those plans were created.

## Scope

- in scope: admin API endpoint for lesson-plan history, admin page for viewing history, created-by teacher attribution, lightweight client-side search
- out of scope: teacher-side history changes, admin editing or deleting lesson plans, lesson-plan detail view, pagination, schema migrations

## Proposed behavior

Authenticated admins can open a dedicated `/admin/lesson-plans` page in the web admin portal. The page loads lesson plans from a new `GET /api/admin/lesson-plans` endpoint and shows a read-only list with lesson title, subject, grade level, created date, and the teacher account that generated the plan.

The backend reuses the existing `LessonPlan` model and populates the owning teacher from `LessonPlan.userId`. Each response item includes `createdBy: { id, name, email }`, where `name` is built from `firstName` and `lastName` and falls back to the teacher email if a complete name is not available.

The admin page uses the existing academic-notebook UI system and shared components. Search happens client-side across title, subject, grade level, teacher name, and teacher email. Teacher-side `/history` and `/preview/:id` flows remain unchanged.

## Acceptance criteria

- [ ] `GET /api/admin/lesson-plans` returns lesson plans in descending `createdAt` order for authenticated admins.
- [ ] Each response item includes `id`, `title`, `subject`, `gradeLevel`, `totalDuration`, `createdAt`, `updatedAt`, and `createdBy`.
- [ ] `createdBy` is derived from the lesson plan owner and includes `id`, `name`, and `email`.
- [ ] Unauthenticated requests receive `401`.
- [ ] Non-admin authenticated requests receive `403`.
- [ ] The admin dashboard links to a dedicated `/admin/lesson-plans` page.
- [ ] The admin lesson-plan page shows loading, empty, error, and populated states.
- [ ] Client-side search filters rows by lesson-plan fields and creator identity.

## Constraints

- technical: follow `routes -> controllers -> services -> schemas/models` and the existing `{ data, error: null }` response envelope
- product: `who created` means the teacher account that generated the lesson plan
- delivery: keep v1 read-only and avoid overengineering with pagination or new persistence layers

## Risks and open questions

- risk 1: older lesson plans with incomplete teacher profile names may display the email fallback as the creator name
- risk 2: large lesson-plan volumes may eventually need pagination, but v1 intentionally avoids it

## Related docs

- plan: [2026-07-07-admin-lesson-plan-history.md](../plans/archive/2026-07-07-admin-lesson-plan-history.md)
- task brief: [2026-07-07-admin-lesson-plan-history.md](../ai/tasks/archive/2026-07-07-admin-lesson-plan-history.md)
