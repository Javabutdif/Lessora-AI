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

- task: Add Detailed Lesson Plan, Daily Lesson Log, and Matatag template options to lesson plan generation across mobile and web
- requested outcome: let the user select the new templates in both client apps and route generation through dedicated backend template files
- primary constraint: keep the implementation small and avoid bloating the main OpenAI service

## Linked artifacts

- spec: `docs/specs/2026-06-07-detailed-lesson-plan-template.md`
- plan: `docs/plans/2026-06-07-detailed-lesson-plan-template.md`

## Current state

- status: completed
- current owner: codex
- next action: none
- blockers: none

## Progress checklist

- [x] confirm where each template file should live on the server
- [x] wire the template selector to pass the new template ids
- [x] remove duplicate Lessora AI and DepEd prompt definitions from the template helper
- [x] add anti-hallucination and structure-critical instructions to the newer template prompts
- [x] add the grade-level adaptation rule to all prompt paths
- [x] expand the Matatag template skeleton to match the reference layout with blank teacher-fill areas and guided questions
- [x] add fixed-pattern avoidance guidance to the Lessora AI and DepEd procedure prompts

## Scope

- in scope: mobile and web template selectors, backend template routing, dedicated template files, shared lesson plan document output
- out of scope: refine flow, export changes, user-created templates, template versioning

## File ownership

- planner: codex
- implementer: codex
- reviewer: codex
- tester: codex

## Relevant files

- `client-side/src/components/ui/TemplateSelectionModal.tsx`
- `client-side-admin/src/pages/GeneratePlanPage.tsx`
- `client-side-admin/src/services/api.ts`
- `client-side/src/screens/Dashboard/GeneratePlanScreen.tsx`
- `client-side/src/services/api.ts`
- `server-side/src/services/openai.service.ts`
- `server-side/src/schemas/ai.schema.ts`

## Acceptance criteria

- [x] Detailed Lesson Plan, Daily Lesson Log, and Matatag appear in the template selector
- [x] backend routes those templates to separate template files
- [x] existing templates still generate as before
- [x] generated output still returns the same JSON document shape used by preview/export

## Validation

- `cd client-side && npx tsc --noEmit`
- `cd server-side && npx tsc --noEmit`

## Risks or dependencies

- risk: the template files may need a small shared helper if the section mapping differs from the other templates
- dependency: template selection must continue passing the selected `templateId` through the client request

## Handoff notes

- notes for the next agent: Lessora AI and DepEd prompt generation now need to stay on the service-owned builders, while the other template formats continue using the template prompt helper with their own block structures
- notes for the next agent: Lessora AI and DepEd prompt generation stay on the service-owned builders, and the template helper now owns only the newer formats with stricter block instructions
- notes for the next agent: the shared grade-level adaptation rule should be present in both the service-owned prompts and the shared template helper so every template path follows the same teaching guidance
- notes for the next agent: the shared grade-level adaptation rule is now present in both the service-owned prompts and the shared template helper so every template path follows the same teaching guidance
- notes for the next agent: the Matatag template now uses a more complete reference-style skeleton with blank fill-up areas, guided questions, and no teacher answer keys
