# Lesson Plan AI Specialist Task Brief

## Summary

- task: add backend support for a strict lesson plan specialist AI role
- requested outcome: hardcode the specialist role server-side and expose lesson draft restructuring endpoints without using OpenAI yet
- primary constraint: do not use the OpenAI API key for now

## Linked artifacts

- spec: `docs/specs/2026-05-28-lesson-plan-ai-specialist.md`
- plan: `docs/plans/2026-05-28-lesson-plan-ai-specialist.md`

## Current state

- status: completed
- current owner: Codex
- next action: hand off backend endpoint details for frontend integration
- blockers: none

## Progress checklist

- [x] Review existing backend AI scaffold
- [x] Update specialist contract
- [x] Add API route wiring
- [x] Validate TypeScript

## Scope

- in scope: server-side AI config, service behavior, validation schema, controller, route registration
- out of scope: frontend integration, database prompt configuration, real OpenAI API calls

## File ownership

- planner: Codex
- implementer: Codex
- reviewer: Codex
- tester: Codex

## Relevant files

- file: `server-side/src/config/openai.config.ts`
- file: `server-side/src/services/openai.service.ts`
- file: `server-side/src/app.ts`
- file: `server-side/src/routes/ai.routes.ts`
- file: `server-side/src/controllers/ai.controller.ts`
- file: `server-side/src/schemas/ai.schema.ts`

## Acceptance criteria

- criterion 1: AI role is backend-owned and strict to lesson planning
- criterion 2: backend exposes draft generation/refinement/config routes
- criterion 3: generation does not call OpenAI yet
- criterion 4: TypeScript validation passes

## Validation

- command 1: `npx tsc --noEmit`

## Risks or dependencies

- risk 1: deterministic output is a temporary stand-in for future OpenAI quality
- dependency 1: future OpenAI integration should preserve this service contract

## Handoff notes

- Keep `OPENAI_API_KEY` unused until the user explicitly asks to enable real model calls.
