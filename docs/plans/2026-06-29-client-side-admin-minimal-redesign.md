# client-side-admin Minimalist Redesign Implementation Plan

**Goal:** Replace the current indigo + cards + pills visual treatment with an "academic notebook" minimalist language across `client-side-admin/` — paper background, navy ink, Source Serif 4 display, hairline rules, no gradients, no pill chips.

**Architecture:** All visual change is concentrated in CSS modules, `tokens.css`, `main.css`, `index.html` (one font link), and `README.md`. No `.tsx` file is touched. Token names follow the existing convention so future re-theming is possible by overriding `:root`.

**Tech Stack:** React 18 + TypeScript + Vite (unchanged), CSS Modules + CSS Custom Properties (unchanged), Source Serif 4 added via Google Fonts CDN in `index.html`, system serif fallback already covers offline.

---

## References

- spec: [2026-06-29-client-side-admin-minimal-redesign.md](../specs/2026-06-29-client-side-admin-minimal-redesign.md)
- task brief: [2026-06-29-client-side-admin-minimal-redesign.md](../ai/tasks/2026-06-29-client-side-admin-minimal-redesign.md)
- skill: [.agents/skills/frontend-design/SKILL.md](../../.agents/skills/frontend-design/SKILL.md)
- previous: [2026-06-29-client-side-admin-light-theme.md](../specs/2026-06-29-client-side-admin-light-theme.md)

## Design plan (per frontend-design skill — brainstorm then critique)

**Subject pin:** Lessora AI admin + user web app for K-12 teachers. Single job: get from "I need a lesson plan" to "I have a lesson plan" with as little friction as possible.

**Palette (4–6 named hex values):** paper `#FAFAF7`, surface `#FFFFFF`, ink `#111111`, ink-secondary `#4B5563`, accent navy `#1E3A8A`, rule `#E7E5DF`.

**Type pairing:** Source Serif 4 display (titles, metric numbers, plan H1); Inter body; JetBrains Mono data. Serif is the deliberate risk — it fights the SaaS-default sans, leans into the academic metaphor, and earns its place because teachers read serif textbooks, not sans-serif SaaS dashboards.

**Layout concept:** A "notebook page" — top rule at the start of every page, hairline rules between sections, 680px reading column for documents, 1200px for dashboards, asymmetric left-aligned titles, 24/48/96px vertical rhythm.

**Signature element:** 3px solid `#111111` top rule on every page. Earns its place because the motto is "less planning, more teaching" — the rule is a single decisive line that says "this is where your work begins" without ornament. Below it, hairline rules continue the rhythm.

**Critique pass:** Does this match the cream+serif+terracotta default? No — paper is `#FAFAF7` not `#F4F1EA`, accent is navy not terracotta. Does it match the black+acid-green default? No — light surface, no green. Does it match the broadsheet default? No — has radii (6px), no newspaper columns, sans body. Risk taken: serif display face is unusual for a SaaS app; defended because the subject (education) and the motto (academic) both lean into it.

## Steps

- [x] Rewrite `tokens.css`
- [x] Add Source Serif 4 link to `index.html`
- [x] Rewrite `main.css`
- [x] Update `utilities.module.css`
- [x] Rewrite `PortalTheme.module.css`
- [x] Rewrite `Button.module.css`
- [x] Rewrite `Badge.module.css`
- [x] Rewrite `Card.module.css`
- [x] Rewrite `Input.module.css`
- [x] Rewrite `Modal.module.css`
- [x] Rewrite `Skeleton.module.css`
- [x] Rewrite `Table.module.css`
- [x] Rewrite `Toast.module.css`
- [x] Rewrite `ConfirmationModal.module.css`
- [x] Rewrite `MetricCard.module.css`
- [x] Rewrite `UserManagementModal.module.css`
- [x] Rewrite `LandingPage.module.css`
- [x] Rewrite `AdminDashboard.module.css`
- [x] Rewrite `UserManagement.module.css`
- [x] Run `npx tsc --noEmit` and `npm run build`
- [x] Run `npm run workflow -- check`
- [x] Update README design-system section

## Validation

- [x] `cd client-side-admin && npx tsc --noEmit` — clean
- [x] `cd client-side-admin && npm run build` — passes
- [x] `npm run workflow -- check` — passes
- [x] `grep -rE "linear-gradient|backdrop-filter|#020817|#040b18|#01060f" client-side-admin/src --include="*.css"` returns no matches in active styles
- [x] `git diff --stat` shows only `.css`, `tokens.css`, `main.css`, `index.html`, and `README.md` changed

## Risks

- risk 1: Source Serif 4 needs network on first load; mitigated by system serif fallback stack
- risk 2: LoginPage loses its dark admin identity — accepted as part of minimalist direction
- risk 3: Multi-field forms (registration) using underline-only inputs feel unfamiliar — mitigated by `.userAuthInputBoxed` variant for forms with >2 stacked fields

## Handoff notes

- Token names are stable (`--color-accent`, `--color-ink-primary`, `--color-rule` is new) — future rebranding is a `:root` override
- The single accent navy `#1E3A8A` is the only color that should ever feel "loud" — restraint everywhere else is the design language
- The motto "Less Planning, More Teaching" appears exactly once, on the Landing hero, as a chapter epigraph above the title — do not reuse it as a decorative motif elsewhere
- The previous light-theme task brief, spec, and plan remain in the repo as historical context; this redesign supersedes them