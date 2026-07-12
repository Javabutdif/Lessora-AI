# Spec: Lessora Structure Workflow

## Purpose

Create a durable workflow document that tells coding agents how to add Lessora AI client services and server API layers without inventing unsupported structure.

## Scope

- in scope: client-side service rules, server-side model/service/controller/route rules, response envelopes, naming conventions, and anti-hallucination checklist
- out of scope: changing runtime application behavior, adding new API endpoints, adding dependencies, or refactoring existing code

## Proposed behavior

Agents working on Lessora AI should use `docs/ai/lessora-structure-workflow.md` as the source of truth for API-oriented implementation structure. The document should describe where client services live, how screens call services, how server routes flow through controllers and services, where Zod and Mongoose schemas belong, and what checks to run before implementation.

The shared architecture document should link to the workflow so incoming agents can discover it from the standard required docs.

## Acceptance criteria

- [x] Add a workflow document under `docs/ai/`.
- [x] Document client service rules for API calls and response handling.
- [x] Document server layer responsibilities for routes, controllers, services, schemas, middleware, and config.
- [x] Include a concrete checklist to reduce hallucinated files, routes, and response shapes.
- [x] Link the workflow from `docs/ai/architecture.md`.

## Constraints

- technical: documentation-only change
- product: guidance must match the current Lessora AI structure
- delivery: keep the guidance readable for future coding agents

## Risks and open questions

- risk: future code changes may drift from the workflow if the document is not updated alongside architecture changes
- question: none

## Related docs

- plan: [2026-05-24-lessora-structure-workflow.md](../plans/2026-05-24-lessora-structure-workflow.md)
- task brief: [2026-05-24-lessora-structure-workflow.md](../ai/tasks/2026-05-24-lessora-structure-workflow.md)
- workflow: [lessora-structure-workflow.md](../ai/lessora-structure-workflow.md)

