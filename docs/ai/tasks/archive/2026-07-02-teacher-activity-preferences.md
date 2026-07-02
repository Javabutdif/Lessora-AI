<!-- CLI-parsed fields (keys are case-sensitive; must appear as "- key: value" bullets):
  status        required  Values: todo | in progress | completed
  next action   required  Free-text description of the next step
  blockers      optional  Use "none" when clear
  spec          optional  Path like docs/specs/YYYY-MM-DD-slug.md  or "none"
  plan          optional  Path like docs/plans/YYYY-MM-DD-slug.md  or "none" (requires spec when set)

  Wrap file paths in backticks: - spec: `docs/specs/2026-04-04-foo.md`
  Key capitalisation matters: "- Status: todo" (capital S) will NOT be parsed.
-->

# Teacher Activity Preferences

## Summary

- task: Add an optional teaching preference section to both the mobile and web lesson plan generation forms and send the preferences to the backend prompt builder.
- requested outcome: Mobile and web users can select multiple activity preferences and optionally enter additional activity notes; the backend accepts them and uses them in the AI prompt without changing existing generation behavior.
- primary constraint: Keep the feature lightweight and focused on generation request flow; do not modify lesson templates, exports, or add database persistence.

## Linked artifacts

- spec: none
- plan: none

## Current state

- status: completed
- current owner: implementer
- next action: none
- blockers: none

## Progress checklist

- [x] Add `activityPreferences?: string[]` and `activityPreferenceNotes?: string` to the client API payload types
- [x] Add a new form section after Grade Level and before Language in both mobile and web generator forms
- [x] Use multi-select chips or checkboxes for the suggested preference values
- [x] Add an optional text input for additional activity preference notes
- [x] Keep both fields optional and preserve existing generation behavior when empty
- [x] Extend the backend generation request schema to validate the new fields
- [x] Include the preferences section in the AI prompt when values exist
- [x] Ensure the prompt clearly instructs the model to prioritize preferences without overriding age-appropriate pedagogy
- [x] Verify mobile form and backend compilation

## Scope

- in scope:web app lesson generation form, mobile lesson generation form, mobile API payload, backend request schema, AI prompt builder
- out of scope: admin UI changes, new database tables, lesson template structure, export functionality

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

- [ ] Users can optionally select multiple teaching preferences in both mobile and web apps
- [ ] Users can optionally enter additional activity preference notes in both mobile and web apps
- [ ] The backend schema accepts `activityPreferences` and `activityPreferenceNotes`
- [ ] Prompt generation includes the new preferences when provided
- [ ] Lesson generation still works when both fields are empty

## Validation

- run: `cd server-side && npm run build`
- run: `cd client-side && npx tsc --noEmit`
- run: `cd client-side-admin && npm run build` (admin should remain unaffected)

## Risks or dependencies

- risk 1: prompt wording may overly constrain activities if not phrased carefully
- dependency 1: mobile payload and server request schema must stay aligned

## Handoff notes

- Keep the form design consistent with existing mobile generator UI.
- Do not add admin-facing UI or data persistence beyond the generation request.
