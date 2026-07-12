# client-side-admin Light Theme Refactor Implementation Plan

**Goal:** Convert the admin web client from its current dark glass-morphism look to a coherent light-theme visual system driven by `.agents/skills/frontend-design/`, without changing any `.tsx` business logic.

**Architecture:** All visual change is concentrated in CSS modules and `tokens.css`. The token system is the single source of truth for color, typography, spacing, and shadow; component CSS modules consume tokens via `var(--token)`; no hex literals remain in component CSS after the refactor. The signature design choice is a restrained "elevation card" with thin borders + soft shadows replacing the dark glass cards.

**Tech Stack:** React 18 + TypeScript + Vite (unchanged), CSS Modules + CSS Custom Properties (unchanged), no new dependencies.

---

## References

- spec: [2026-06-29-client-side-admin-light-theme.md](../specs/2026-06-29-client-side-admin-light-theme.md)
- task brief: [2026-06-29-client-side-admin-light-theme.md](../ai/tasks/2026-06-29-client-side-admin-light-theme.md)
- skill: [.agents/skills/frontend-design/SKILL.md](../../.agents/skills/frontend-design/SKILL.md)

## Design plan (per frontend-design skill — brainstorm then critique)

**Subject pin:** Lessora AI admin console for an AI-powered lesson-plan platform. Audience: school administrators and teacher users managing lesson plans. Single job on the dashboard: see "is everything healthy" at a glance and navigate to user/lesson management.

**Palette (4–6 named hex values):**
- `--color-page`: `#F7F8FB` (warm-neutral page background)
- `--color-surface`: `#FFFFFF` (cards, modals, inputs)
- `--color-surface-raised`: `#FFFFFF` with subtle shadow (elevated cards)
- `--color-ink-primary`: `#0B1220` (body & headings)
- `--color-ink-secondary`: `#475569` (subheads, helper text)
- `--color-ink-tertiary`: `#64748B` (captions, metadata)
- `--color-border`: `#E5E7EB` (default hairline)
- `--color-accent`: `#4F46E5` (indigo — primary actions, links)
- `--color-accent-pressed`: `#3730A3`
- `--color-accent-tint`: `#EEF2FF` (selected row, accent fill)
- `--color-success-text/bg/border`: `#15803D` / `#ECFDF5` / `#A7F3D0`
- `--color-warning-text/bg/border`: `#B45309` / `#FFFBEB` / `#FDE68A`
- `--color-error-text/bg/border`: `#B91C1C` / `#FEF2F2` / `#FECACA`
- `--color-info-text/bg/border`: `#0E7490` / `#ECFEFF` / `#A5F3FC`

**Type pairing:**
- Display: `Inter Tight` 600/700 — used only for page hero numbers (dashboard metric values), section H1/H2
- Body: `Inter` 400/500 — paragraphs, table cells, buttons
- Data/utility: `JetBrains Mono` 500 — tokens, IDs, error codes

**Layout concept:** A "ledger" feel — left-aligned content with thin 1px dividers, generous 24px+ spacing, generous max-width container (1200px desktop), metric cards arranged 3-up on desktop / 1-up on mobile with a thin top accent stripe rather than full-card tint.

**Signature element:** The thin top accent stripe on metric cards (3px high, full-width, color-coded by metric category) — quietly identifies the metric's semantic color without shouting. Earns its place because the dashboard is the first thing an admin sees, and the stripe becomes the visual mnemonic for "what category is this number?"

**Critique pass:** Does this look like the cream+serif+terracotta default? No. Does it look like the black+acid-green default? No. Does it look like a broadsheet? No — radii are present, type is sans, and the color palette is deliberate. The indigo accent is a real choice (not a fallback) because it differentiates the admin from a generic SaaS template while still reading as professional. Risk taken: the absence of glass effects may feel "plain" to reviewers used to dark SaaS — but restraint is the risk, and that risk is justified by the brief asking for a light theme with a distinctive point of view.

## Steps

- [x] Survey all files in `client-side-admin/src/` to enumerate CSS modules needing updates
- [x] Replace `tokens.css` with the light-theme token system
- [x] Update `main.css` (body, scrollbar, focus rings, link colors)
- [x] Update `utilities.module.css` text color helpers if any referenced dark ink
- [x] Update `PortalTheme.module.css` overlay/scroll lock colors
- [x] Update UI primitives: `Button`, `Badge`, `Card`, `Input`, `Modal`, `Skeleton`, `Table`, `Toast`, `ConfirmationModal`
- [x] Update `MetricCard` and `UserManagementModal` CSS
- [x] Update page CSS: `LandingPage`, `AdminDashboard`, `UserManagement`
- [x] Run `npx tsc --noEmit` and `npm run build` to confirm no breakage
- [x] Update README design-system section to describe the new light palette and typography pairing

## Validation

- [x] Run `cd client-side-admin && npx tsc --noEmit` — passes with no new errors
- [x] Run `cd client-side-admin && npm run build` — Vite production build succeeds
- [x] Run `grep -rE "#[0-9a-fA-F]{6}" client-side-admin/src --include="*.css"` to confirm no remaining dark hex literals in CSS modules
- [x] Run `git diff --stat` to confirm only `.css`, `tokens.css`, `main.css`, `README.md` files changed

## Risks

- risk 1: Hex literals might be hidden inside `rgba()` calls (e.g. `rgba(96, 165, 250, 0.22)`) — mitigated by grep specifically for the old dark palette and rgba with old hex bases
- risk 2: Some components may have inline `style={{}}` props referencing dark colors — mitigated by limiting edits to `.css` and `tokens.css`; if any `.tsx` change is needed for an inline color, it is allowed but should be minimal and called out
- risk 3: Build may surface an unused-CSS warning — non-blocking, informational only

## Handoff notes

- anything the next agent needs to know:
  - Token naming convention (`--color-{role}-{variant}`) is preserved so a future dark mode can be reintroduced purely by overriding `:root` and adding `[data-theme="dark"]`
  - The Accent indigo is intentionally restrained (no glow shadows, no large fills); boldness lives in the display-weight metric numbers, not the color
  - Components retain their existing props and behaviors; only the visual layer was retuned