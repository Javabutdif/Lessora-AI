# Lesson Plan AI Specialist Implementation Plan

**Goal:** Add backend support for a strict lesson plan specialist role that can structure teacher drafts now and later be swapped to real OpenAI calls.

**Architecture:** Keep the specialist identity in backend configuration, route incoming AI requests through schemas/controllers/services, and return a stable lesson plan response shape. The server will not read or use the OpenAI API key for generation yet.

**Tech Stack:** Express, TypeScript, Zod, existing backend service/config pattern, `npx tsc --noEmit`.

---

## References

- spec: [2026-05-28-lesson-plan-ai-specialist.md](../specs/2026-05-28-lesson-plan-ai-specialist.md)
- task brief: [2026-05-28-lesson-plan-ai-specialist.md](../ai/tasks/2026-05-28-lesson-plan-ai-specialist.md)

## Steps

- [x] Tighten the OpenAI config into a lesson plan specialist contract.
- [x] Add Zod request schemas and Express controller/route wiring.
- [x] Update the AI service to validate scope and return structured deterministic lesson plan output.
- [x] Register the route in the app.
- [x] Run TypeScript validation.

## Validation

- [x] Run `npx tsc --noEmit` in `server-side`.

## Risks

- risk 1: the future real model call must preserve the backend-owned system prompt.
- risk 2: frontend expectations may require small response-shape adjustments later.

## Handoff notes

- OpenAI API integration is intentionally deferred; the API key should remain unused for this task.
