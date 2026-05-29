# Spec: Client Admin Web Portal

## Purpose

Create a dedicated React web admin portal under `client-side-admin` that shares the existing backend and provides authenticated login, an admin dashboard, and platform metrics.

## Scope

- in scope: React + TypeScript admin app, shared API integration, protected routes, login flow, dashboard statistics, and shared backend integration
- out of scope: user management CRUD, content moderation workflows, and a separate database or authentication service

## Proposed behavior

The new web admin app runs independently from the mobile client and uses the same Express backend. The app exposes:

- `Login` page that posts credentials to `POST /api/auth/login`
- `Dashboard` page that protects routes with the saved token and shows platform metrics
- `Statistics` summary cards derived from the shared backend and, when available, database-backed counts

The admin app uses a single `VITE_API_BASE_URL` value that points to the shared backend (`http://localhost:4000` by default). The backend exposes `GET /api/admin/stats` to return aggregated metrics for active users, lesson plans, and generation activity.

The admin app stores the bearer token locally for session persistence, redirects unauthenticated users to login, and shows connection or auth failures inline.

## Acceptance criteria

- [x] `client-side-admin` is scaffolded as a React + TypeScript web app.
- [x] The login page authenticates against the shared backend login endpoint.
- [x] The dashboard shows protected admin content after successful login.
- [x] The dashboard displays backend-backed statistics cards.
- [x] The admin app uses the same shared backend server as the main application.
- [x] The backend exposes `/api/admin/stats` to support the admin dashboard.
- [x] Validation passes for the new admin app and backend build.

## Constraints

- technical: preserve the existing backend server as the single API authority
- product: keep the admin dashboard lightweight and focused on operational statistics

## Risks and open questions

- risk: the admin dashboard will only show aggregated metrics until richer admin operations are added
- question: future admin workflows may require richer user management once the backend exposes those APIs

## Related docs

- plan: [2026-05-28-client-admin-web-portal.md](../plans/2026-05-28-client-admin-web-portal.md)
- task brief: [2026-05-28-client-admin-web-portal.md](../ai/tasks/2026-05-28-client-admin-web-portal.md)
