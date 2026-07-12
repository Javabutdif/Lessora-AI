# Spec: Client Branding Loading

## Purpose

Make the Lessora AI client branding consistent during preview install, native startup, and in-app loading states using the existing logo asset.

## Scope

- in scope: Expo display metadata, app icon/splash references, JavaScript loading UI, onboarding logo sizing
- supporting scope: TypeScript config alignment if needed to run the repository's documented validation
- out of scope: generating a new logo, adding dependencies, changing authentication behavior, changing server behavior

## Proposed behavior

Preview and installed builds should use the app name `Lessora AI` instead of `Lessora AI Client`. The Expo project slug should remain `lessora-ai-client` because the existing EAS project ID is registered to that slug. Expo should use `client-side/src/assets/LessoraLogo.png` for the app icon, adaptive icon foreground, web favicon, and native splash image.

When the JavaScript app is waiting on authentication state, the loading screen should show the existing logo and a spinner on the same soft background used by the rest of the client. The onboarding screen should display the same asset at a size that makes the wordmark legible.

The PNG must be explicitly constrained for narrow mobile preview widths, including iPhone 13 class viewports, because the source asset is 1254px square and can otherwise render at its intrinsic size on web preview.

## Acceptance criteria

- [x] Set Expo app `name` to `Lessora AI`.
- [x] Keep Expo app `slug` as `lessora-ai-client` for EAS project compatibility.
- [x] Configure `icon`, `splash`, Android adaptive icon, and web favicon with `./src/assets/LessoraLogo.png`.
- [x] Replace the auth loading spinner-only view with branded loading UI.
- [x] Increase onboarding logo size while preserving aspect ratio.
- [x] Constrain logo dimensions for iPhone 13 preview widths.

## Constraints

- technical: use the existing `LessoraLogo.png` asset
- delivery: keep changes limited to client branding/loading files

## Risks and open questions

- risk: a wordmark logo is not an ideal production launcher icon because launchers may crop it; a dedicated icon-only asset can improve this later
- question: none

## Related docs

- plan: [2026-05-24-client-branding-loading.md](../plans/2026-05-24-client-branding-loading.md)
- task brief: [2026-05-24-client-branding-loading.md](../ai/tasks/2026-05-24-client-branding-loading.md)
