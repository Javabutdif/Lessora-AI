# Architecture Notes

## System overview

- **Entry points**:
  - Server: `server-side/src/server.ts` → Express app on port 4000
  - Web client: `client-side-admin/src/main.tsx` → Vite dev server on port 5174
- **Main modules**:
  - `server-side/` — Express API with routes, controllers, services, Mongoose schemas
  - `client-side-admin/` — React SPA with pages for teachers, admins, and public content
- **Shared contracts**: API response envelope `{ data, error }`; Zod schemas on server; TypeScript types shared via service functions.
- **External services**:
  - OpenAI API (`gpt-4o-mini`) — lesson plan generation and refinement
  - Resend — password reset emails
  - PayMongo — support donation checkout
  - MongoDB — user accounts, lesson plans, activity logs, daily metrics

## Boundaries

- API-oriented changes must follow [`docs/ai/lessora-structure-workflow.md`](./lessora-structure-workflow.md).
- Server routes mount from `server-side/src/app.ts` under `/api/<domain>`.
- Web pages live in `client-side-admin/src/pages/`; routing in `client-side-admin/src/App.tsx`.
- No direct database access from the web client — all data goes through server API.
- AI prompts live in `server-side/src/config/openai.config.ts` and `server-side/src/services/template-prompts.ts`.
- Tool adapter files (`.claude/`, `.github/`) must stay thin — they point to `AGENTS.md` and shared docs.
- Archiona plans under `.archiona/plans/` are the source of truth for pre-coding gate.

## Data flow and key interfaces

See [`docs/ai/architecture-flows.md`](./architecture-flows.md) for detailed workflows and interface contracts.

### Core API routes

| Route | Auth | Purpose |
|-------|------|---------|
| `POST /api/auth/login` | — | Teacher login |
| `POST /api/auth/register` | — | Teacher registration |
| `POST /api/auth/forgot-password` | — | Password reset request |
| `POST /api/auth/reset-password` | — | Password reset submit |
| `GET /api/ai/lesson-plan/config` | — | AI template configuration |
| `POST /api/ai/lesson-plan/generate` | Required | Generate lesson plan |
| `POST /api/ai/lesson-plan/refine` | Required | Refine existing plan |
| `GET /api/ai/lesson-plan/history` | Required | List user's plans |
| `GET /api/ai/lesson-plan/history/:id` | Required | Get plan detail |
| `GET /api/user/analytics` | Required | User usage stats |
| `PUT /api/user/profile` | Required | Update profile |
| `PUT /api/user/settings` | Required | Update settings |
| `GET /api/admin/users` | Admin | List all users |
| `PATCH /api/admin/users/:id` | Admin | Update user |
| `DELETE /api/admin/users/:id` | Admin | Soft-delete user |
| `GET /api/admin/metrics/*` | Admin | Dashboard metrics |
| `POST /api/support/donations/checkout` | — | Create donation checkout |
| `GET /api/support/donations/:ref` | — | Check donation status |
