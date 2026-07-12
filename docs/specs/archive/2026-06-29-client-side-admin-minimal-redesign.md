# Spec: client-side-admin Minimalist Redesign

## Purpose

Replace the current decorative light-theme treatment (indigo accents, gradient CTAs, pill-shaped chips, white cards with shadows) with a deliberate "academic notebook" minimalist design across `client-side-admin/`, anchored on the motto "Less Planning, More Teaching." All working technical context is preserved.

## Scope

- in scope:
  - Every CSS file in `client-side-admin/`
  - `client-side-admin/index.html` (add Source Serif 4 font link only)
  - `client-side-admin/README.md` design-system section
- out of scope:
  - Any `.tsx` file
  - `services/`, `types/`, `utils/`, `App.tsx`, `main.tsx`, route guards
  - `client-side/` mobile, `server-side/`, package.json changes
  - A dark mode toggle

## Proposed behavior

The admin client adopts an "academic notebook" visual language — the metaphor of a teacher's ruled paper, fountain pen, and chapter heading. Every visual decision serves the motto "less, then more." There is one accent color (deep navy), one display typeface (Source Serif 4), and one structural device (the hairline rule). Buttons are flat and rectangular. Inputs are underline-only by default. Chips are rectangular tags, not pills. Cards become sections separated by horizontal rules. Shadows are removed everywhere except modals (which keep a single 1px border).

### Palette (4–6 named hex values)

- `--color-page`: `#FAFAF7` — warm off-white, paper
- `--color-surface`: `#FFFFFF` — input fields, modals, raised surfaces
- `--color-ink-primary`: `#111111` — body text, headings, primary button bg
- `--color-ink-secondary`: `#4B5563` — secondary text, metadata
- `--color-ink-tertiary`: `#6B7280` — captions, placeholders
- `--color-accent`: `#1E3A8A` — deep navy, primary CTA, links, focus
- `--color-accent-hover`: `#1E40AF`
- `--color-accent-pressed`: `#172554`
- `--color-rule`: `#E7E5DF` — section dividers, table row borders, hairlines
- Status (used only at WCAG-AA contrast on paper): success `#15803D`, warning `#B45309`, error `#B91C1C`

### Type pairing

- Display: `'Source Serif 4', 'Iowan Old Style', 'Apple Garamond', Georgia, serif` — page H1, plan titles, dashboard metric numbers
- Body: `'Inter', system-ui, sans-serif` — paragraphs, table cells, labels, buttons
- Mono: `'JetBrains Mono', monospace` — tokens, IDs, eyebrow labels (used sparingly)

### Layout signature

- 680px reading column for documents (preview, info pages)
- 1200px max for dashboards
- Asymmetric: titles left-aligned, never centered
- Vertical rhythm: 24/48/96px (no 8/16/24 scale)
- Hairline rules under section headers instead of cards around content

### Signature element

A **3px solid `#111111` top rule** at the top of every "page" of the app, like the cover of a notebook. Replaces the card metaphor. Sections below it are separated by 1px `--color-rule` hairlines.

### Component changes

| Component | Old | New |
| --- | --- | --- |
| Button | Indigo gradient, pill, shadow on hover | Flat navy filled (primary) or navy outline (secondary); 6px corners; hover = color shift only |
| Badge / Tag | Pill, tinted background | Rectangular, hairline border, 11px small-caps, no background fill |
| Card | Boxed white with shadow + border-radius 22px | Section with top hairline rule; content flows as before |
| Input | Boxed white input with focus shadow | Underline-only by default (no border, only `border-bottom: 1px solid ink`); boxed variant for multi-field forms |
| Modal | Boxed with backdrop blur and shadow | Boxed with 1px border, no backdrop blur, no shadow |
| Table | Hover row tinted | Hairline between rows only; no hover fill |
| MetricCard | Top accent stripe + boxed | Huge serif number above tiny small-caps label, hairline rule above |
| Toast | Shadowed card | Flat white surface with left edge color stripe |

### Page changes

- **Landing** — Hero is asymmetric. Source Serif title left-aligned. One navy filled primary CTA. Motto "Less Planning, More Teaching" appears once as a chapter epigraph above the title.
- **Login** (admin) — Loses dark glass identity. Now matches user auth pages: serif title, underline inputs, single navy button.
- **UserLogin / UserRegister / ForgotPassword / ResetPassword / ResetPasswordSuccess** — All share one minimalist auth shell. Registration form uses the boxed input variant (5 fields).
- **Info (Privacy/Terms/About)** — 680px reading column. Inter 16/28 body. Source Serif H2. Hairline above H2.
- **History / Preview / GeneratePlan** — Asymmetric page header (serif title + small-caps meta). Plan list separated by hairlines, not card grid. Search input is underline.
- **AdminDashboard** — Ledger-style. Metric numbers in 64px Source Serif. No card wrappers. Tables for activity / recent plans.
- **UserManagement** — Table-only. No card chrome. Hairlines between rows.

## Acceptance criteria

- [ ] `tokens.css` exposes the new paper/navy/serif palette, the new `--color-rule`, and `--font-family-display` pointing at Source Serif 4
- [ ] Every previously indigo-styled element (button, link, focus ring) now resolves to navy `#1E3A8A`
- [ ] Every primary CTA is the same flat filled-navy button with 6px corners
- [ ] Every chip / tag is rectangular, hairline-bordered, all-caps
- [ ] No `linear-gradient(...)` remains in any CSS module
- [ ] No `backdrop-filter` remains in any CSS module
- [ ] No `--color-bg-card` or white-card-with-shadow pattern is used outside modals
- [ ] `npx tsc --noEmit` and `npm run build` succeed
- [ ] No `.tsx` file is changed
- [ ] README design-system section reflects the new palette and Source Serif 4 pairing

## Constraints

- technical: preserve every component's prop signature and behavior; only `.css`, `tokens.css`, `main.css`, `index.html`, and `README.md` are touched
- product: keep the existing navigation and information architecture
- delivery: ship in one change set; task brief + spec + plan exist in the repo

## Risks and open questions

- risk 1: Source Serif 4 requires a network request on first load; system serif fallback handles offline
- risk 2: LoginPage no longer visually distinguishes admin from user login — both share the same shell; if stakeholders require the visual distinction, future enhancement could swap the admin's accent to a darker navy
- question 1: resolved — user approved minimalist direction with no admin-vs-user login distinction

## Related docs

- plan: [2026-06-29-client-side-admin-minimal-redesign.md](../plans/2026-06-29-client-side-admin-minimal-redesign.md)
- task brief: [2026-06-29-client-side-admin-minimal-redesign.md](../ai/tasks/2026-06-29-client-side-admin-minimal-redesign.md)
- skill: [.agents/skills/frontend-design/SKILL.md](../../.agents/skills/frontend-design/SKILL.md)
- previous work: [2026-06-29-client-side-admin-light-theme.md](../specs/2026-06-29-client-side-admin-light-theme.md)