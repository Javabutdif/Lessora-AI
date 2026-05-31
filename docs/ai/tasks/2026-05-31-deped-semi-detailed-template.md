# Task: Add DepEd Semi-Detailed Lesson Plan Template

## Summary

- task: Add template selection feature with DepEd semi-detailed lesson plan template option
- requested outcome: Users can choose between "Lessora AI Template" (current) and "DepEd Semi-Detailed" template when generating lesson plans
- primary constraint: Must not delete any current structure or AI role; only add template selection capability

## Linked artifacts

- spec: [`docs/specs/2026-05-31-deped-semi-detailed-template.md`](../../docs/specs/2026-05-31-deped-semi-detailed-template.md)
- plan: [`docs/plans/2026-05-31-deped-semi-detailed-template.md`](../../docs/plans/2026-05-31-deped-semi-detailed-template.md)

## Current state

- status: ready-for-testing
- current owner: Manual tester
- next action: Test both templates (Lessora AI and DepEd Semi-Detailed) to verify functionality
- blockers: none

## Progress checklist

- [x] Create task brief
- [x] Create spec document
- [x] Create plan document
- [x] Update API types to include template selection
- [x] Create TemplateSelectionModal component
- [x] Update GeneratePlanScreen to include template selection
- [x] Update server-side schema to accept templateId
- [x] Update OpenAI service to handle DepEd semi-detailed template
- [ ] Test template selection flow (manual testing required)
- [ ] Verify DepEd template output quality
- [ ] Verify backward compatibility

## Scope

- in scope:
  - Template selection UI (modal or picker)
  - Two template options: "Lessora AI Template" (default/current) and "DepEd Semi-Detailed"
  - API payload update to include templateId
  - Server-side handling of templateId
  - AI prompt modification based on selected template
  - DepEd semi-detailed template structure with all required fields
- out of scope:
  - Additional templates beyond the two specified
  - Template customization by users
  - Template management/CRUD operations
  - Template preview before generation
  - Saving template preference

## File ownership

- implementer: Code mode (current)
- reviewer: Manual review
- tester: Manual testing

## Relevant files

- [`client-side/src/screens/Dashboard/GeneratePlanScreen.tsx`](../../client-side/src/screens/Dashboard/GeneratePlanScreen.tsx) - Add template selection UI
- [`client-side/src/services/api.ts`](../../client-side/src/services/api.ts) - Update types and API calls
- [`server-side/src/schemas/ai.schema.ts`](../../server-side/src/schemas/ai.schema.ts) - Add templateId validation
- [`server-side/src/services/openai.service.ts`](../../server-side/src/services/openai.service.ts) - Handle template-specific generation
- New: `client-side/src/components/ui/TemplateSelectionModal.tsx` - Template selection modal

## Acceptance criteria

- Users can select a template before generating a lesson plan
- Two templates are available: "Lessora AI Template" and "DepEd Semi-Detailed"
- Default template is "Lessora AI Template" (maintains current behavior)
- DepEd template generates lesson plans with the specified structure
- Template selection is intuitive and clear
- Current lesson plan generation functionality remains unchanged when using default template
- AI responds appropriately based on selected template

## Validation

- Manual testing: Generate lesson plan with default template (should work as before)
- Manual testing: Generate lesson plan with DepEd semi-detailed template
- Manual testing: Verify DepEd template output matches expected structure
- Code review: Verify no breaking changes to existing functionality

## Risks or dependencies

- risk 1: DepEd template structure may be too rigid for AI to follow consistently
- risk 2: Template selection may confuse users if not clearly explained
- risk 3: AI token usage may increase with more detailed template requirements
- dependency 1: OpenAI API must support the detailed DepEd template structure
- dependency 2: Current AI prompt engineering approach must be adaptable

## Handoff notes

- Current template structure is defined in `openai.service.ts` buildTeacherPrompt method
- The AI uses a structured JSON response format with blocks
- DepEd template has significantly more fields than current template
- Template selection should be added before grade level selection in the UI flow
- Consider using a modal similar to ExportFormatModal for consistency