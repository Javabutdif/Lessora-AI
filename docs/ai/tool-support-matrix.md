# Tool Support Matrix

This file explains which repository files are necessary, supported, or optional across agent tools.

## Core files

These are the highest-value files to keep current:

- `AGENTS.md`: primary shared repo playbook
- `.archiona/workflow.md`: pre-coding gate rules — read before any code change
- `.archiona/skills/`: project-specific coding conventions per area
- `docs/ai/commands.md`: the single source of truth for build, test, and validation commands
- `docs/ai/standards.md`: repo-wide engineering rules that should stay stable
- `docs/specs/` and `docs/plans/`: approved specs and implementation plans

## Tool-specific files

### Claude Code

- `CLAUDE.md`: thin adapter pointing to `AGENTS.md`
- `.claude/rules/`: path-specific guidance

### Gemini

- `GEMINI.md`: thin adapter pointing to `AGENTS.md`

### GitHub Copilot

- `.github/copilot-instructions.md`: repo-wide instructions
- `.github/instructions/`: path-specific guidance

## Legacy / removed

- `.agent/`: removed — superseded by `.archiona/`
- `skills/`: removed — superseded by `.archiona/skills/`
- `scripts/`: removed — workflow CLI replaced by archiona
- `.github/prompts/`: removed — prompt templates no longer used
- `docs/ai/subagents/`: removed — coordination handled by archiona plans
