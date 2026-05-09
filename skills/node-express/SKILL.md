---
name: @tank/node-express
description: Production-grade Node.js/Express patterns for API servers. Triggers: node, node.js, express, express.js, api server, rest api, backend, middleware, route handler, router, endpoint, request validation, zod, jwt, session auth, oauth, rate limiting, error handling, logging, graceful shutdown, prisma, drizzle, postgres, mysql, mongodb, http server, health check.
license: MIT
---

# @tank/node-express

Purpose: deliver actionable patterns for production Express APIs with predictable middleware, validation, auth, and operations.

Core Philosophy

- Fail loud, fail fast: reject invalid input at the edge, do not guess.
- Middleware is the architecture: cross-cutting behavior lives in ordered middleware, not in handlers.
- Types at the boundary: validate external data with schemas, then trust internal types.
- Observable by default: logs, request IDs, and errors are first-class outputs.
- Production-friendly defaults: graceful shutdown and safe timeouts are non-optional.

Project Structure

- `src/app.ts`
- `src/server.ts`
- `src/routes/index.ts`
- `src/routes/users.routes.ts`
- `src/middleware/auth.ts`
- `src/middleware/error.ts`
- `src/middleware/rateLimit.ts`
- `src/middleware/requestId.ts`
- `src/middleware/validate.ts`
- `src/controllers/users.controller.ts`
- `src/services/users.service.ts`
- `src/db/client.ts`
- `src/schemas/users.schema.ts`
- `src/config/env.ts`
- `src/logging/logger.ts`
- `src/health/health.routes.ts`
- `test/api/users.test.ts`

Operating Workflow

- Boot `app.ts` with middleware order, then mount routes.
- Keep handlers thin: parse, call service, return response.
- Push domain logic into services/ with explicit inputs/outputs.
- Centralize errors in `middleware/error.ts`.
- Export `server.ts` to control listening and shutdown.

Quick Decision Trees

- Middleware vs Route Handler
  - Cross-cutting across routes: middleware (request IDs, auth)
  - Per-resource behavior: handler (create user)
  - Transform input/output: middleware (validation, response envelopes)
  - Business logic: handler/service (billing, scheduling)

Error Handling Strategy

- Expected client errors: throw typed error + map in error middleware.
- Async handler failures: async wrapper + error middleware.
- Downstream dependency failures: translate to 503/504 with retry metadata.
- Unknown exceptions: log with request ID, return 500.

Authentication Method Selection

- Stateless API, mobile clients: JWT.
- Server-rendered web app: session cookie.
- Third-party login: OAuth exchange for session/JWT.

Capability Map

- Middleware ordering, error boundaries, and async wrappers.
- Request validation with Zod at the edge.
- Auth strategies: JWT, session, OAuth handoff.
- API design: routes, envelopes, pagination, DTOs.
- Production ops: shutdown, logging, health checks, Docker.

Input Expectations

- Provide existing routes or controllers if they must be preserved.
- State persistence layer (Prisma, Drizzle, raw SQL) and DB type.
- Identify auth mode and token/session storage.
- Share operational constraints (K8s, PM2, Docker).

Output Format

- Provide middleware order and placement guidance.
- Provide code snippets in TypeScript by default.
- Return explicit error and response formats.
- Note tradeoffs and safe defaults.

Activation Triggers

- node, node.js, express, express.js, api server, rest api, backend, middleware, route handler, router, endpoint, request validation, zod, jwt, session auth, oauth, rate limiting, error handling, graceful shutdown, structured logging

Non-Goals

- Do not design UI or front-end components.
- Do not prescribe ORM choice unless asked.
- Do not embed secrets or credentials.
- Do not skip validation in favor of speed.

Common Tasks

- Add request validation middleware with Zod schemas.
- Build error mapping for typed errors and unknowns.
- Add JWT verification and role gating.
- Add rate limiting and request ID logging.
- Set up graceful shutdown with connection draining.
- Define response envelope and pagination.

Operational Standards

- Enforce request validation with Zod at every entry route.
- Standardize error envelope and problem details.
- Add correlation IDs, log latency, and response status.
- Use graceful shutdown with connection draining.
- Prefer cursor pagination for large collections.

Anti-Patterns

- Don't put auth logic inside handlers; use centralized auth middleware.
- Don't swallow errors with empty catch; throw typed errors, map centrally.
- Don't accept unknown request bodies; validate with Zod and strip unknowns.
- Don't build responses ad hoc; use `{ data, error, meta }` envelope.
- Don't use global mutable singletons; inject dependencies per app instance.
- Don't skip shutdown handlers; implement SIGTERM/SIGINT with drain.
- Don't log plain strings; use structured JSON with requestId.
