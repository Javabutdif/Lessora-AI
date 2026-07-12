# Spec: Global Request Loading

## Purpose

Add consistent loading feedback for authentication and future server-backed client flows without changing the existing API response envelope or auth session architecture.

## Scope

- in scope: client-side request activity tracking, app-level request loading overlay, reusable button loading state, login request loading behavior
- out of scope: server endpoint changes, new dependencies, new API response shapes

## Proposed behavior

The Expo client should expose one app-level source of truth for active server requests. The existing client service helpers in `client-side/src/services/api.ts` remain responsible for fetch calls and response envelope parsing. A request activity subscription lets UI providers observe when any service request is in progress.

The app should wrap navigation with a loading provider that can show a global overlay for active server requests. Screens may also read the same loading state to disable controls or show button-level indicators. Login should show button-only loading while waiting for the server response, prevent duplicate submits, suppress the global request overlay while the login screen is mounted, and continue to show existing success and error toasts.

Auth boot/session restore loading stays in `AuthContext` and continues to use the full-screen `LoadingScreen` through `AppNavigator`.

## Acceptance criteria

- [x] Login shows button-only loading while the login request and session persistence are pending.
- [x] Login cannot submit duplicate requests while pending.
- [x] Server requests made through `client-side/src/services/api.ts` update a global request loading state.
- [x] The app has a reusable provider/hook for screen-level and button-level request loading.
- [x] Existing auth boot loading and API response parsing behavior remain intact.
- [x] TypeScript validation passes from `client-side`.

## Constraints

- technical: reuse existing React Native, Expo, `ActivityIndicator`, and app context patterns; do not add a dependency.
- product: loading feedback should fit the Lessora AI visual style.
- delivery: keep the change limited to client loading workflow and supporting docs.

## Risks and open questions

- risk 1: A global overlay for very short requests can appear briefly; this can be tuned later with a delay if it feels visually noisy.

## Related docs

- plan: [2026-05-24-global-request-loading.md](../plans/2026-05-24-global-request-loading.md)
- task brief: [2026-05-24-global-request-loading.md](../ai/tasks/2026-05-24-global-request-loading.md)
