# Spec: Refine Lesson Plan Flow

## Purpose

Add a client-side refine workflow from `LessonPlanPreviewScreen` so teachers can selectively improve parts of an existing lesson plan with AI before exporting.

## Scope

- in scope:
  - add a `Refine` action on `LessonPlanPreviewScreen`
  - navigate to a new refine page from the preview screen
  - let the user choose which lesson plan sections to refine using checkboxes
  - provide one free-text prompt describing what the user wants refined
  - send a refinement request to the server for AI processing
  - generate a refined prompt that respects the current template structure
  - update the current lesson plan data in the client after refinement
  - optionally persist the refined result through the backend if the current API flow supports it
- out of scope:
  - history/version tracking for refinement iterations
  - collaborative editing or multi-user sharing
  - document export changes beyond using the updated lesson plan content
  - new lesson plan templates

## Proposed behavior

### Entry point

`LessonPlanPreviewScreen` keeps the existing `Edit` and `Export` actions and adds a third action, `Refine`.

Selecting `Refine` opens a new screen dedicated to refinement instead of reusing the current preview/editor layout.

### Refine screen

The refine screen shows:

- a summary of the currently loaded lesson plan
- a list of selectable content areas presented as checkboxes
- a text input where the user explains what they want improved
- a submit action that sends the selected sections and prompt into the AI refinement flow

The checkbox labels must be driven by the lesson plan template structure, so the screen adapts to the currently loaded template.

### Template-aware section selection

The refinement options must be derived from the existing lesson plan JSON structure.

- For the `lessora-ai` template, the selectable items should map to the structured fields already returned by the generator, such as activities, procedures, objectives, materials, assessment, or other existing blocks.
- For the `deped-semi-detailed` template, the selectable items should map to the DepEd section structure, such as objectives, content, learning resources, procedure, assessment, assignment, remarks, or reflection.

The intent is to let the user say "what type of content do you want to refine" without forcing them to know the raw JSON shape.

### Refinement request

When the user submits the form, the client sends a refinement request to the backend that includes:

- the original lesson plan
- the selected sections
- the user’s free-text instructions
- the current template identifier
- the lesson plan id, when available

The backend owns the AI call and prompt construction so the refinement logic stays consistent with the existing lesson plan generation pipeline.

The server should validate that:

- the lesson plan exists and belongs to the authenticated user
- the selected sections are valid for the given template
- the request includes at least one selected section and one instruction prompt

The AI should refine only the selected sections while preserving the rest of the lesson plan structure.

### Result handling

After the refined response returns, the client updates the current lesson plan in memory and returns the user to the preview experience with the refined content loaded.

If the backend persists the refined result, the updated document should be stored against the same lesson plan record or a clearly defined revision strategy.

The refined plan should remain editable and exportable using the existing preview workflow.

### Credit usage

Refinement uses the existing `aiResponseCredits` balance.

- one successful refine action consumes one response credit
- if the user has zero credits, the backend rejects the request before calling OpenAI
- the daily credit refresh continues to reset the same shared response-credit pool
- no separate `refinementToken` is introduced for this feature

## Acceptance criteria

- [ ] `LessonPlanPreviewScreen` exposes a `Refine` action alongside `Edit` and `Export`
- [ ] tapping `Refine` opens a dedicated refinement screen
- [ ] the refinement screen shows checkbox options derived from the lesson plan template structure
- [ ] the refinement screen includes one free-text input for user instructions
- [ ] the user can select multiple sections to refine in one action
- [ ] the client can submit a template-aware refinement request to the backend
- [ ] the backend validates ownership, template section names, and required refinement input
- [ ] refinement consumes the existing `aiResponseCredits` balance
- [ ] the backend returns the refined lesson plan document
- [ ] the updated lesson plan content is loaded back into the current preview flow after refinement
- [ ] the existing edit and export behavior remains unchanged

## Constraints

- technical:
  - must reuse the existing lesson plan document structure
  - must support both `lessora-ai` and `deped-semi-detailed` templates
  - must use the backend as the source of truth for AI refinement
  - must keep the request contract aligned with the current lesson plan API style
- product:
  - must stay simple and understandable for teachers
  - must not require the user to understand JSON structure directly
- delivery:
  - must avoid breaking the current preview and export flow
  - should be implementable as a small navigation, screen, and API addition

## Risks and open questions

- risk: the template-to-checkbox mapping may need a shared mapping table to stay maintainable
- risk: refining only part of a structured document could cause formatting drift if the AI output is inconsistent
- risk: the backend may need a new endpoint or request mode, which could affect route organization
- question: should the refined result replace the current draft immediately, or should the user preview and confirm first?
- question: should the backend persist the refined result as the latest version of the same lesson plan or return it only for local preview?
- question: should refinement reuse the existing lesson-plan AI controller/service flow or live in a dedicated refinement route?

## Related docs

- plan: [`docs/plans/2026-06-07-refine-lesson-plan.md`](../plans/2026-06-07-refine-lesson-plan.md)
- task brief: [`docs/ai/tasks/2026-06-07-refine-lesson-plan.md`](../ai/tasks/2026-06-07-refine-lesson-plan.md)
