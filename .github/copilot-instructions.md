# GitHub Copilot Instructions

Use `AGENTS.md` as the main project playbook.

Always read:

- `AGENTS.md`

Before starting work, read `.archiona/workflow.md` and check for an approved plan at `.archiona/plans/<slug>.md` to avoid duplicating effort.

Read additional files only when relevant:

- `docs/ai/project-context.md`
- `docs/ai/architecture.md`
- `docs/specs/`
- `docs/plans/`
- `docs/ai/decisions.md`
- `.archiona/skills/` for project-specific coding conventions

When generating code:

- prefer clear and maintainable solutions
- avoid changing unrelated files
- append an ADR to `docs/ai/decisions.md` when introducing a new framework, dependency, or design pattern
- suggest tests when behavior changes
- keep documentation aligned with code changes

Before finalizing implementation, run the repository validation commands:

- `cd server-side && npx tsc --noEmit`
- `cd ../client-side-admin && npx tsc --noEmit`

Use `.github/instructions/` for path-specific guidance. For the full command reference, consult `docs/ai/commands.md`.
