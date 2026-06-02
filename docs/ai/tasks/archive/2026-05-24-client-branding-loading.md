# Client Branding Loading Task Brief

## Summary

- task: Fix the Lessora AI client preview name, logo visibility, and app loading branding.
- requested outcome: Preview builds and app startup should consistently show Lessora AI branding using the existing client asset.
- primary constraint: Use the image already under `client-side/src/assets/`.

## Linked artifacts

- spec: `docs/specs/2026-05-24-client-branding-loading.md`
- plan: `docs/plans/2026-05-24-client-branding-loading.md`

## Current state

- status: completed
- current owner: Codex
- next action: Rebuild the preview app so Expo/EAS applies the new display name and native splash metadata.
- blockers: none

## Progress checklist

- [x] Inspect Expo app config and existing logo asset.
- [x] Configure preview/app display name and native splash assets.
- [x] Use the logo in the app loading screen.
- [x] Improve onboarding logo visibility.
- [x] Keep logo sizing contained in iPhone 13 preview widths.
- [x] Run the best available validation command.

## Scope

- in scope: Expo app config, splash/icon references, app loading UI, onboarding logo sizing
- out of scope: new assets, new dependencies, server changes

## Relevant files

- `client-side/app.json`
- `client-side/App.tsx`
- `client-side/tsconfig.json`
- `client-side/src/navigation/AppNavigator.tsx`
- `client-side/src/screens/OnboardingScreen.tsx`
- `client-side/src/screens/HomeScreen.tsx`
- `client-side/src/screens/LandingScreen.tsx`
- `client-side/src/screens/LoginScreen.tsx`
- `client-side/src/screens/RegisterScreen.tsx`
- `client-side/src/assets/LessoraLogo.png`
- `docs/specs/2026-05-24-client-branding-loading.md`
- `docs/plans/2026-05-24-client-branding-loading.md`

## Acceptance criteria

- The Expo app display name is `Lessora AI`.
- The Expo project slug stays `lessora-ai-client` so it matches the existing EAS project ID.
- The existing logo asset is configured for app icon, adaptive icon, web favicon, and splash screen.
- The JavaScript loading screen uses the existing Lessora logo.
- The onboarding logo is large enough to be visible.
- The logo is explicitly sized for narrow mobile preview widths.

## Validation

- command 1: `npx tsc --noEmit` from `client-side` passed
- command 2: `./scripts/check.ps1` passed

## Risks or dependencies

- risk 1: The single existing logo includes wordmark and whitespace, so native icon cropping may not be ideal without a dedicated icon asset.
