# Client Admin Web Portal Implementation Plan

**Goal:** Build a React web admin portal under `client-side-admin`, connect it to the shared backend, and add admin statistics support.

**Architecture:** A standalone Vite React TypeScript app in `client-side-admin` uses the shared Express API. The backend exposes a protected stats endpoint that aggregates user and lesson generation data.

**Tech Stack:** React, TypeScript, Vite, React Router, shared Express backend.

---

## References

- spec: [2026-05-28-client-admin-web-portal.md](../specs/2026-05-28-client-admin-web-portal.md)
- task brief: [2026-05-28-client-admin-web-portal.md](../ai/tasks/2026-05-28-client-admin-web-portal.md)

## Steps

- [ ] Scaffold the `client-side-admin` React TypeScript app with shared API configuration.
- [ ] Add protected login and dashboard routes with token-based session handling.
- [ ] Build statistics cards backed by the shared API.
- [ ] Add `GET /api/admin/stats` to the backend and wire it into Express.
- [ ] Validate the new admin app build and backend build.

## Validation

- [ ] Run `npm run build` in `client-side-admin`.
- [ ] Run `npm run build` in `server-side`.

## Risks

- risk 1: the admin app needs the backend to run on port `4000` for local development.
- risk 2: platform statistics are limited until richer admin endpoints are added.

## Handoff notes

- Keep the backend as the single API authority and use the admin portal only as a consumer.
