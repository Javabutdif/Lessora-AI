# Commands

Use this file as the single place to document the best-known commands for this repository.

## Validation checks

- TypeScript (server): `cd server-side && npx tsc --noEmit`
- TypeScript (web): `cd client-side-admin && npx tsc --noEmit`
- Build (web): `cd client-side-admin && npm run build`

## Application Commands

- **Server dev**: `cd server-side && npm run dev`
- **Web dev**: `cd client-side-admin && npm run dev`

## Archiona Workflow

All code changes must go through the Archiona pre-coding gate defined in `.archiona/workflow.md`.

- Create a plan: run `archiona plan --slug <slug> --title "<title>"`
- Validate a plan: run `archiona validate`
