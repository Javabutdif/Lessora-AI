# Commands

Use this file as the single place to document the best-known commands for this repository.

## Validation checks

- TypeScript: `npx tsc --noEmit` (the build ignores type errors, so run this explicitly)
- Build: `npm run build`

## Application Commands

- **Dev server**: `npm run dev` (Next.js on http://localhost:3000)
- **Production build locally**: `npm run build && npm start`

## Admin

- **Change the admin password**: `powershell -File scripts/set-admin-password.ps1` (Windows) or `bash scripts/set-admin-password.sh`.
  Prompts for the admin email and a hidden new password (min 15 characters) and updates the existing account in the MongoDB from `.env`. Never put admin passwords in docs or commits.

## Archiona Workflow

All code changes must go through the Archiona pre-coding gate defined in `.archiona/workflow.md`.

- Create a plan: run `archiona plan --slug <slug> --title "<title>"`
- Validate a plan: run `archiona validate`
