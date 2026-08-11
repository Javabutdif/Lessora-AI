# Gemini Project Instructions

Use `AGENTS.md` as the canonical repository playbook.

Before starting work, read `.archiona/workflow.md` and check for an approved plan at `.archiona/plans/<slug>.md` to avoid duplicating effort.

Always use:

- `docs/ai/commands.md` for build, test, and validation commands
- `docs/ai/standards.md` for repository-wide engineering rules

Read these only when relevant:

- `docs/ai/project-context.md`
- `docs/ai/architecture.md`
- `docs/specs/`
- `docs/plans/`
- `docs/ai/tasks/`
- `docs/ai/decisions.md`
- `.archiona/skills/` for project-specific coding conventions

Workflow requirements:

- Read `.archiona/workflow.md` before starting any task
- Create a plan at `.archiona/plans/<slug>.md` and get it approved before writing code
- Run `archiona validate` to verify the plan before implementation
- Append an ADR to `docs/ai/decisions.md` when introducing a new framework, dependency, or design pattern

Keep changes small, avoid overwriting user edits without approval, and report validation results clearly.
