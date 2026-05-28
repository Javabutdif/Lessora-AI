# Lesson Plan History Implementation Plan

**Goal:** Save generated lesson plans and let users reopen/export recent plans.

**Architecture:** Extend the existing `LessonPlan` schema with the JSON AI document. The OpenAI service persists successful generations. Authenticated AI routes expose history list/detail endpoints. The client API service consumes those endpoints, and dashboard screens use navigation params to load saved documents.

**Tech Stack:** Express, TypeScript, Mongoose, Expo React Native, React Navigation.

---

## References

- spec: [2026-05-28-lesson-plan-history.md](../specs/2026-05-28-lesson-plan-history.md)
- task brief: [2026-05-28-lesson-plan-history.md](../ai/tasks/2026-05-28-lesson-plan-history.md)

## Steps

- [x] Extend `LessonPlan` schema with AI document storage.
- [x] Persist successful OpenAI generations.
- [x] Add authenticated recent/detail endpoints.
- [x] Add client API functions and types.
- [x] Replace static dashboard recent plans with API data.
- [x] Load selected history plan in Generate Plan screen.
- [x] Run validation.

## Validation

- [x] Run `npx tsc --noEmit` in `server-side`.
- [x] Run `npx tsc --noEmit` in `client-side`.
- [x] Run `./scripts/check.ps1`.

## Risks

- risk 1: MongoDB must be connected for history to persist.
- risk 2: saved-plan edits are not persisted until an update endpoint exists.

## Handoff notes

- Recent plan cards should navigate to the existing Generate Plan preview/editor flow.
