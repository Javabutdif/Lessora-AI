---
paths:
  - "scripts/**/*"
  - "**/*.ps1"
  - "**/*.sh"
---

# Script Rules

- Keep scripts idempotent when possible.
- Prefer readable command sequences over dense shell tricks.
- Provide both a `.ps1` (PowerShell) and a `.sh` (Bash) version for scripts users run directly.
- When adding a project-specific command, update `docs/ai/commands.md` in the same change.
