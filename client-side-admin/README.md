# Lessora Admin (Web)

The web half of the Lessora AI platform: a teacher portal for generating lesson plans and an admin portal for managing teachers. This README covers everything inside `client-side-admin/`. The server (`server-side/`) lives in its own directory. The mobile app (`client-side/`) is deprecated.

## Table of Contents

- [What This App Is](#what-this-app-is)
- [Design System — Academic Notebook](#design-system--academic-notebook)
- [Component Library](#component-library)
- [Pages](#pages)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Conventions](#conventions)
- [Accessibility](#accessibility)
- [Testing & Validation](#testing--validation)
- [Architecture Notes](#architecture-notes)
- [Recent Visual Redesign](#recent-visual-redesign)
- [Related Documentation](#related-documentation)

---

## What This App Is

Lessora Admin is a React 18 + TypeScript + Vite single-page app that serves two audiences from one bundle:

- **Teachers** — sign up, sign in, generate lesson plans with the AI, browse their history, view a generated plan, download it.
- **Admins** — sign in to a separate admin account, see platform metrics, manage teacher accounts.

Everything renders the same way visually. The only thing that distinguishes admin vs. user is the route prefix (`/admin/*`) and the auth token check.

### Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 18.3 |
| Language | TypeScript 5.6 |
| Bundler | Vite 5.4 |
| Routing | React Router DOM 6.28 |
| Styling | CSS Modules + CSS custom properties (no CSS-in-JS, no Tailwind) |
| Data fetching | `@tanstack/react-query` for landing-page metrics; native `fetch` for the rest |
| Auth tokens | JWT in `localStorage` (`lessora-admin-token`, `lessora-user-token`) |

### Key Features

- **Two audiences, one design** — admin dashboard, teacher portal, public landing page, info pages, and auth flows all share one minimal visual language.
- **Asymmetric reading layout** — dashboards run up to 1200 px; documents (preview, info) cap at 680 px for legibility.
- **Mobile-first responsive** — works from 375 px (iPhone SE) to 1920 px+.
- **No framework churn** — no Redux, no Tailwind, no styled-components; CSS Modules + tokens are sufficient.

---

## Design System — Academic Notebook

The visual language is **"academic notebook"** — the metaphor of a teacher's ruled paper, fountain pen, and chapter heading. Every decision serves the motto "less planning, more teaching" (which appears once, on the landing page hero, as a chapter epigraph).

### Design language at a glance

| Element | Decision |
| --- | --- |
| Background | Warm paper `#FAFAF7`, never pure white |
| Text | Near-black ink `#111111` for primary, slate `#4B5563` for secondary |
| Accent | A single deep navy `#1E3A8A` — used for primary CTAs, links, focus rings |
| Structural device | Hairline `#E7E5DF` rules between sections; **no cards, no shadows, no gradients** |
| Buttons | Flat, 6 px corners, two-state (filled → fill-on-hover navy → ink on hover) |
| Inputs | Underline-only by default; boxed variant only for multi-field forms |
| Chips / tags | Rectangular, hairline border, 11 px small-caps uppercase (not pills) |
| Signature | 3 px solid `#111111` top rule at the top of every page |
| Status colors | Used only at WCAG-AA contrast for chips, banners, and toasts |

### Color tokens

Defined in [`src/styles/tokens.css`](src/styles/tokens.css).

```
Page & surfaces
  --color-page           #FAFAF7   app background (warm paper)
  --color-surface        #FFFFFF   inputs, modals, raised surfaces

Ink (text)
  --color-ink-primary    #111111   body text, headings, primary button
  --color-ink-secondary  #4B5563   helper text, metadata
  --color-ink-tertiary   #6B7280   captions, placeholders
  --color-ink-disabled   #9CA3AF
  --color-ink-on-accent  #FFFFFF   text on dark backgrounds

Accent (the single loud color)
  --color-accent         #1E3A8A   deep navy — primary CTA, links, focus
  --color-accent-hover   #1E40AF
  --color-accent-pressed #172554

Hairline rule (replaces the card)
  --color-rule           #E7E5DF   section dividers, table row borders
  --color-rule-strong    #111111   3 px top rule on every page

Status (WCAG-AA on paper)
  --color-success-text   #15803D
  --color-warning-text   #B45309
  --color-error-text     #B91C1C
  --color-info-text      #1E40AF
```

### Type pairing

Defined in `tokens.css` (and loaded from Google Fonts in [`index.html`](index.html)).

```
--font-family-display   Source Serif 4  → page titles, plan titles, metric numbers
--font-family-base      Inter           → paragraphs, table cells, labels, buttons
--font-family-mono      JetBrains Mono  → tokens, IDs, eyebrow labels (used sparingly)
```

Source Serif 4 is loaded over the network. The fallback stack (`'Iowan Old Style', 'Apple Garamond', Georgia, serif`) covers offline.

### Spacing rhythm

24 / 48 / 96 px — no 8 / 16 / 24 px scale. The intent is a deliberate "ruled page" rhythm rather than a SaaS-default grid.

```
--spacing-1   4px
--spacing-2   8px
--spacing-3   12px
--spacing-4   16px
--spacing-6   24px   ← base
--spacing-8   32px
--spacing-10  40px
--spacing-12  48px   ← section gap
--spacing-16  64px
--spacing-24  96px   ← hero gap
```

### Border radius

```
--radius-sm   4px    (input boxed variant)
--radius-md   6px    (buttons, modals)
--radius-lg   8px
--radius-full 0      (intentionally absent — there are no pills)
```

### Shadows

Shadows are intentionally absent from the system. The two exceptions are the focus outline (`outline: 2px solid var(--color-accent)`) and modal elevation (modals keep a 1 px border only). Tokens `--shadow-sm/md/lg/xl/2xl` exist for legacy code but resolve to near-zero so no surfaced element ever gets a drop shadow.

### Legacy token aliases

The previous "indigo + card" theme used `--color-primary`, `--color-bg-card`, `--color-gray-50..600`, `--color-border-*`, etc. Those token names still resolve (mapped to the new system) so any code that hasn't been updated keeps working. New code should always use the new names.

---

## Component Library

The UI library has 9 components, all exported from [`src/components/ui`](src/components/ui):

```ts
import {
  Button, Badge, Card, Input, Select,
  Modal, Skeleton, Table, Toast, ConfirmationModal,
} from './components/ui';
```

Components are flat files (`Component.tsx` + `Component.module.css`); `Badge` is visually a "tag" (rectangular, hairline, small-caps) but the file kept its old name so `.tsx` consumers don't need to change.

### 1. Button

Variants: `primary` (filled ink → hover navy), `secondary` (outline ink → hover invert), `ghost` (text-only → hover navy), `danger` (outline error → hover fill). Sizes: `sm`, `md`, `lg`. Includes `loading`, `disabled`, `icon`, `fullWidth`.

```tsx
<Button variant="primary" size="lg" onClick={handleSave}>Save</Button>
<Button variant="danger" loading={isDeleting}>Delete user</Button>
```

File: [`src/components/ui/Button.tsx`](src/components/ui/Button.tsx)

### 2. Badge (visually a "Tag")

Rectangular, hairline-bordered, 11 px small-caps. Variants: `success`, `warning`, `error`, `info`, `neutral`. Sizes: `sm`, `md`. No background fill — color is communicated via the border + text color alone.

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

File: [`src/components/ui/Badge.tsx`](src/components/ui/Badge.tsx)

### 3. Card

A no-fill, no-border, no-radius container. The structural device is the parent page's hairline rule — the card never adds its own chrome. Padding only; that's the whole job.

File: [`src/components/ui/Card.tsx`](src/components/ui/Card.tsx)

### 4. Input / Select

Two visual variants via the `variant` prop:

- `underline` (default) — transparent background, single bottom hairline, 16 px `Inter`. Used for login and single-field forms.
- `boxed` — paper background with 1 px ink border and 4 px radius. Used for the registration form (5 stacked fields) and any other 3+ field form.

Errors render as a 1 px top + 1 px bottom hairline error text below the field.

File: [`src/components/ui/Input.tsx`](src/components/ui/Input.tsx)

### 5. Modal

Boxed, 1 px ink border, no shadow, no backdrop blur. Sizes: `sm`, `md`, `lg`. Header is bottom-ruled; footer is right-aligned actions. Focus trap is preserved.

File: [`src/components/ui/Modal.tsx`](src/components/ui/Modal.tsx)

### 6. Skeleton

Flat shimmer using `--color-surface-sunken` to `--color-rule` to `--color-surface-sunken`. The shimmer is a single horizontal-gradient animation — used only as a functional placeholder, not as decoration.

Variants: `text`, `metric`, `table`, `card`.

File: [`src/components/ui/Skeleton.tsx`](src/components/ui/Skeleton.tsx)

### 7. Table

`auto-fit` columns at desktop; collapses to stacked cards below 1024 px. Hairline bottom borders between rows only — no row-hover fill (the previous tinted-hover would have re-introduced an indigo wash).

File: [`src/components/ui/Table.tsx`](src/components/ui/Table.tsx)

### 8. Toast

Flat surface with a left-edge color stripe (success/error/warning/info). No drop shadow. 300 px min-width, top-right on desktop, top-center on mobile.

File: [`src/components/ui/Toast.tsx`](src/components/ui/Toast.tsx)

### 9. ConfirmationModal

Specializes `Modal` for delete / reset / logout confirms. Centered icon ring, single paragraph message, primary + secondary actions.

File: [`src/components/ui/ConfirmationModal.tsx`](src/components/ui/ConfirmationModal.tsx)

---

## Pages

Routes are defined in [`src/App.tsx`](src/App.tsx).

### Public

| Route | File | Purpose |
| --- | --- | --- |
| `/` | [`LandingPage.tsx`](src/pages/LandingPage.tsx) | Hero, feature grid, Android CTA, metrics |
| `/about`, `/privacy-policy`, `/terms-and-conditions` | [`InfoPage.tsx`](src/pages/InfoPage.tsx) | 680 px reading column, hairline-ruled sections |

### Teacher (auth-gated via `UserProtectedRoute`)

| Route | File |
| --- | --- |
| `/login` (teacher) | [`UserLoginPage.tsx`](src/pages/UserLoginPage.tsx) |
| `/register` | [`UserRegisterPage.tsx`](src/pages/UserRegisterPage.tsx) |
| `/forgot-password` | [`ForgotPasswordPage.tsx`](src/pages/ForgotPasswordPage.tsx) |
| `/reset-password` | [`ResetPasswordPage.tsx`](src/pages/ResetPasswordPage.tsx) |
| `/reset-password-success` | [`ResetPasswordSuccessPage.tsx`](src/pages/ResetPasswordSuccessPage.tsx) |
| `/generate` | [`GeneratePlanPage.tsx`](src/pages/GeneratePlanPage.tsx) |
| `/history` | [`HistoryPage.tsx`](src/pages/HistoryPage.tsx) |
| `/preview/:id` | [`PreviewPage.tsx`](src/pages/PreviewPage.tsx) |

### Admin (auth-gated via `ProtectedRoute`, token in `lessora-admin-token`)

| Route | File |
| --- | --- |
| `/admin/login` | [`LoginPage.tsx`](src/pages/LoginPage.tsx) |
| `/admin/dashboard` | [`AdminDashboard.tsx`](src/pages/AdminDashboard.tsx) |
| `/admin/users` | [`UserManagement.tsx`](src/pages/UserManagement.tsx) |
| `/admin/forgot-password`, `/reset-password`, `…-success` | redirect → teacher equivalents |

### Page patterns

- **Landing** — Asymmetric hero. Source Serif title left-aligned. One navy primary CTA. Motto appears once above the title.
- **Auth pages** — Centered, single-column 440 px card, underline inputs (boxed variant for register), single navy button. Admin and user auth look the same (intentional — no visual distinction).
- **Info pages** — 680 px reading column. Inter 16/28 body. Source Serif H2. Hairline above each H2. Right-aligned nav at top (`/home/ /about/ /privacy/ /terms`).
- **Generate / History / Preview** — Asymmetric page header (serif title + small-caps meta). Hairlines between sections.
- **Admin Dashboard** — Ledger style: metric numbers in 64 px Source Serif above small-caps labels, separated by hairline rules. Tables for activity and recent plans.
- **User Management** — Table-only on desktop, stacked cards on mobile. No card chrome around the table itself.

---

## Getting Started

### Prerequisites

- **Node.js** v18.0.0+
- **npm** v9.0.0+
- **Backend** running on `http://localhost:4000` (see `../server-side/`)

### Install & run

```bash
cd client-side-admin
npm install
npm run dev
```

The dev server starts on `http://localhost:5174` (it auto-increments to 5175/5176 if 5174/5175 are busy). It proxies `/api/*` to the backend on `localhost:4000`.

### Production build

```bash
npm run build      # → dist/
npm run preview    # locally preview dist/
```

Build output is ~285 kB JS gzipped, ~71 kB CSS gzipped. No env vars are required for this app — the backend URL is hardcoded in `src/services/api.ts`.

---

## Project Structure

```
client-side-admin/
├── index.html                          # loads Source Serif 4 + Inter + JetBrains Mono
├── src/
│   ├── components/
│   │   ├── ui/                         # the 9 reusable components
│   │   │   ├── Button.tsx + Button.module.css
│   │   │   ├── Badge.tsx + Badge.module.css
│   │   │   ├── Card.tsx + Card.module.css
│   │   │   ├── Input.tsx + Input.module.css
│   │   │   ├── Modal.tsx + Modal.module.css
│   │   │   ├── Skeleton.tsx + Skeleton.module.css
│   │   │   ├── Table.tsx + Table.module.css
│   │   │   ├── Toast.tsx + Toast.module.css
│   │   │   ├── ConfirmationModal.tsx + .module.css
│   │   │   └── index.ts
│   │   ├── MetricCard.tsx + .module.css       # ledger-style metric card
│   │   ├── UserManagementModal.tsx + .module.css
│   │   ├── ProtectedRoute.tsx                  # admin auth guard
│   │   └── UserProtectedRoute.tsx              # teacher auth guard
│   ├── pages/                                 # one file per route
│   │   ├── LandingPage.tsx + .module.css
│   │   ├── AdminDashboard.tsx + .module.css
│   │   ├── UserManagement.tsx + .module.css
│   │   ├── LoginPage.tsx                       # admin
│   │   ├── UserLoginPage.tsx
│   │   ├── UserRegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── ResetPasswordSuccessPage.tsx
│   │   ├── GeneratePlanPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── PreviewPage.tsx
│   │   └── InfoPage.tsx
│   ├── services/api.ts                  # API client
│   ├── styles/
│   │   ├── tokens.css                   # design tokens (the source of truth)
│   │   ├── PortalTheme.module.css      # shared auth + user-app shells
│   │   └── utilities.module.css         # container / grid / spacing helpers
│   ├── types/components.ts              # component prop types
│   ├── utils/seo.ts                     # setSeoMetadata helper
│   ├── assets/                          # logos + screenshots
│   ├── App.tsx                          # routes
│   ├── main.tsx                         # entry
│   └── main.css                         # global base styles + tokens import
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Where the visual logic lives

- `src/styles/tokens.css` — the only place colors, type, spacing, and shadows are defined. Override `:root` here to re-skin.
- `src/styles/PortalTheme.module.css` — shared shells for auth pages and the user app (`.userAuthPage`, `.userAppPage`, `.adminAuthPage`, `.errorBanner`, `.flatButton`, etc.).
- `src/components/ui/*.module.css` — per-component styles.
- `src/pages/*.module.css` — per-page styles.

---

## Conventions

### Design tokens only

Always use CSS custom properties. Never hardcode hex / px / rem / em:

```css
/* No */
.button { background: #4F46E5; padding: 16px; border-radius: 8px; }

/* Yes */
.button {
  background: var(--color-accent);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}
```

### CSS Modules naming

- Class names are camelCase: `.primaryButton`, `.cardHeader`, `.infoSectionHeading`.
- One `.module.css` per `.tsx` component, same basename.
- Use `:global(...)` when you deliberately need to escape scoping (e.g. styling a `<Link>` rendered by React Router, where there is no CSS Module class).
- Composing: prefer concatenating with template strings (`className={`${styles.button} ${styles.primary}`}`) over `composes:`.

### TypeScript

- One type per public component, suffix `Props`. Example: `ButtonProps`, `InputProps`.
- All types centralized in [`src/types/components.ts`](src/types/components.ts).
- Tailwind is not in `dependencies`. Do not add it.

### Layout rules

- Containers: pick from `.userAppContainer` (1200 px), `.userAppContainerNarrow` (800 px), `.userAppContainerDoc` (980 px), or `.infoMaxWidth` (680 px).
- **No card around a card.** If something needs structural separation, add a `border-bottom: 1px solid var(--color-rule)` to the parent — never wrap content in another box.

### What **not** to do

- Don't add gradients (`linear-gradient` is reserved for the skeleton shimmer only).
- Don't add `backdrop-filter` (no glass-morphism).
- Don't add `box-shadow` (no drop shadows; only the focus outline is allowed).
- Don't bring back `border-radius: 9999px` / `rounded-full` (no pills).
- Don't introduce new hex colors. If the palette doesn't have it, add it to `tokens.css` first, then reference it.

---

## Accessibility

The app targets WCAG 2.1 AA.

| Concern | Implementation |
| --- | --- |
| Color contrast | All ink colors clear 4.5:1 on paper `#FAFAF7`. Status colors clear AA-large at minimum. |
| Keyboard | Tab cycles through interactive elements. ESC closes modals. Enter submits forms. No keyboard traps. |
| Focus indicators | All `:focus-visible` rules render `outline: 2px solid var(--color-accent); outline-offset: 2px;`. Inputs intentionally drop the outline because their underline-thickening already signals focus. |
| Modal focus trap | Modal moves focus to first focusable element on open and returns focus to the trigger on close. |
| Screen readers | Semantic HTML (`<main>`, `<header>`, `<section>`, `<article>`, `<nav>`), `aria-invalid` on errored inputs, `aria-busy` on loading buttons, `role="alert"` on error banners. |
| Touch targets | Buttons and inputs ≥ 44 × 44 px on mobile. |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables shimmer / pulse / slide-in animations. |
| Screen reader testing | NVDA (Windows) and VoiceOver (macOS / iOS). |

---

## Testing & Validation

Every change should pass these before it's considered done:

```bash
cd client-side-admin
npx tsc --noEmit    # typecheck — must be clean
npm run build       # production build — must succeed
```

### Manual checklist

- [ ] `npm run dev` boots on first available port (5174+)
- [ ] `/` renders the landing hero with Source Serif title and 3 px top rule
- [ ] `/about`, `/privacy-policy`, `/terms-and-conditions` share the same right-aligned small-caps nav
- [ ] `/admin/login` and `/login` look identical (no admin distinction)
- [ ] Register form uses boxed inputs; login uses underline inputs
- [ ] Dashboard metric cards show large serif numbers above small-caps labels
- [ ] User Management renders a hairline-bordered table on desktop and stacked cards on mobile (resize < 1024 px)
- [ ] Generate Plan form has horizontal breathing room inside the form column
- [ ] Preview page renders the plan with hairline-ruled sections
- [ ] Browser console: 0 errors, 0 warnings
- [ ] Resize to 375 px, 768 px, 1200 px — no horizontal scroll, no overflow

### Browser support

Latest Chrome, Firefox, Safari, and Edge. Backdrop-blur and other modern CSS is intentionally not used, so the floor is broad.

---

## Architecture Notes

### Why CSS Modules?

- Type-safe class names (autocomplete suggests `styles.primary`).
- Automatic scoping prevents collisions across the 9 components.
- No runtime cost (extracted at build time, unlike styled-components).
- Plays well with the token system in `tokens.css`.

### Why no Tailwind?

The design language is restrained (paper, navy, serif, hairlines). Tailwind would push toward a 12-color utility-class mindset and away from the deliberate one-accent discipline. CSS Modules keeps the surface small.

### Why React Context instead of Redux?

Auth + the current user are the only pieces of cross-cutting state. Anything UI-local (modal open, form draft, loading) lives in component state. React Query handles server state. Adding Redux for these would be more complexity than it's worth.

### API surface

All HTTP goes through [`src/services/api.ts`](src/services/api.ts). The dev server proxies `/api/*` to the backend on `localhost:4000`. Endpoints touched in this app:

| Endpoint | Used by |
| --- | --- |
| `POST /api/auth/login`, `/register` | Login / Register pages |
| `POST /api/auth/forgot-password`, `/reset-password` | Forgot / Reset pages |
| `GET /api/landing/metrics` | Landing page |
| `GET /api/ai/plans/recent` | History page |
| `GET /api/ai/plans/:id` | Preview page |
| `POST /api/ai/generate` | Generate page |
| `GET /api/admin/metrics` | Admin Dashboard |
| `GET /api/admin/users` | Admin Users |
| `PATCH /api/admin/users/:id`, `DELETE /api/admin/users/:id` | User Management mutations |

### Routing model

`BrowserRouter` is fine for the dev preview. When deploying to a static host, configure the host to fall back to `index.html` for unknown paths so the SPA can handle client-side routes.

---

## Recent Visual Redesign

The whole app was redesigned on **2026-06-29** from a dark-glass + indigo-gradient + pill-card aesthetic to the **academic notebook** minimal language above. The redesign touched **every CSS file** in this directory plus `index.html` (one font link) and this README.

### What changed

- **Palette** — paper + ink + single navy accent replaces the indigo palette.
- **Type** — Source Serif 4 takes over display; Inter and JetBrains Mono unchanged in role.
- **Buttons** — flat filled + outline, 6 px corners, no gradient, no pill.
- **Inputs** — underline-only by default; boxed variant for multi-field forms (registration).
- **Chips / tags** — rectangular, hairline border, 11 px small-caps (not pills).
- **Cards** — collapsed; the structural device is now hairline rules between sections.
- **Modals** — 1 px border, no shadow, no backdrop blur.
- **Tables** — hairline-between-rows only; no row-hover fill.
- **Metric cards** — 64 px serif number + 11 px small-caps label + hairline rule above. No card chrome.
- **Toasts** — left-edge color stripe; flat surface.
- **Page layout** — 3 px solid `#111` top rule on every page; 680 px reading column for documents; 1200 px max for dashboards.
- **Backdrop-filter / linear-gradient** — gone from active styles. Loading shimmer is the only survivor (and only as a placeholder, not as decoration).

### What did **not** change

- Component prop signatures (`BadgeProps`, `ButtonProps`, `InputProps`, etc.).
- Routing, auth guards, API surface.
- TypeScript types.
- All `.tsx` files (except a 1-line change to `InfoPage.tsx` to render the brand as a text wordmark instead of an invisible `<img>`, and 8 `.tsx` files for the `gradientButton → flatButton` rename — both cosmetic).

### Token names that stayed stable

`--color-ink-primary`, `--color-accent`, `--color-rule` (new), `--color-surface`, `--color-page`. Re-skin the app later by overriding `:root` in `tokens.css`.

### Artifacts in `docs/`

- Spec: `docs/specs/2026-06-29-client-side-admin-minimal-redesign.md`
- Plan: `docs/plans/2026-06-29-client-side-admin-minimal-redesign.md`
- Task brief: `docs/ai/tasks/2026-06-29-client-side-admin-minimal-redesign.md`
- Earlier (pre-minimal, dark-glass) artifacts are kept under `docs/specs/2026-05-31-admin-dashboard-redesign.md` and `docs/ai/tasks/2026-05-31-admin-dashboard-redesign.md` for historical reference.

---

## Related Documentation

- **Spec** (this redesign): `docs/specs/2026-06-29-client-side-admin-minimal-redesign.md`
- **Plan**: `docs/plans/2026-06-29-client-side-admin-minimal-redesign.md`
- **Task brief**: `docs/ai/tasks/2026-06-29-client-side-admin-minimal-redesign.md`
- **Main README**: `../README.md`
- **Server README**: `../server-side/README.md`

---

## License

Part of the Lessora platform — see `../LICENSE`.

---

**Last Updated**: 2026-06-29
**Version**: 2.0.0 (academic-notebook redesign)
**Status**: Production ready
