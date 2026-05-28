# Spec: Client AI Lesson Generation Workflow

## Purpose

Connect the mobile lesson generation form to the backend lesson plan specialist endpoint and document the exact workflow agents should follow.

## Scope

- in scope: client API function, generate lesson plan screen state, API request mapping, result display, and workflow documentation
- out of scope: real OpenAI calls, lesson plan persistence, navigation to a separate editor screen

## Proposed behavior

The `GeneratePlanScreen` collects Topic / Subject, Grade Level, Duration, and Specific Goals / Standards. The screen calls a typed client service function instead of building API URLs directly. The service maps the form fields to `POST /api/ai/lesson-plan/generate`:

- Topic / Subject -> `title` and `subject`
- Grade Level -> `gradeLevel`
- Duration -> `duration`
- Specific Goals / Standards -> `userDraftText` and `templateNotes`
- Client default -> `numberOfSessions: 1`

The backend returns the existing `{ data, error }` envelope. The client renders the canonical `document.blocks` JSON document on the same screen and surfaces validation or server errors through toast messages. `draftText` may exist as a compatibility preview, but editing and export workflows should use `document`.

The user sees a read-only preview by default. A pencil icon in the preview panel toggles editing for the generated document blocks. The edited JSON document is sent to `POST /api/ai/lesson-plan/export`, which returns a Word-compatible `.doc` payload and plain text fallback.

The dashboard entry points should route users into this workflow: the floating assistant icon and "Try it now" action navigate to the `Generate` tab.

## Acceptance criteria

- [x] The client has typed payload and response types for AI lesson plan generation.
- [x] The generate form validates required fields before submitting.
- [x] The generate button calls the backend AI endpoint through `client-side/src/services/api.ts`.
- [x] The generated lesson plan text is displayed after a successful response.
- [x] The generated JSON document blocks are readable in the client.
- [x] Generated JSON document blocks are preview-only by default.
- [x] Generated JSON document blocks can be edited after tapping the pencil icon.
- [x] The edited JSON document can be sent to the backend export endpoint.
- [x] Dashboard floating assistant redirects to the Generate Plan workflow.
- [x] The anti-hallucination workflow documents exact ownership, route, schema, service, and response shape.
- [x] TypeScript validation passes.

## Constraints

- technical: keep fetch logic inside the client service layer
- product: do not let the client send or override the system prompt or AI role
- delivery: keep the UI result inline until a dedicated lesson plan editor exists

## Risks and open questions

- risk: the deployed API base URL must be redeployed with the new backend endpoint before mobile devices can call it successfully
- question: future UX may need a separate editable lesson plan review screen

## Related docs

- plan: [2026-05-28-client-ai-lesson-generation-workflow.md](../plans/2026-05-28-client-ai-lesson-generation-workflow.md)
- task brief: [2026-05-28-client-ai-lesson-generation-workflow.md](../ai/tasks/2026-05-28-client-ai-lesson-generation-workflow.md)
