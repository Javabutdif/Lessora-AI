# Lesson Plan History Task Brief

## Summary

- task: save generated lesson plans and display recent plans in the client
- requested outcome: generated plans are stored in MongoDB, visible as recent cards, viewable, editable locally, and exportable
- primary constraint: reuse existing lesson-plan document/export workflow

## Linked artifacts

- spec: `docs/specs/2026-05-28-lesson-plan-history.md`
- plan: `docs/plans/2026-05-28-lesson-plan-history.md`

## Current state

- status: completed
- current owner: Codex
- next action: run the app and verify MongoDB-backed recent plans with a signed-in user
- blockers: none

## Progress checklist

- [x] Extend lesson schema
- [x] Save generated plans
- [x] Add history endpoints
- [x] Add client API functions
- [x] Render recent plans from MongoDB
- [x] Open saved plan in Generate screen
- [x] Validate

## Scope

- in scope: backend lesson history storage/list/detail, dashboard recent plans, view/export saved plan
- out of scope: update saved plan, delete saved plan, search/filter history

## File ownership

- planner: Codex
- implementer: Codex
- reviewer: Codex
- tester: Codex

## Relevant files

- file: `server-side/src/schemas/lesson.schema.ts`
- file: `server-side/src/services/openai.service.ts`
- file: `server-side/src/controllers/ai.controller.ts`
- file: `server-side/src/routes/ai.routes.ts`
- file: `client-side/src/services/api.ts`
- file: `client-side/src/screens/Dashboard/HomeScreen.tsx`
- file: `client-side/src/screens/Dashboard/GeneratePlanScreen.tsx`
- file: `client-side/src/navigation/BottomTabBar.tsx`

## Acceptance criteria

- criterion 1: generated lesson plans are saved to MongoDB
- criterion 2: dashboard recent plans load from backend
- criterion 3: tapping a recent plan opens its saved document
- criterion 4: saved documents use the same preview/edit/export UI
- criterion 5: validation passes

## Validation

- command 1: `npx tsc --noEmit`
- command 2: `./scripts/check.ps1`

## Risks or dependencies

- risk 1: history requires MongoDB connection
- dependency 1: authenticated client requests must include bearer token

## Handoff notes

- Saved-plan edits are local-only until a save/update feature is requested.
