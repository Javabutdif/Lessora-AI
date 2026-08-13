# Project Context

## Summary

- **Project Name**: lessora-ai
- **Description**: Lessora AI is an AI-powered educational platform that helps K-12 teachers turn simple inputs (topic, grade level, duration, learning goals) into complete, curriculum-aligned lesson plans in minutes — no account required. Built with Next.js 15 and MongoDB, powered by OpenAI's GPT models.
- **Primary Audience**: K-12 teachers in the Philippines (DepEd curriculum-aligned)
- **Secondary Audience**: Platform administrators

## Key Facts

- **Single Next.js 15 App Router monolith** — Express and Vite are removed; one process serves pages and `/api/*` route handlers.
- **Design system**: "Academic notebook" — paper background, navy accent, Source Serif 4 display, hairline rules, no cards/shadows/gradients.
- **Stack**: Next.js 15 App Router, TypeScript, CSS Modules + design tokens, MongoDB + Mongoose, TanStack React Query, OpenAI GPT-4o-mini.
- **Auth**: Admin JWT stored in HTTP-only cookie (`lessora-admin-token`); teachers use anonymous session tokens (`lessora-session-id` in localStorage) or account login; `/api/auth/me` returns current auth state. bcryptjs for password hashing.
- **AI quota**: Registered users start with 5 credits (`CREDIT_MAX_PER_USER`); anonymous sessions get 3 credits; one generation or refinement consumes one credit; credits refresh daily at 00:00 Asia/Manila via cron.
- **Templates**: lessora-ai (default), deped-semi-detailed, detailed-lesson-plan, daily-lesson-log, matatag.
- **Pre-coding gate**: Archiona (`.archiona/`) — every code change requires an approved plan before implementation.
- **Response envelope**: All API responses follow `{ data: T, error: null }` or `{ error: { code, message } }`.

## Notes for coding agents

- Read `.archiona/workflow.md` before any code change.
- Skills under `.archiona/skills/` override defaults — read the matching skill before writing code in that area.
- Server layer order: Route Handlers → Services → Schemas/Models (all under `src/`).
- Client pages call `src/app/lib/api-client.ts`, which uses relative `/api/*` paths.
- Do not introduce new dependencies without updating `.archiona/plans/<slug>.md` Dependencies section.
- The `docs/ai/subagents/` directory was removed; coordination is now handled by Archiona plans.
