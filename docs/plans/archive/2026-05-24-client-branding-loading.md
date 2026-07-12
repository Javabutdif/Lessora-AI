# Client Branding Loading Implementation Plan

**Goal:** Make the client preview name, native startup, and in-app loading state reflect Lessora AI branding.

**Architecture:** Expo app metadata owns native display name, icon, adaptive icon, web favicon, and splash configuration. React Native screens own runtime loading and onboarding presentation.

**Tech Stack:** Expo React Native, `expo-splash-screen`, NativeWind classes, existing PNG asset.

## References

- spec: [2026-05-24-client-branding-loading.md](../specs/2026-05-24-client-branding-loading.md)
- task brief: [2026-05-24-client-branding-loading.md](../ai/tasks/2026-05-24-client-branding-loading.md)

## Steps

- [x] Inspect the current Expo app config and logo asset.
- [x] Update Expo metadata and native asset references.
- [x] Preserve the existing EAS slug while changing only the visible app name.
- [x] Add a branded reusable loading screen.
- [x] Use the loading screen while auth state is resolving.
- [x] Increase onboarding logo visibility.
- [x] Constrain runtime logo rendering for iPhone 13 preview widths.
- [x] Align TypeScript validation config if the documented check is blocked.
- [x] Update stale legacy route names if validation reaches old screens.
- [x] Run validation.

## Validation

- [x] Run `npx tsc --noEmit` in `client-side`.
- [x] Run `./scripts/check.ps1`.

## Risks

- The existing square wordmark image may work for splash and loading but can appear small as a launcher icon.
