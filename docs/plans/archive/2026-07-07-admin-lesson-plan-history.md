# Admin Lesson Plan History Implementation Plan

**Goal:** Add a focused admin-only page for viewing saved lesson plans with teacher attribution and creation metadata.

**Architecture:** Extend the admin domain with a read-only lesson-plan history endpoint backed by the existing `LessonPlan` and `User` models. Add a dedicated admin route and page in `client-side-admin` that consumes the new endpoint using the current API helper and shared notebook-style components.

**Tech Stack:** Node.js, Express, TypeScript, Mongoose, React, Vite, CSS Modules.

---

## References

- spec: [2026-07-07-admin-lesson-plan-history.md](../../specs/2026-07-07-admin-lesson-plan-history.md)
- task brief: [2026-07-07-admin-lesson-plan-history.md](../../ai/tasks/archive/2026-07-07-admin-lesson-plan-history.md)

## Steps

- [ ] Add workflow artifacts for the feature.
- [ ] Add an admin service function that lists lesson plans with populated teacher ownership.
- [ ] Add admin controller and route wiring for `GET /api/admin/lesson-plans`.
- [ ] Add admin client API types and fetch function.
- [ ] Add `/admin/lesson-plans` route and page in `client-side-admin`.
- [ ] Link the admin dashboard to the new page.
- [ ] Run targeted validation and repo checks.

## Validation

- [ ] Run `npx tsc --noEmit` in `server-side`.
- [ ] Run `npx tsc --noEmit` in `client-side-admin`.
- [ ] Run `./scripts/check.ps1`.

## Risks

- risk 1: missing or partial teacher names must fall back cleanly to email in the admin UI
- risk 2: the table remains unpaginated in v1 and may need follow-up work if data volume grows

## Handoff notes

- Keep the feature isolated to the admin portal and do not change teacher history routes or behavior.
