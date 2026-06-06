# AGENTS.md

This file is the primary instruction set for coding agents working in this repository.

## Start Here

Before making any changes, read:

1. `README.md` (source of truth for project context)
2. `docs/ai/standards.md` (if it exists)
3. Any files explicitly mentioned in the current task

Do not scan the entire repository unless necessary.

## Working Principles

- Keep solutions simple.
- Do not overengineer.
- Make the smallest change that solves the problem.
- Prefer existing patterns over introducing new abstractions.
- Avoid adding frameworks, dependencies, or architecture layers unless clearly justified.
- Ask for clarification when requirements are unclear.
- Do not invent requirements.

## Implementation Workflow

1. Read `README.md`.
2. Understand the requested task.
3. Inspect only the relevant files.
4. Implement the simplest working solution.
5. Run validation or tests if available.
6. Summarize what changed.

## Documentation

Update documentation only when:

- behavior changes
- setup steps change
- architecture changes
- API contracts change

Do not create extra documentation unless it provides clear value.

## Rules

- Do not overwrite user changes without approval.
- Preserve existing code style.
- Keep code readable.
- Prefer explicit code over clever code.
- Add tests when modifying behavior that can reasonably be tested.
- Call out assumptions and risks.

## Architecture Guidance

When choosing between options:

- Choose the simpler solution.
- Choose fewer files over more files.
- Choose fewer abstractions over more abstractions.
- Introduce complexity only when there is a demonstrated need.

## Tool Adapters

If tool-specific instruction files exist (Claude, Cursor, Copilot, Gemini, Aider, etc.), keep them aligned with this file.

When in doubt, follow:

README.md → AGENTS.md → Tool-specific instructions
