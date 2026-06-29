# Spec: client-side-admin Light Theme Refactor

## Purpose

Replace the dark glass-morphism visual treatment of the admin web client with a coherent light theme derived from the design discipline in `.agents/skills/frontend-design/`, without altering any working technical context (auth, routing, API contracts, business logic, TypeScript types).

## Scope

- in scope:
  - All CSS, CSS modules, and design tokens in `client-side-admin/`
  - The color palette, typography, elevation, and motion sections of `client-side-admin/README.md`
  - `PortalTheme.module.css` and `utilities.module.css`
- out of scope:
  - Source `.tsx` files (no logic, prop, hook, or import changes)
  - `services/api.ts`, `types/components.ts`, `utils/seo.ts`
  - The mobile `client-side/` app or the `server-side/` backend
  - Dependency changes in `client-side-admin/package.json`
  - Adding a theme toggle / dark mode switch

## Proposed behavior

The admin client renders every screen on a light surface (`#FFFFFF` cards on a `#F7F8FB` page background) with deliberate ink (`#0B1220` for primary text, `#475569` for secondary text, `#64748B` for tertiary text). The single accent hue is **indigo** (`#4F46E5` → `#3730A3` pressed → `#EEF2FF` tinted background), chosen specifically because the subject is an education product where indigo reads as considered and trustworthy without the saturation fatigue of pure blue. Status colors (success/warning/error/info) keep their semantic hue family but at deeper, light-mode-appropriate values with explicit text-on-tint pairings.

Typography: the body face is `Inter` (loaded via `@fontsource` if missing, otherwise system stack), the display face is `Inter Tight` for page hero numbers and section titles, and the data/utility face is `JetBrains Mono` for tokens, codes, and small data. The signature element is a single, restrained **"elevation card"** treatment — cards use a 1px border `#E5E7EB`, a 0 1px 2px shadow, and a soft 24px radius. No glass-morphism, no glow shadows.

Layout signatures: the dashboard metric cards use a thin 3px top accent stripe (rather than full background tint) so the grid reads as data, not decoration. The landing page hero pairs an oversized display-weight headline with a small "what it does" eyebrow above it and a single CTA — no slider, no carousel.

## Acceptance criteria

- [ ] `tokens.css` defines a complete light-theme color system (page, surface, surface-raised, ink-primary/secondary/tertiary, border, accent, accent-pressed, accent-tint, plus per-status text/bg/border pairs)
- [ ] Every previously dark CSS module (UI components, page-level styles, MetricCard, UserManagementModal, PortalTheme, utilities) compiles against the new tokens without leaving behind dark hex literals (`#020817`, `#040b18`, `#01060f`, etc.)
- [ ] `main.css` body, scrollbar, focus rings, and link colors are updated for the light theme
- [ ] `npm run build` and `npx tsc --noEmit` succeed with no new errors
- [ ] README design-system section reflects the new palette and the new typography pairing
- [ ] No `.tsx` file is changed

## Constraints

- technical: preserve all existing component props, hooks, and React imports; only `.css` and `README.md` files are touched
- product: keep the existing navigation and information architecture — this is a visual refresh only
- delivery: ship in one change set; task brief + spec + plan exist in the repo

## Risks and open questions

- risk 1: Some component styles may have been written with hard-coded dark hex values (e.g. `rgba(96, 165, 250, 0.22)` borders) — replace with the new token equivalents rather than leaving the literal
- risk 2: The previous design leaned on `backdrop-filter` blur for glass cards — on a light background this looks dirty; the new design replaces it with crisp 1px borders and a tiny shadow
- question 1: Should the Accent indigo be replaced by an education-specific hue (e.g. teal or warm yellow)? — resolved by sticking with indigo per the skill's "earn your risk" rule; the signature is restraint, not novelty

## Related docs

- plan: [2026-06-29-client-side-admin-light-theme.md](../plans/2026-06-29-client-side-admin-light-theme.md)
- task brief: [2026-06-29-client-side-admin-light-theme.md](../ai/tasks/2026-06-29-client-side-admin-light-theme.md)
- skill: [frontend-design SKILL.md](../../.agents/skills/frontend-design/SKILL.md)