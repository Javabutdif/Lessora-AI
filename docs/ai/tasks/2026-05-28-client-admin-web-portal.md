# Client Admin Web Portal Task Brief

## Summary

- task: build a React web admin portal that shares the existing backend and surfaces login, dashboard, and statistics
- requested outcome: a dedicated admin client with protected routes and backend-backed stats
- primary constraint: one backend server should serve both the existing client and the new admin portal

## Linked artifacts

- spec: `docs/specs/2026-05-28-client-admin-web-portal.md`
- plan: `docs/plans/2026-05-28-client-admin-web-portal.md`

## Current state

- status: in progress
- current owner: Copilot
- next action: scaffold the admin web app and add backend admin stats aggregation
- blockers: none

## Progress checklist

- [ ] Scaffold the `client-side-admin` React TypeScript app
- [ ] Add login and protected dashboard routes
- [ ] Add backend admin stats endpoint
- [ ] Validate admin app and backend builds

## Scope

- in scope: `client-side-admin/`, `server-side/src/app.ts`, `server-side/src/controllers/admin.controller.ts`, `server-side/src/routes/admin.routes.ts`
- out of scope: advanced admin operations, full user management, and external identity providers

## File ownership

- planner: Copilot
- implementer: Copilot
- reviewer: Copilot
- tester: Copilot

## Relevant files

- file: `client-side-admin/`
- file: `server-side/src/app.ts`
- file: `server-side/src/controllers/admin.controller.ts`
- file: `server-side/src/routes/admin.routes.ts`

## Acceptance criteria

- criterion 1: `client-side-admin` installs successfully and builds with Vite
- criterion 2: login uses shared backend auth endpoint
- criterion 3: dashboard loads statistics from shared backend
- criterion 4: backend exposes `/api/admin/stats`
- criterion 5: validation passes for the admin app and server build

## Validation

- command 1: `npm run build` in `client-side-admin`
- command 2: `npm run build` in `server-side`

## Risks or dependencies

- risk 1: local admin app depends on backend running on `localhost:4000`
- dependency 1: shared backend uses existing MongoDB connection for aggregated metrics

## Handoff notes

- Keep the new admin app separate from the mobile client while sharing the same backend contract.
