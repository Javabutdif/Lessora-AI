# Lessora Structure Workflow Implementation Plan

**Goal:** Add a repository workflow document that gives agents clear implementation rules for Lessora AI client services and server API layers.

**Architecture:** This is a documentation-only change. The workflow lives in `docs/ai/` and is linked from the shared architecture notes.

**Tech Stack:** Markdown documentation for Expo React Native client patterns and Node.js, Express, TypeScript, Zod, Mongoose server patterns.

---

## References

- spec: [2026-05-24-lessora-structure-workflow.md](../specs/2026-05-24-lessora-structure-workflow.md)
- task brief: [2026-05-24-lessora-structure-workflow.md](../ai/tasks/2026-05-24-lessora-structure-workflow.md)
- workflow: [lessora-structure-workflow.md](../ai/lessora-structure-workflow.md)

## Steps

- [x] Inspect the current client API service and server API layering.
- [x] Add workflow guidance for client services.
- [x] Add workflow guidance for server routes, controllers, services, schemas, middleware, and config.
- [x] Add anti-hallucination checklist and naming conventions.
- [x] Link the workflow from architecture docs.

## Validation

- [x] Review the Markdown files for clear structure and internal links.
- [ ] Run the repo's documented validation command if needed for non-documentation changes.

## Risks

- Future implementation work may introduce patterns not reflected in this document.
- The current API surface is still small, so some rules are intentionally conservative.

## Handoff notes

- Update `docs/ai/lessora-structure-workflow.md` whenever API response envelopes, service layout, or server layering changes.

