# Admin Landing Info Pages

## Summary

- task: Add public Landing header links and dedicated pages for Privacy Policy, Terms & Conditions, and About Page.
- requested outcome: Basic, non-technical Lessora AI content pages available from the client-side-admin landing page.
- primary constraint: Keep the change simple and scoped to `client-side-admin`.

## Linked artifacts

- spec: none
- plan: none

## Current state

- status: completed
- current owner: Codex
- next action: none
- blockers: none

## Progress checklist

- [x] Review existing admin landing page and routing.
- [x] Add dedicated public info pages.
- [x] Add landing header links.
- [x] Run validation.

## Scope

- in scope: `client-side-admin` public landing navigation and informational pages.
- out of scope: backend changes, legal review, admin dashboard changes, technical implementation details in page copy.

## File ownership

- planner: Codex
- implementer: Codex
- reviewer: Codex
- tester: Codex

## Relevant files

- file: `client-side-admin/src/App.tsx`
- file: `client-side-admin/src/pages/LandingPage.tsx`
- file: `client-side-admin/src/pages/InfoPage.tsx`

## Acceptance criteria

- Privacy Policy, Terms & Conditions, and About Page are reachable from the landing header.
- Each page has its own public route.
- Page copy is basic, user-facing, and avoids technical code details.
- Existing landing page behavior remains intact.

## Validation

- command: `npx tsc --noEmit` from `client-side-admin` passed.

## Risks or dependencies

- risk: Content is not a substitute for formal legal review.
- dependency: Existing `react-router-dom` routing remains available.

## Handoff notes

- Added public routes and simple landing header links without new dependencies.
