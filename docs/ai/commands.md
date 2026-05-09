# Commands

Use this file as the single place to document the best-known commands for this repository.
Subagent roles will execute these commands instead of guessing.

## Validation checks

- PowerShell: `./scripts/check.ps1`
- Bash: `./scripts/check.sh`

## Application Commands

- **Run / Dev**: `npm run dev`
- **Test / Lint**: `npm test`

## Agentic Workflow Commands

These commands manage your active AI task state.

- `npm run workflow -- scaffold --slug <topic> --artifacts bundle` (Create aligned task, spec, and plan files)
- `npm run workflow -- scaffold --slug <topic> --artifacts task` (Create a task brief only)
- `npm run workflow -- check` (Validate task brief fields and linked workflow files)
- `npm run workflow -- pack` (Create a portable markdown handoff pack)
- `npm run workflow -- status` (Check active task)
- `npm run workflow -- resume` (Resume active task)
- `npm run workflow -- handoff --to claude` (Handoff task)
- `npm run workflow -- finalize` (Complete and archive task)
