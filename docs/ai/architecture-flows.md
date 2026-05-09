# Architecture — Data Flows and Key Interfaces

Read this file only when implementing or debugging a specific workflow CLI command. For module boundaries and conventions, see [`docs/ai/architecture.md`](./architecture.md).

## Data flows

- **Scaffold flow**: `npm run workflow -- scaffold --slug <topic> --artifacts bundle` → writes dated task brief + spec + plan to `docs/ai/tasks/`, `docs/specs/`, `docs/plans/`
- **Check flow**: `npm run workflow -- check` → reads active task brief, checks required fields and linked file existence, exits 0 or 1
- **Pack flow**: `npm run workflow -- pack` → reads task brief + git status + optional git diff → writes a markdown handoff pack to `docs/ai/handoffs/`
- **Finalize flow**: `npm run workflow -- finalize` → validates task brief → moves task + spec + plan to their respective `archive/` subdirectories, rewrites internal links

## Key interfaces

- Task brief markdown schema: fields parsed from `- key: value` bullet lines under `##` heading sections
- `CORE_PATHS` array — defines exactly what the installer copies; must stay in sync with what the workflow CLI expects to find

## Application-specific flows

(Add your application's key data flows and interfaces here)
