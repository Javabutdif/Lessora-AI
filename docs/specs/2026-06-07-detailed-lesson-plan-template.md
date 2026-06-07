# Spec: Detailed Lesson Plan, Daily Lesson Log, and Matatag Curriculum Lesson Plan Templates

## Purpose

Add new template options for the Detailed Lesson Plan, Daily Lesson Log, and Matatag Curriculum Lesson Plan formats, with each new template handled by its own file instead of adding more branching to the main OpenAI service.

## Scope

- in scope:
  - add new lesson plan template options in the client generation flow
  - add the same template options to the web portal generation flow
  - let the backend detect and route the selected template to a dedicated template file
  - generate JSON output that matches the Detailed Lesson Plan format shown by the user
  - generate JSON output that matches the Daily Lesson Log format shown by the user
  - generate JSON output that matches the Matatag Curriculum Lesson Plan format shown by the user
  - keep the existing Lessora AI and DepEd Semi-Detailed templates working unchanged
  - move the new template-specific prompt and structure logic into separate files
- out of scope:
  - custom user-editable template builder
  - template versioning
  - template marketplace or sharing
  - changes to the refine flow
  - changes to export formats

## Proposed behavior

### Template selection

When the user opens the lesson plan generator, the template selector will include a new option for the Detailed Lesson Plan template.

The user can choose it the same way they choose the current template options.

### Backend routing

When the user submits generation with the Detailed Lesson Plan template selected, the backend should call a dedicated template file for that format instead of keeping all prompt and structure logic inside the main OpenAI service.

This keeps the main service from growing further and makes the new template easier to maintain.

### Detailed Lesson Plan structure

The new template should follow the provided Detailed Lesson Plan format, including the major sections in the template image:

- Objectives
- Content
- Learning Resources
- Procedures
- Reflection

The template file should own:

- the prompt for this format
- the expected output structure
- the section mapping used by the preview/export flow

### Response behavior

The generated lesson plan should still return the same lesson plan document shape used by the app today so the client preview and export features continue to work without a separate rendering pipeline.

### Daily Lesson Log structure

The new Daily Lesson Log template should also stay JSON-based, even if the teacher uploads or references a tabular paper template.

The backend should translate the template into the same lesson plan document shape used today, so the app remains consistent with Lessora AI and the other lesson plan templates.

The Daily Lesson Log template file should own:

- the prompt for the daily lesson log format
- the expected JSON structure
- the section mapping used by the preview/export flow

### Matatag Curriculum Lesson Plan structure

The Matatag template should also stay JSON-based, while using the uploaded layout as the reference for section organization and generation flow.

The backend should adapt the content for different subjects without requiring a separate media generation path.

The Matatag template file should own:

- the prompt for the Matatag format
- the expected JSON structure
- the section mapping used by the preview/export flow

## Acceptance criteria

- [ ] the template selector includes Detailed Lesson Plan, Daily Lesson Log, and Matatag options
- [ ] the backend routes each new template to a dedicated template file
- [ ] the Detailed Lesson Plan output matches the new template structure
- [ ] the Daily Lesson Log output is generated as JSON and matches the app’s lesson plan document format
- [ ] the Matatag output is generated as JSON and matches the app’s lesson plan document format
- [ ] the existing templates continue to work unchanged
- [ ] the client preview and export flow still use the same lesson plan document shape

## Constraints

- technical:
  - must keep the template-specific prompt and structure logic out of the main `openai.service.ts` file
  - must reuse the current lesson plan document format
  - must preserve the existing AI credit system
  - must not introduce media generation for the Matatag template
- product:
  - must stay simple for teachers selecting a template
  - must not add extra steps beyond choosing the template and generating the plan
  - must keep the mobile client and client-side-admin template choices aligned
- delivery:
  - must be introduced without breaking existing templates
  - should be implemented with the smallest useful file split

## Risks and open questions

- risk: the new templates may need their own section mapping rules to fit the existing document model cleanly
- question: should each new template live in its own file, or should they share one small template registry plus per-template files?

## Related docs

- plan: [`docs/plans/2026-06-07-detailed-lesson-plan-template.md`](../plans/2026-06-07-detailed-lesson-plan-template.md)
- task brief: [`docs/ai/tasks/2026-06-07-detailed-lesson-plan-template.md`](../ai/tasks/2026-06-07-detailed-lesson-plan-template.md)
