# Task Brief

## Summary

- task: implement admin lesson-plan history
- requested outcome: add a dedicated admin page and admin API endpoint that list lesson plans with created date and teacher creator info
- primary constraint: keep the change small, reuse existing patterns, and leave teacher-side history untouched

## Linked artifacts

- spec: `docs/specs/2026-07-07-admin-lesson-plan-history.md`
- plan: `docs/plans/archive/2026-07-07-admin-lesson-plan-history.md`

## Current state

- status: completed
- current owner: codex
- next action: none
- blockers: none

## Progress checklist

- [x] Create aligned workflow artifacts
- [x] Add admin lesson-plan history endpoint
- [x] Add admin lesson-plan history page
- [x] Run validation

## Scope

- in scope: admin-only lesson-plan listing, creator attribution, dashboard navigation link, client-side search
- out of scope: admin lesson-plan editing, deleting, pagination, teacher flow changes

## File ownership

- planner: codex
- implementer: codex
- reviewer: codex
- tester: codex

## Relevant files

- file or directory 1: `server-side/src/services/admin.service.ts`
- file or directory 2: `server-side/src/controllers/admin.controller.ts`
- file or directory 3: `server-side/src/routes/admin.routes.ts`
- file or directory 4: `client-side-admin/src/services/api.ts`
- file or directory 5: `client-side-admin/src/pages/AdminDashboard.tsx`
- file or directory 6: `client-side-admin/src/pages/AdminLessonPlansPage.tsx`
- file or directory 7: `client-side-admin/src/App.tsx`

## Acceptance criteria

- criterion 1: admins can fetch lesson-plan history from `GET /api/admin/lesson-plans`
- criterion 2: the admin page shows title, subject, grade, created date, and created-by teacher
- criterion 3: the admin page supports client-side search and standard loading/error/empty states

## Validation

- command 1: `cd server-side && npx tsc --noEmit`
- command 2: `cd client-side-admin && npx tsc --noEmit`
- command 3: `./scripts/check.ps1`

## Risks or dependencies

- risk 1: creator names may be incomplete and need the email fallback
- dependency 1: existing lesson plans must have valid `userId` values pointing to teacher accounts

## Handoff notes

- notes for the next agent: keep the implementation notebook-style and avoid introducing a separate lesson-plan admin detail flow
