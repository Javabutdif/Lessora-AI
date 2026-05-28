# OpenAI Generation Quota Task Brief

## Summary

- task: enable real OpenAI generation and limit each user to five responses
- requested outcome: authenticated generation consumes one credit until the user reaches zero
- primary constraint: preserve JSON document output for editing/export

## Linked artifacts

- spec: `docs/specs/2026-05-28-openai-generation-quota.md`
- plan: `docs/plans/2026-05-28-openai-generation-quota.md`

## Current state

- status: completed
- current owner: Codex
- next action: set `OPENAI_API_KEY` and redeploy/run the backend to test live generation
- blockers: none

## Progress checklist

- [x] Add quota fields to user schema
- [x] Protect AI generation routes
- [x] Add client bearer token support
- [x] Implement OpenAI structured output call
- [x] Validate server and client

## Scope

- in scope: server auth middleware, OpenAI service, user schema quota, client auth header flow
- out of scope: paid quota top-ups, admin quota UI, streaming

## File ownership

- planner: Codex
- implementer: Codex
- reviewer: Codex
- tester: Codex

## Relevant files

- file: `server-side/src/services/openai.service.ts`
- file: `server-side/src/config/openai.config.ts`
- file: `server-side/src/schemas/user.schema.ts`
- file: `server-side/src/routes/ai.routes.ts`
- file: `server-side/src/middleware/auth.middleware.ts`
- file: `client-side/src/services/api.ts`
- file: `client-side/src/context/AuthContext.tsx`

## Acceptance criteria

- criterion 1: OpenAI generation uses the backend API key and structured JSON output
- criterion 2: authenticated users have five response credits
- criterion 3: generation is blocked at zero credits
- criterion 4: successful generation decrements remaining credits
- criterion 5: client sends bearer token for protected AI endpoints

## Validation

- command 1: `npx tsc --noEmit`
- command 2: `./scripts/check.ps1`

## Risks or dependencies

- risk 1: deployed backend needs `OPENAI_API_KEY` set
- dependency 1: MongoDB must be connected for quota tracking

## Handoff notes

- Credits are response credits, not OpenAI token counts.
