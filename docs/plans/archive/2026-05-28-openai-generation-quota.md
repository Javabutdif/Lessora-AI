# OpenAI Generation Quota Implementation Plan

**Goal:** Use OpenAI for lesson plan generation and enforce five AI responses per user.

**Architecture:** Protect AI generation routes with JWT middleware. Store remaining AI response credits on the user document. The AI service reserves one credit, calls OpenAI with structured JSON output, and refunds the credit if the provider call fails.

**Tech Stack:** Express, TypeScript, Mongoose, JWT, OpenAI Responses API over `fetch`.

---

## References

- spec: [2026-05-28-openai-generation-quota.md](../specs/2026-05-28-openai-generation-quota.md)
- task brief: [2026-05-28-openai-generation-quota.md](../ai/tasks/2026-05-28-openai-generation-quota.md)

## Steps

- [x] Add user AI response credit fields.
- [x] Add JWT auth middleware and protect generation/refinement routes.
- [x] Add bearer-token support to the client API service and auth context.
- [x] Replace deterministic generation with OpenAI Responses API structured output.
- [x] Include remaining credits in generation responses.
- [x] Update workflow docs and run validation.

## Validation

- [x] Run `npx tsc --noEmit` in `server-side`.
- [x] Run `npx tsc --noEmit` in `client-side`.
- [x] Run `./scripts/check.ps1`.

## Risks

- risk 1: existing users without the new quota field need the service to initialize default credits.
- risk 2: local testing requires `OPENAI_API_KEY` in `server-side/.env`.

## Handoff notes

- The quota is response-count based, not token-count based.
