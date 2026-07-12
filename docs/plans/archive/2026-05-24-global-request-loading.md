# Global Request Loading Implementation Plan

**Goal:** Provide button-only request loading feedback for login and consistent request loading tools for server-backed client workflows later.

**Architecture:** Keep fetch ownership in `client-side/src/services/api.ts`, expose request activity through a lightweight subscription, and consume that activity in a `RequestLoadingProvider`. Screens can use the provider for button or screen loading while a global overlay covers active server waits. Login suppresses the global overlay while mounted so only the submit button animates.

**Tech Stack:** Expo React Native, React Context, existing `ActivityIndicator`, existing `Button`, `npx tsc --noEmit`.

---

## References

- spec: [2026-05-24-global-request-loading.md](../specs/2026-05-24-global-request-loading.md)
- task brief: [2026-05-24-global-request-loading.md](../ai/tasks/2026-05-24-global-request-loading.md)

## Steps

- [x] Inspect existing auth, API service, navigation, loading screen, and button patterns.
- [x] Add request activity tracking to the existing API service helper.
- [x] Add a client request loading context/provider and global overlay.
- [x] Wire the provider into the app tree.
- [x] Update the reusable button to render a spinner when `isLoading` is true.
- [x] Update login to use button-only loading and suppress the global overlay.
- [x] Update task/spec/plan status and run validation.

## Validation

- [x] Run `npx tsc --noEmit` from `client-side`.
- [x] Run `./scripts/check.ps1` if feasible.

## Risks

- risk 1: Existing buttons using `isLoading` may change visually from text-only loading to spinner plus title.
- risk 2: Request tracking only covers calls made through `client-side/src/services/api.ts`; future raw fetch calls would bypass it and should be avoided per architecture.

## Handoff notes

- The request loading provider should be used for future screen-level and button-level loading when a server request is involved.
