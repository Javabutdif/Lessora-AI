# Spec: Public Lesson Plan Read Path

## Purpose

Make preview and refine load public lesson plan details directly so non-admin users do not depend on the session-owned history detail endpoint.

## Scope

- in scope:
  - preview lesson plan loading
  - refine lesson plan loading
  - README wording and workflow doc alignment
- out of scope:
  - admin route protection
  - lesson plan generation and refinement logic
  - database schema changes

## Proposed behavior

Preview and refine should use the public lesson plan detail endpoint for loading lesson plan content. The preview page should no longer branch on `?public=true` for the data fetch, and the refine page should stop calling the session-owned history detail endpoint.

The metadata loader for preview already uses the public detail endpoint, so the page fetch and the metadata fetch should now agree. The user-facing documentation should stop describing these read paths as session-owned.

## Acceptance criteria

- [x] Public lesson plans open in `/preview/[id]` without requesting `/api/ai/lesson-plan/history/:id`
- [x] Public lesson plans open in `/refine/[id]` without requesting `/api/ai/lesson-plan/history/:id`
- [x] The README and workflow docs no longer imply that preview/refine detail reads are session-owned

## Constraints

- technical: keep the change limited to page-level data loading and documentation text
- product: only admin routes stay protected; lesson plan reads remain public
- delivery: no backend contract changes are required

## Risks and open questions

- risk: some existing links may still include `?public=true`, but the pages should continue to work regardless
- question: should the legacy history detail endpoint remain documented anywhere for internal use, or should it be removed from user-facing docs entirely?

## Related docs

- plan: [2026-08-13-public-lesson-plan-read-path.md](../../plans/archive/2026-08-13-public-lesson-plan-read-path.md)
- task brief: [2026-08-13-public-lesson-plan-read-path.md](../../ai/tasks/2026-08-13-public-lesson-plan-read-path.md)
