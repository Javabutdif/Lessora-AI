# Spec: Lesson Plan AI Specialist

## Purpose

Add a backend-owned AI specialist contract for restructuring teacher lesson plan drafts without using the OpenAI API yet.

## Scope

- in scope: server-side specialist prompt, request validation, deterministic draft restructuring response, and API route wiring
- out of scope: real OpenAI API calls, frontend integration, database-stored prompt management

## Proposed behavior

The backend owns the AI role as a strict lesson plan specialist. Clients may submit a teacher draft and lesson metadata, but they cannot override the specialist identity or safety rules. Until OpenAI calls are enabled, the backend returns a deterministic structured lesson plan response that follows the same response shape the future model integration should preserve.

The canonical output is a text-only JSON lesson plan document. The AI must not generate images, audio, video, slides, charts, files, or other media. Export features should convert the JSON document blocks into Word-compatible documents outside the AI generation behavior.

Requests outside lesson planning are rejected or redirected by the service-level scope guard.

## Acceptance criteria

- [x] The specialist role and strict rules are hardcoded in server configuration.
- [x] The AI service can restructure a teacher draft into a lesson-plan-shaped response without using the API key.
- [x] The AI service returns a JSON document shape suitable for client editing and document export.
- [x] The backend can convert an edited JSON document into a Word-compatible `.doc` payload.
- [x] The specialist config explicitly disables media generation.
- [x] A backend route exposes generate, refine, and config operations for lesson plan AI.
- [x] TypeScript validation passes for the server.

## Constraints

- technical: do not call OpenAI yet, and do not add a new dependency unless required
- product: the AI must not behave as a general assistant
- delivery: keep the change backend-only and small

## Risks and open questions

- risk: deterministic placeholders are not equivalent to future model quality
- question: exact school lesson plan template can be refined later once the frontend workflow is ready

## Related docs

- plan: [2026-05-28-lesson-plan-ai-specialist.md](../plans/2026-05-28-lesson-plan-ai-specialist.md)
- task brief: [2026-05-28-lesson-plan-ai-specialist.md](../ai/tasks/2026-05-28-lesson-plan-ai-specialist.md)
