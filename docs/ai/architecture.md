# Architecture Notes

Use this file to describe the current system shape, major module boundaries, and the conventions that matter when changing the codebase.

Keep it current enough that a new agent can understand where things live, what belongs where, and what should not be coupled together without reading the whole repo.

## System overview

- entry points: (describe your application's entry points)
- main modules: (describe your key modules or packages)
- shared libraries or packages: (list shared code)
- external services: (list APIs, databases, or third-party services)

## Boundaries

- (Describe module boundaries and coupling rules)
- Doc templates (`docs/specs/TEMPLATE.md`, `docs/plans/TEMPLATE.md`, `docs/ai/tasks/TEMPLATE.md`) must stay in sync with the scaffold output
- Tool adapter files (`.claude/`, `.github/`, `.agent/`, `CLAUDE.md`, `GEMINI.md`) must stay thin — they point back to `AGENTS.md` and shared docs rather than duplicating guidance

## Data flow and key interfaces

See [`docs/ai/architecture-flows.md`](./architecture-flows.md) for detailed command flows and interface contracts.
