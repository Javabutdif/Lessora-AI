# Plan: Refine Lesson Plan Flow

## Goal

Implement an end-to-end refine workflow that starts from `LessonPlanPreviewScreen`, lets the user choose which lesson plan sections to refine, sends the request to the backend for AI processing, and then reloads the preview with the refined content.

## Approach

1. Add a `Refine` action to the lesson plan preview screen.
2. Add a new refine screen and route in the client navigation stack.
3. Build a template-aware section selector using checkboxes.
4. Add one prompt field for the user’s refinement instructions.
5. Add a backend refinement endpoint or route mode that validates ownership and template-specific section names.
6. Combine the original document, selected sections, user instruction, and lesson plan id into a refinement request payload.
7. Replace the current in-memory lesson plan with the refined result and return to preview.
8. Deduct one `aiResponseCredits` value on successful refinement and keep daily refresh behavior unchanged.

## Implementation notes

- Prefer the existing client patterns used by the preview and export screens.
- Keep the initial version focused on the current lesson plan only.
- Reuse the lesson plan template identifier so the checkbox options match the template structure.
- Keep the server-side AI logic aligned with the existing lesson-plan generation pipeline and auth checks.
- Use the existing `aiResponseCredits` balance for refinement instead of adding a separate quota field.
- Avoid changing export behavior unless the refined content requires it.

## Validation

- confirm the preview screen still opens existing plans
- confirm the new refine screen is reachable from preview
- confirm both templates expose the correct refinement section options
- confirm the backend rejects invalid or unauthorized refine requests
- confirm the backend decrements `aiResponseCredits` for successful refinement
- confirm the backend returns the refined lesson plan document for valid requests
- confirm the refined result returns to the preview screen with updated content

## Risks

- the client may need a small shared mapping utility for template section labels
- the backend may need a new route, controller, or service method to keep refinement separate from generation
