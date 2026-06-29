<!-- CLI-parsed fields:
  status: todo | in progress | completed
  next action: required
  blockers: optional, "none" when clear
  spec, plan: optional paths
-->

# Task Brief: client-side-admin Minimalist Redesign

## Summary

- task: Replace the current "indigo + indigo gradient + cards + chips" treatment with a deliberately minimalist "academic notebook" design language across all UI in `client-side-admin/`
- requested outcome: A coherent minimal visual identity — warm paper background, near-black ink, deep navy accent, Source Serif 4 display face, hairline rules instead of cards, no gradient buttons, no pill chips, no shadows — while preserving every working technical context
- primary constraint: All working technical context must be preserved (no `.tsx`, `services/`, `types/`, or route changes); only CSS, tokens, and `index.html` font loading are in scope

## Linked artifacts

- spec: `docs/specs/2026-06-29-client-side-admin-minimal-redesign.md`
- plan: `docs/plans/2026-06-29-client-side-admin-minimal-redesign.md`

## Current state

- status: in progress
- current owner: implementer (Hermes)
- next action: Rewrite `tokens.css` with the new paper/navy/serif palette, then propagate through every CSS module
- blockers: none

## Progress checklist

- [x] Establish palette + type + signature per frontend-design skill (warm paper + serif display + hairline rules + no pills)
- [x] Rewrite `tokens.css` (paper `#FAFAF7`, ink `#111111`, accent navy `#1E3A8A`, rule `#E7E5DF`, Source Serif 4 display, no rounded-full, tighter radii)
- [x] Update `index.html` to load Source Serif 4
- [x] Update `main.css` (body bg = paper, scrollbar = hairline)
- [x] Update `utilities.module.css` (radius helpers, shadow helpers)
- [x] Rewrite `PortalTheme.module.css` (auth + user-app shells, flat button system, tag chips, hairline sections)
- [x] Rewrite `Button.module.css` (flat, two-state, no gradient, no pill)
- [x] Rewrite `Badge.module.css` (rename feel to Tag: rectangular, hairline border, small-caps)
- [x] Rewrite `Card.module.css` (collapse to hairline section rule)
- [x] Rewrite `Input.module.css` (underline variant primary, boxed variant for multi-field forms)
- [x] Rewrite `Modal.module.css` (border, no shadow)
- [x] Rewrite `Skeleton.module.css` (flat gray)
- [x] Rewrite `Table.module.css` (hairline between rows, no row hover fill)
- [x] Rewrite `Toast.module.css` (restrained)
- [x] Rewrite `ConfirmationModal.module.css` (restrained)
- [x] Rewrite `MetricCard.module.css` (ledger style: huge serif number + small-caps label + hairline rule above)
- [x] Rewrite `UserManagementModal.module.css` (restrained)
- [x] Rewrite page CSS: `LandingPage`, `AdminDashboard`, `UserManagement`
- [x] Run `npx tsc --noEmit` and `npm run build`
- [x] Run `npm run workflow -- check`
- [x] Update README design-system section

## Scope

- in scope:
  - Every `.css` and `.module.css` file in `client-side-admin/`
  - `client-side-admin/index.html` (add Source Serif 4 Google Fonts link only)
  - `client-side-admin/README.md` design-system section
- out of scope:
  - All `.tsx` source files (no logic, prop, hook, import, or rename changes — including keeping `Badge.tsx` filename even though it now reads as a Tag)
  - `services/api.ts`, `types/components.ts`, `utils/seo.ts`, `App.tsx`, `main.tsx`, route guards
  - `client-side/` mobile, `server-side/`, dependency upgrades in `package.json`
  - Dark mode toggle or theming system

## File ownership

- planner: implementer
- implementer: implementer (Hermes)
- reviewer: implementer (self-review against AGENTS.md and frontend-design skill)
- tester: implementer (tsc + vite build)

## Relevant files

- `client-side-admin/index.html`
- `client-side-admin/src/styles/tokens.css`
- `client-side-admin/src/main.css`
- `client-side-admin/src/styles/utilities.module.css`
- `client-side-admin/src/styles/PortalTheme.module.css`
- `client-side-admin/src/components/ui/Button.module.css`
- `client-side-admin/src/components/ui/Badge.module.css`
- `client-side-admin/src/components/ui/Card.module.css`
- `client-side-admin/src/components/ui/Input.module.css`
- `client-side-admin/src/components/ui/Modal.module.css`
- `client-side-admin/src/components/ui/Skeleton.module.css`
- `client-side-admin/src/components/ui/Table.module.css`
- `client-side-admin/src/components/ui/Toast.module.css`
- `client-side-admin/src/components/ui/ConfirmationModal.module.css`
- `client-side-admin/src/components/MetricCard.module.css`
- `client-side-admin/src/components/UserManagementModal.module.css`
- `client-side-admin/src/pages/LandingPage.module.css`
- `client-side-admin/src/pages/AdminDashboard.module.css`
- `client-side-admin/src/pages/UserManagement.module.css`
- `client-side-admin/README.md`

## Acceptance criteria

- criterion 1: `npm run build` and `npx tsc --noEmit` succeed with no new errors introduced
- criterion 2: `grep -rE "rounded-full|linear-gradient\(135deg, #3B82F6" client-side-admin/src --include="*.css"` returns zero matches
- criterion 3: `grep -rE "backdrop-filter" client-side-admin/src --include="*.css"` returns zero matches
- criterion 4: No dark-mode hex literals (`#020817`, `#040b18`, `#01060f`) remain in any CSS module
- criterion 5: Every primary CTA across the app is the same flat navy button — no gradient, no pill, no shadow
- criterion 6: No `.tsx` file is modified
- criterion 7: README design-system section describes the new "Academic notebook" palette and Source Serif 4 typography pairing

## Validation

- command 1: `cd client-side-admin && npx tsc --noEmit`
- command 2: `cd client-side-admin && npm run build`
- command 3: `npm run workflow -- check`

## Risks or dependencies

- risk 1: Source Serif 4 requires network to load on first visit; if offline, system serif fallback (`'Iowan Old Style', 'Apple Garamond', Georgia, serif`) kicks in — handled by font-family stack
- risk 2: Underline-only inputs may feel unfamiliar on multi-field forms — mitigated by offering a `.userAuthInputBoxed` variant for forms with >2 stacked fields (e.g. registration)
- risk 3: Removing the dark admin identity from LoginPage may surprise stakeholders who relied on the visual distinction — noted as a deliberate trade; user approved
- dependency 1: Google Fonts CDN must be reachable for Source Serif 4 to load; the stack includes robust serif fallbacks so the page still renders correctly offline

## Handoff notes

- Token names are preserved (`--color-accent`, `--color-ink-primary`, `--color-rule` is new) so any future rebrand can override `:root`
- The single accent navy (`--color-accent: #1E3A8A`) is the only color that should ever feel "loud" — restraint everywhere else is the design language
- The motto "Less Planning, More Teaching" appears once, on the Landing hero, as a chapter epigraph — do not reuse it as a decorative motif