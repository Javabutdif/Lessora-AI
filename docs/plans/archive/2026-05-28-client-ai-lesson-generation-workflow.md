# Client AI Lesson Generation Workflow Implementation Plan

**Goal:** Make the mobile Generate Plan form submit to the backend lesson plan specialist endpoint and document the exact workflow for future agents.

**Architecture:** Client screens call named functions in `client-side/src/services/api.ts`. The backend owns the AI role and validates the request through `server-side/src/schemas/ai.schema.ts`; the client only sends teacher-provided lesson fields.

**Tech Stack:** Expo React Native, TypeScript, existing fetch service helper, Express backend endpoint.

---

## References

- spec: [2026-05-28-client-ai-lesson-generation-workflow.md](../specs/2026-05-28-client-ai-lesson-generation-workflow.md)
- task brief: [2026-05-28-client-ai-lesson-generation-workflow.md](../ai/tasks/2026-05-28-client-ai-lesson-generation-workflow.md)
- related backend spec: [2026-05-28-lesson-plan-ai-specialist.md](../specs/2026-05-28-lesson-plan-ai-specialist.md)

## Steps

- [x] Add typed AI lesson generation payload and response contracts to the client API service.
- [x] Add a `generateLessonPlan` API function that calls `/ai/lesson-plan/generate`.
- [x] Make the generate screen controlled, validate inputs, submit the request, and display the result.
- [x] Document the exact client-to-server workflow in `docs/ai/lessora-structure-workflow.md`.
- [x] Run TypeScript validation and the documented repo check.

## Validation

- [x] Run `npx tsc --noEmit` in `client-side`.
- [x] Run `./scripts/check.ps1` from the repo root.

## Risks

- risk 1: mobile calls to the deployed API will fail until the backend deployment includes `/api/ai/lesson-plan/generate`.
- risk 2: result rendering is intentionally simple and may need a richer editor later.

## Handoff notes

- Do not add the AI role or system prompt to client requests; the backend owns that contract.
