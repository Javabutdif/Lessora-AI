# MongoDB Startup Connection

## Summary

Connect the Express server to MongoDB during app startup using the existing environment variables.

## Current state

- status: completed
- next action: none
- blockers: none

## Status

- [x] Inspect server startup and package dependencies
- [x] Add MongoDB connection in `server-side/src/app.ts`
- [x] Add aligned spec and plan notes
- [x] Run validation

## Relevant files

- `server-side/src/app.ts`
- `server-side/package.json`
- `server-side/.env`
- `docs/specs/2026-05-10-mongodb-startup-connection.md`
- `docs/plans/2026-05-10-mongodb-startup-connection.md`

## Notes

- Uses existing `mongoose` and `dotenv` dependencies.
- Reads `MONGODB_URI` and optional `MONGODB_DBNAME`.
- Logs `MongoDB connected successfully` after a successful connection.
- Validation command `npx tsc --noEmit` currently fails on pre-existing `src/services/openai.service.ts:163` because `focusArea` is read from the wrong config shape.
