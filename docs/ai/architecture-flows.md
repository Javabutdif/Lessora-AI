# Architecture — Data Flows and Key Interfaces

Read this file only when implementing or debugging a specific workflow. For module boundaries and conventions, see [`docs/ai/architecture.md`](./architecture.md).

## Archiona Workflow

- **Create plan**: `archiona plan --slug <topic> --title "<title>"` → writes plan to `.archiona/plans/<slug>.md`
- **Validate plan**: `archiona validate` → checks plan is complete and approved
- **Read skill**: Before writing code in any area, read the matching skill under `.archiona/skills/`

## Key interfaces

- Plan markdown schema: sections defined in `.archiona/workflow.md` — Evidence, Problem, Files, Dependencies, Test plan, Rollback
- Skills under `.archiona/skills/` are the source of truth for code conventions in each area

## Application-specific flows

See [`docs/ai/lessora-structure-workflow.md`](./lessora-structure-workflow.md) for API development workflows.
