# Project Context

## Summary

- **Project Name**: lessora-ai
- **Description**: Lessora AI is an AI-powered educational platform that helps teachers create organized, professional, and curriculum-ready lesson plans in minutes. It transforms simple teacher inputs into structured lesson plans with activities, objectives, and assessments using OpenAI's GPT models.
- **Primary Audience**: K-12 teachers in the Philippines (DepEd curriculum-aligned)
- **Secondary Audience**: Platform administrators

## Key Facts

- **Web-only platform** — the mobile app (`client-side/`) is deprecated; all features live in `client-side-admin/`.
- **Design system**: "Academic notebook" — paper background, navy accent, Source Serif 4 display, hairline rules, no cards/shadows/gradients.
- **Stack**: React 18 + Vite (web), Node.js + Express + TypeScript (server), MongoDB + Mongoose (database), OpenAI GPT-4o-mini (AI).
- **Auth**: JWT tokens stored in `localStorage`; bcryptjs for password hashing.
- **AI quota**: Each user starts with 5 response credits; one generation or refinement consumes one credit; credits refresh monthly via cron.
- **Templates**: lessora-ai (default), deped-semi-detailed, detailed-lesson-plan, daily-lesson-log, matatag.
- **Pre-coding gate**: Archiona (`.archiona/`) — every code change requires an approved plan before implementation.
- **Response envelope**: All API responses follow `{ data: T, error: null }` or `{ error: { code, message } }`.

## Notes for coding agents

- Read `.archiona/workflow.md` before any code change.
- Skills under `.archiona/skills/` override defaults — read the matching skill before writing code in that area.
- Server layer order: Routes → Controllers → Services → Schemas/Models.
- Web client pages call `client-side-admin/src/services/api.ts`, not raw URLs.
- Do not introduce new dependencies without updating `.archiona/plans/<slug>.md` Dependencies section.
- The `docs/ai/subagents/` directory was removed; coordination is now handled by Archiona plans.
