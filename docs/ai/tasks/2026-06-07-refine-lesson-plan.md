<!-- CLI-parsed fields (keys are case-sensitive; must appear as "- key: value" bullets):
  status        required  Values: todo | in progress | completed
  next action   required  Free-text description of the next step
  blockers      optional  Use "none" when clear
  spec          optional  Path like docs/specs/YYYY-MM-DD-slug.md  or "none"
  plan          optional  Path like docs/plans/YYYY-MM-DD-slug.md  or "none" (requires spec when set)

  Wrap file paths in backticks: - spec: `docs/specs/2026-04-04-foo.md`
  Key capitalisation matters: "- Status: todo" (capital S) will NOT be parsed.
-->

# Task Brief

## Summary

- task: Refine lesson plan flow for the client-side app
- requested outcome: add a new refine page from LessonPlanPreviewScreen so users can choose lesson plan sections to improve with AI, send the request to the backend, and reload the current plan with the refined result
- primary constraint: keep the existing edit/export behavior unchanged while aligning the new flow with the server-side AI pipeline
  and use the existing `aiResponseCredits` balance for quota tracking

## Linked artifacts

- spec: `docs/specs/2026-06-07-refine-lesson-plan.md`
- plan: `docs/plans/2026-06-07-refine-lesson-plan.md`

## Current state

- status: in progress
- current owner: codex
- next action: run validation and fix any TypeScript or runtime issues in the refine flow
- blockers: none

## Progress checklist

- [ ] confirm the refine flow and section labels for each template
- [ ] confirm the backend route or mode for AI refinement
- [ ] confirm the refine action consumes `aiResponseCredits`
- [ ] implement the new refine route and screen
- [ ] implement the backend refinement controller/service path
- [ ] wire the refinement request and preview update flow

## Scope

- in scope: client-side refine entry point, template-aware checkbox selection, free-text refinement prompt, backend AI refinement route or mode, updated lesson plan preview state
- out of scope: history/versioning, export redesign, new templates, unrelated lesson plan editing workflows

## File ownership

- planner: codex
- implementer: codex
- reviewer: codex
- tester: codex

## Relevant files

- `client-side/src/screens/Dashboard/LessonPlanPreviewScreen.tsx`
- `client-side/src/navigation/DashboardStackNavigator.tsx`
- `client-side/src/navigation/types.ts`
- `client-side/src/services/api.ts`
- `client-side/src/components/ui/TemplateSelectionModal.tsx`
- `server-side/src/routes`
- `server-side/src/controllers`
- `server-side/src/services`
- `server-side/src/schemas`

## Acceptance criteria

- [ ] preview screen shows a refine action
- [ ] refine screen lets the user choose multiple template-aware sections using checkboxes
- [ ] user can enter one refinement instruction prompt
- [ ] backend validates the authenticated owner and template-specific section selection
- [ ] backend decrements `aiResponseCredits` after a successful refine
- [ ] backend returns the refined lesson plan document using the existing API style
- [ ] refined lesson plan replaces the current preview content after success

## Validation

- `cd client-side && npx tsc --noEmit`
- `cd server-side && npx tsc --noEmit`

## Risks or dependencies

- risk: refinement section mapping may need to be aligned with the existing lesson plan JSON shape before implementation
- risk: the backend may need a dedicated endpoint, controller, or service method to avoid muddying the generation flow
- risk: refine requests must fail cleanly when `aiResponseCredits` is zero
- dependency: the AI request contract for refinement may need a dedicated endpoint or request mode

## Handoff notes

- notes for the next agent: this is a proposal/task brief only; no code changes have been made yet
