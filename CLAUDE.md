@AGENTS.md

# Claude Code Notes

Always read `AGENTS.md` first — it is the canonical workflow playbook.

Before starting work, read `.archiona/workflow.md` and check for an approved plan at `.archiona/plans/<slug>.md` to avoid duplicating effort.

- Read matching skill under `.archiona/skills/` before writing code in that area. The skill overrides your defaults.
- Append an ADR to `docs/ai/decisions.md` when introducing a new framework, dependency, or design pattern.
- Run validation from `docs/ai/commands.md` before marking work done.
- Prefer adding path-specific guidance in `.claude/rules/` instead of growing this file.
