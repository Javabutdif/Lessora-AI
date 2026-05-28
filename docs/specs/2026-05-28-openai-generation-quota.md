# Spec: OpenAI Generation Quota

## Purpose

Enable real OpenAI lesson plan generation while limiting each authenticated user to five AI generation responses.

## Scope

- in scope: authenticated AI generation/refinement, user response credits, OpenAI Responses API integration, structured JSON document output
- out of scope: paid top-ups, admin quota reset UI, streaming responses

## Proposed behavior

AI generation endpoints require a valid bearer token. Each user starts with five AI response credits. A successful AI-generated lesson plan consumes one credit. If a user has zero credits, the backend rejects generation before calling OpenAI.

The OpenAI call uses the backend-owned lesson plan specialist prompt and requests JSON output only. The client never sends the system prompt or OpenAI key.

## Acceptance criteria

- [x] AI generation and refinement require authentication.
- [x] Users have five AI response credits by default.
- [x] Successful OpenAI generation decrements the user's remaining credits.
- [x] A user with zero credits receives a readable error and no OpenAI call is made.
- [x] The backend returns JSON document output compatible with the existing editor/export flow.
- [x] Client requests include the bearer token after login/session restore.

## Constraints

- technical: use the existing JWT auth flow and avoid adding the OpenAI SDK dependency
- product: credits count responses, not tokens
- delivery: keep the existing client editor/export behavior intact

## Risks and open questions

- risk: OpenAI API failures should not consume a user credit
- question: future plans may need monthly reset or purchase-based credits

## Related docs

- plan: [2026-05-28-openai-generation-quota.md](../plans/2026-05-28-openai-generation-quota.md)
- task brief: [2026-05-28-openai-generation-quota.md](../ai/tasks/2026-05-28-openai-generation-quota.md)
