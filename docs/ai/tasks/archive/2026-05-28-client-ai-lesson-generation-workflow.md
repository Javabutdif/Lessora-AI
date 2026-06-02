# Client AI Lesson Generation Workflow Task Brief

## Summary

- task: connect the client Generate Plan form to the backend lesson plan specialist endpoint
- requested outcome: working client request flow plus workflow documentation to prevent hallucinated integration paths
- primary constraint: client must not own or send the AI role/system prompt

## Linked artifacts

- spec: `docs/specs/2026-05-28-client-ai-lesson-generation-workflow.md`
- plan: `docs/plans/2026-05-28-client-ai-lesson-generation-workflow.md`

## Current state

- status: completed
- current owner: Codex
- next action: deploy the backend before testing against the configured production API base URL
- blockers: none

## Progress checklist

- [x] Inspect client form and API service patterns
- [x] Add client API contract
- [x] Wire generate form submission
- [x] Document exact workflow
- [x] Validate TypeScript and repo checks

## Scope

- in scope: `client-side/src/services/api.ts`, `client-side/src/screens/Dashboard/GeneratePlanScreen.tsx`, workflow docs
- out of scope: OpenAI API enablement, database persistence, dedicated editor screen

## File ownership

- planner: Codex
- implementer: Codex
- reviewer: Codex
- tester: Codex

## Relevant files

- file: `client-side/src/services/api.ts`
- file: `client-side/src/screens/Dashboard/GeneratePlanScreen.tsx`
- file: `server-side/src/routes/ai.routes.ts`
- file: `server-side/src/schemas/ai.schema.ts`
- file: `docs/ai/lessora-structure-workflow.md`

## Acceptance criteria

- criterion 1: client exposes a typed `generateLessonPlan` API function
- criterion 2: Generate Plan screen validates and submits all visible fields
- criterion 3: successful backend responses are shown on screen
- criterion 4: workflow docs name the exact route, schema, service, and client mapping
- criterion 5: validation passes or blockers are documented

## Validation

- command 1: `npx tsc --noEmit`
- command 2: `./scripts/check.ps1`

## Risks or dependencies

- risk 1: deployed API must include the backend endpoint before the mobile app can call it outside local development
- dependency 1: backend route is mounted at `/api/ai/lesson-plan/generate`

## Handoff notes

- Keep the backend as the only owner of the AI specialist role.
