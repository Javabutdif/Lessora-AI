<!-- CLI-parsed fields (keys are case-sensitive; must appear as "- key: value" bullets):
  status        required  Values: todo | in progress | completed
  next action   required  Free-text description of the next step
  blockers      optional  Use "none" when clear
  spec          optional  Path like docs/specs/YYYY-MM-DD-slug.md  or "none"
  plan          optional  Path like docs/plans/YYYY-MM-DD-slug.md  or "none" (requires spec when set)

  Wrap file paths in backticks: - spec: `docs/specs/2026-04-04-foo.md`
  Key capitalisation matters: "- Status: todo" (capital S) will NOT be parsed.
-->

# Lesson Plan Activity Type Input

## Summary

- task: Add multi-category activity type input to lesson plan generation, including optional custom "Other" text, and send the selected activity types through the generation prompt.
- requested outcome: Both mobile and web clients collect activity type options and backend prompt builders incorporate them for all existing lesson plan templates.
- primary constraint: Keep changes minimal and avoid over-engineering; only touch the generation flow and prompt assembly.

## Linked artifacts

- spec: none
- plan: none

## Current state

- status: completed
- current owner: implementer
- next action: none
- blockers: none

## Progress checklist

- [ ] Add activity type UI controls to `client-side/src/screens/Dashboard/GeneratePlanScreen.tsx`
- [ ] Add activity type UI controls to `client-side-admin/src/pages/GeneratePlanPage.tsx`
- [ ] Extend `GenerateLessonPlanPayload` in `client-side/src/services/api.ts`
- [ ] Extend `GenerateLessonPlanPayload` in `client-side-admin/src/services/api.ts`
- [ ] Extend `generateLessonPlanSchema` in `server-side/src/schemas/ai.schema.ts`
- [ ] Extend `GenerateLessonPlanRequest` in `server-side/src/services/openai.service.ts`
- [ ] Add activity type prompt text in `server-side/src/services/template-prompts.ts`
- [ ] Ensure `lessora-ai` and `deped-semi-detailed` prompt builders also receive activity type context
- [ ] Test generation flow on both clients for at least one template

## Scope

- in scope: mobile and web generator input, typed payload changes, backend validation, prompt builder context, end-to-end prompt delivery
- out of scope: new database persistence beyond request payload, UI redesign outside the generator page, changes to lesson plan preview or storage format

## File ownership

- planner: n/a
- implementer: n/a
- reviewer: n/a
- tester: n/a

## Relevant files

- `client-side/src/screens/Dashboard/GeneratePlanScreen.tsx`
- `client-side-admin/src/pages/GeneratePlanPage.tsx`
- `client-side/src/services/api.ts`
- `client-side-admin/src/services/api.ts`
- `server-side/src/schemas/ai.schema.ts`
- `server-side/src/services/openai.service.ts`
- `server-side/src/services/template-prompts.ts`

## Acceptance criteria

- [ ] Users can select multiple activity categories when generating a lesson plan
- [ ] Users can enter a custom activity type using "Other"
- [ ] The backend schema accepts `activityTypes` and `activityTypeOther`
- [ ] Prompt builders include activity type instructions for all lesson plan templates
- [ ] Existing lesson plan generation still works for current templates

## Validation

- run: `npm run workflow -- doctor` (if workflow is installed)
- run: `./scripts/check.ps1` or `./scripts/check.sh`

## Risks or dependencies

- risk 1: prompt changes could slightly alter generation style; keep wording narrow and template-specific
- dependency 1: backend schema and frontend payload types must stay aligned

## Handoff notes

- Next agent should implement the payload and prompt changes without adding new UI patterns outside the generator pages.
