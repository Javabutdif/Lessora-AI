# Global Request Loading Task Brief

## Summary

- task: Add button-only loading animation for login and establish global request loading workflow.
- requested outcome: Any request through the client API service can drive global, screen, or button loading UI.
- primary constraint: Follow the existing client API and auth architecture; do not hallucinate new endpoints or response shapes.

## Linked artifacts

- spec: `docs/specs/2026-05-24-global-request-loading.md`
- plan: `docs/plans/2026-05-24-global-request-loading.md`

## Current state

- status: completed
- current owner: Codex
- next action: none
- blockers: none

## Progress checklist

- [x] Inspect existing auth, API, navigation, loading screen, and button patterns.
- [x] Add global request loading state from API service requests.
- [x] Add login loading animation and duplicate submit prevention.
- [x] Update docs and validation notes.
- [x] Run best available validation command.

## Scope

- in scope: `client-side` request loading workflow, login loading UI, supporting workflow docs
- out of scope: server changes, endpoint changes, new dependencies

## File ownership

- planner: Codex
- implementer: Codex
- reviewer: Codex
- tester: Codex

## Relevant files

- `client-side/App.tsx`
- `client-side/src/context/RequestLoadingContext.tsx`
- `client-side/src/services/api.ts`
- `client-side/src/components/ui/Button.tsx`
- `client-side/src/screens/Auth/LoginScreen.tsx`
- `docs/specs/2026-05-24-global-request-loading.md`
- `docs/plans/2026-05-24-global-request-loading.md`
- `docs/ai/tasks/2026-05-24-global-request-loading.md`

## Acceptance criteria

- Login shows button-only loading feedback while waiting for the server login response and auth session persistence.
- Login submit is disabled during pending work.
- API service requests update global request loading state.
- A reusable provider/hook exists for future screen or button loading tied to server requests.
- Existing auth bootstrap full-screen loading remains unchanged.
- TypeScript validation passes.

## Validation

- command 1: `npx tsc --noEmit` from `client-side` passed
- command 2: `./scripts/check.ps1` passed

## Risks or dependencies

- risk 1: Global overlay applies to all tracked server requests and may need a delay threshold in a future UX pass.

## Handoff notes

- Future client server calls should stay in `client-side/src/services/api.ts` so they participate in request loading automatically.
