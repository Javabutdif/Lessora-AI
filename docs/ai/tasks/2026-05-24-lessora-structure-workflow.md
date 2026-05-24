# Lessora Structure Workflow Task Brief

## Summary

- task: Document the expected Lessora AI client service and server API structure for future coding agents.
- requested outcome: A workflow Markdown file that reduces hallucinated files, routes, response shapes, and layer responsibilities.
- primary constraint: Documentation must match the current repository structure.

## Linked artifacts

- spec: `docs/specs/2026-05-24-lessora-structure-workflow.md`
- plan: `docs/plans/2026-05-24-lessora-structure-workflow.md`

## Current state

- status: completed
- current owner: Codex
- next action: Keep the workflow updated when API structure changes.
- blockers: none

## Progress checklist

- [x] Inspect current client service and server API files.
- [x] Add Lessora structure workflow document.
- [x] Add matching spec and plan.
- [x] Link workflow from architecture docs.

## Scope

- in scope: documentation for client services and server API layer rules
- out of scope: runtime code changes, new dependencies, new API endpoints

## File ownership

- planner: `docs/specs/2026-05-24-lessora-structure-workflow.md`, `docs/plans/2026-05-24-lessora-structure-workflow.md`
- implementer: `docs/ai/lessora-structure-workflow.md`, `docs/ai/architecture.md`
- reviewer: documentation review
- tester: documentation link review

## Relevant files

- `docs/ai/lessora-structure-workflow.md`
- `docs/ai/architecture.md`
- `docs/specs/2026-05-24-lessora-structure-workflow.md`
- `docs/plans/2026-05-24-lessora-structure-workflow.md`
- `client-side/src/services/api.ts`
- `server-side/src/routes/auth.routes.ts`
- `server-side/src/controllers/auth.controller.ts`
- `server-side/src/services/auth.service.ts`
- `server-side/src/schemas/auth.schema.ts`
- `server-side/src/schemas/user.schema.ts`
- `server-side/src/schemas/lesson.schema.ts`

## Acceptance criteria

- The workflow states where client API services belong.
- The workflow states the server route to controller to service to schema/model layering.
- The workflow documents response envelopes and naming conventions.
- The workflow includes a checklist for agents to verify assumptions before coding.

## Validation

- command 1: Markdown review
- command 2: not run; documentation-only change

## Risks or dependencies

- risk 1: Future changes can drift if this workflow is not updated.
- dependency 1: Existing Lessora AI architecture remains TypeScript, Express, Mongoose, Zod, and Expo React Native.

## Handoff notes

- Future coding agents should read `docs/ai/lessora-structure-workflow.md` before adding API-related features.

