<!-- CLI-parsed fields (keys are case-sensitive; must appear as "- key: value" bullets):
  status        required  Values: todo | in progress | completed
  next action   required  Free-text description of the next step
  blockers      optional  Use "none" when clear
  spec          optional  Path like docs/specs/YYYY-MM-DD-slug.md  or "none"
  plan          optional  Path like docs/plans/YYYY-MM-DD-slug.md  or "none" (requires spec when set)

  Wrap file paths in backticks: - spec: `docs/specs/2026-04-04-foo.md`
  Key capitalisation matters: "- Status: todo" (capital S) will NOT be parsed.
-->

# Task Brief: client-side-admin Light Theme Refactor

## Summary

- task: Refactor the visual design of `client-side-admin/` from dark glass-morphism to a light theme derived from the `.agents/skills/frontend-design/` skill
- requested outcome: A coherent light-theme design applied across every page, modal, and UI primitive in the admin web app, while leaving all business logic, auth, routing, services, and TypeScript contracts untouched
- primary constraint: All working technical context must be preserved (no functional or API-contract changes); only the visual layer (CSS, design tokens, type choices, decorative SVG/icon colors) is in scope

## Linked artifacts

- spec: `docs/specs/2026-06-29-client-side-admin-light-theme.md`
- plan: `docs/plans/2026-06-29-client-side-admin-light-theme.md`

## Current state

- status: completed
- current owner: implementer (Hermes)
- next action: Completed — superseded by `2026-06-29-client-side-admin-minimal-redesign.md` which adopts an "academic notebook" minimalist language. See the redesign spec for the final design direction.
- blockers: none

## Progress checklist

- [x] Survey all pages, components, and styles needing visual updates
- [x] Establish palette + type + signature per frontend-design skill
- [x] Replace dark theme tokens with a coherent light-theme token system
- [x] Update global styles (`main.css`) for the light theme
- [x] Update each UI component CSS module (Button, Badge, Card, Input, Modal, Table, Skeleton, Toast, ConfirmationModal, MetricCard, UserManagementModal)
- [x] Update each page CSS module (LandingPage, AdminDashboard, UserManagement)
- [x] Update PortalTheme.module.css and any inline styles referencing dark colors
- [x] Verify build (`npm run build` inside `client-side-admin`) and dev compile (`tsc --noEmit`)
- [x] Update README design-system section to describe the new light theme

## Scope

- in scope:
  - `client-side-admin/src/styles/tokens.css` — replace dark color palette with light equivalents; keep spacing/radius/shadow/transition tokens largely intact
  - `client-side-admin/src/main.css` — body background, scrollbar, focus rings, link colors
  - All `.module.css` files in `client-side-admin/src/components/` and `client-side-admin/src/pages/`
  - `client-side-admin/src/styles/utilities.module.css` — update text color utilities if affected
  - `client-side-admin/src/styles/PortalTheme.module.css` — used for portal-rendered overlays
  - README.md color palette section
- out of scope:
  - All `.tsx` source files (no business-logic edits)
  - `services/api.ts`, `types/components.ts`, `utils/seo.ts`, `App.tsx`, `main.tsx` (functional code)
  - `client-side/` mobile app, `server-side/`, dependency upgrades
  - Adding new components, removing existing components, or changing props/contracts
  - Any dark/light theme toggle (this is a single-mode light theme)

## File ownership

- planner: implementer
- implementer: implementer (Hermes)
- reviewer: implementer (self-review against AGENTS.md and skill)
- tester: implementer (tsc + vite build)

## Relevant files

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

- criterion 1: `npm run build` and `npx tsc --noEmit` succeed with no new TypeScript errors introduced
- criterion 2: Every previously dark-themed element (background, text, card, modal, table row, input, button, badge, toast, skeleton, scrollbar) now renders on a light surface with WCAG-AA-contrast text
- criterion 3: All accent colors (primary, success, warning, error, info) remain chromatically identifiable in the new light context, with darker variants for text and lighter variants for backgrounds
- criterion 4: No `.tsx` source file is modified
- criterion 5: The README color palette section reflects the new light-theme values

## Validation

- command 1: `cd client-side-admin && npx tsc --noEmit`
- command 2: `cd client-side-admin && npm run build`
- command 3: `npm run workflow -- check` (to verify task brief fields)

## Risks or dependencies

- risk 1: Accent color variants chosen for the light theme may produce low-contrast text against the new light backgrounds — mitigated by defining explicit `--color-{name}-text` and `--color-{name}-bg` pairs for every status
- risk 2: Existing components may reference raw hex values (e.g. `#020817`) directly in CSS rather than via tokens — mitigated by grepping for raw dark hex values before finalizing
- risk 3: Glass-morphism effects (`backdrop-filter: blur(...)` over transparent dark backgrounds) lose their visual purpose on light backgrounds — mitigated by replacing with subtle elevation + 1px borders + soft shadows
- dependency 1: Existing dev/build pipeline (Vite + TypeScript) — no new packages required

## Handoff notes

- The brief was authored before any edits; the implementer should keep the design token naming convention (`--color-{role}-{variant}`) so future dark mode or theming can be reintroduced by overriding the `:root` block
- If any component file needs new utility classes rather than new tokens, prefer extending `utilities.module.css` over inline styles
- Visual screenshots are not part of acceptance — the design is validated by the build succeeding and the token system being internally consistent