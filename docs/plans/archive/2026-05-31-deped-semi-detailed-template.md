# DepEd Semi-Detailed Lesson Plan Template Implementation Plan

**Goal:** Add a Philippine DepEd-compliant semi-detailed lesson plan template as an alternative to the existing Lessora AI template, allowing users to select their preferred template format before generating lesson plans.

**Architecture:** Implement template selection UI in the client-side Generate screen, extend API types and schemas to include `templateId`, and add template-specific prompt generation logic in the OpenAI service. The implementation uses a discriminated union approach where the `templateId` determines which prompt builder and document structure to use.

**Tech Stack:**
- React Native with TypeScript (client-side)
- Node.js with Express and TypeScript (server-side)
- Zod for schema validation
- OpenAI API for lesson plan generation
- MongoDB for data persistence

---

## References

- spec: [`docs/specs/2026-05-31-deped-semi-detailed-template.md`](../specs/2026-05-31-deped-semi-detailed-template.md)
- task brief: [`docs/ai/tasks/2026-05-31-deped-semi-detailed-template.md`](../ai/tasks/2026-05-31-deped-semi-detailed-template.md)

## Steps

- [x] **Step 1: Update API Types (client-side)**
  - Add `LessonPlanTemplate` type as union: `"lessora-ai" | "deped-semi-detailed"`
  - Add `templateId` optional field to `GenerateLessonPlanPayload` type
  - Default value: `"lessora-ai"`
  - File: `client-side/src/services/api.ts`

- [x] **Step 2: Create TemplateSelectionModal Component**
  - Create new modal component: `client-side/src/components/ui/TemplateSelectionModal.tsx`
  - Props: `visible`, `onClose`, `onSelectTemplate`, `selectedTemplate`
  - Display two template options with icons and descriptions
  - Visual indication of selected template (checkmark, border highlight)
  - Match styling of existing ExportFormatModal
  - Use Ionicons: `sparkles` for Lessora AI, `document-text` for DepEd

- [x] **Step 3: Update GeneratePlanScreen**
  - Add state: `selectedTemplate` with default `"lessora-ai"`
  - Add state: `isTemplateModalVisible` for modal visibility
  - Add template selector field above Topic/Subject input
  - Display selected template name and icon
  - Open TemplateSelectionModal on tap
  - Include `templateId` in API payload when generating
  - Reset template to default when screen loses focus
  - File: `client-side/src/screens/Dashboard/GeneratePlanScreen.tsx`

- [x] **Step 4: Update Server-Side Schema**
  - Add `templateId` field to `generateLessonPlanSchema`
  - Type: `z.enum(["lessora-ai", "deped-semi-detailed"])`
  - Default: `"lessora-ai"`
  - File: `server-side/src/schemas/ai.schema.ts`

- [x] **Step 5: Update OpenAI Service - Template Routing**
  - Modify `buildTeacherPrompt` method to route based on `templateId`
  - If `templateId === "deped-semi-detailed"`, call `buildDepEdPrompt`
  - Otherwise, call `buildLessoraAIPrompt` (existing logic)
  - File: `server-side/src/services/openai.service.ts`

- [x] **Step 6: Implement DepEd Prompt Builder**
  - Create `buildDepEdPrompt` method in OpenAI service
  - Extract teacher name from user object: `${user.firstName} ${user.lastName}`
  - Extract school name from user object: `user.school || "Not specified"`
  - Get current date formatted as "Month Day, Year"
  - Build comprehensive DepEd-compliant prompt with:
    - Anti-hallucination rules (no placeholders, no brackets)
    - All 10 required sections (Metadata, Competencies, Objectives, Content, Resources, Procedure, Assessment, Assignment, Remarks, Reflection)
    - Detailed procedure subsections with time allocations
    - Specific instructions for real, actionable content
    - Example structure using document blocks format
  - File: `server-side/src/services/openai.service.ts`

- [x] **Step 7: Update Request Interface**
  - Add `templateId` optional field to `GenerateLessonPlanRequest` interface
  - Type: `"lessora-ai" | "deped-semi-detailed" | undefined`
  - File: `server-side/src/services/openai.service.ts`

- [ ] **Step 8: Test Template Selection Flow**
  - Manual test: Select Lessora AI template and generate lesson plan
  - Verify: Output matches existing format
  - Manual test: Select DepEd Semi-Detailed template and generate lesson plan
  - Verify: Output includes all 10 required sections
  - Verify: No placeholder text or brackets in DepEd output
  - Verify: Teacher name, school, and date are populated correctly
  - Verify: Template selection resets when navigating away
  - Test on both iOS and Android devices

- [ ] **Step 9: Verify Backward Compatibility**
  - Test: Existing lesson plans load correctly
  - Test: API calls without `templateId` default to "lessora-ai"
  - Test: Database queries work with and without `templateId` field
  - Verify: No breaking changes to existing functionality

- [ ] **Step 10: Update Task Documentation**
  - Mark all implementation steps as complete in task brief
  - Update task status to "completed"
  - Add completion notes with any observations or issues
  - File: `docs/ai/tasks/2026-05-31-deped-semi-detailed-template.md`

## Validation

- [ ] Run client-side TypeScript compilation: `cd client-side && npm run tsc`
- [ ] Run server-side TypeScript compilation: `cd server-side && npm run build`
- [ ] Test lesson plan generation with Lessora AI template
- [ ] Test lesson plan generation with DepEd Semi-Detailed template
- [ ] Verify DepEd output contains all required sections
- [ ] Verify no placeholder text in DepEd output
- [ ] Verify template selection UI is intuitive and functional
- [ ] Test on iOS device or simulator
- [ ] Test on Android device or emulator
- [ ] Verify backward compatibility with existing lesson plans

## Risks

- risk 1: AI may struggle to generate complete DepEd format consistently
  - mitigation: Detailed anti-hallucination rules and explicit instructions in prompt
  - fallback: Users can edit exported documents if needed
- risk 2: DepEd template may significantly increase token usage
  - mitigation: Monitor token usage in production
  - action: Adjust prompt if token costs become problematic
- risk 3: User profile may not have firstName, lastName, or school fields
  - mitigation: Use fallback values ("Not specified") when fields are missing
  - action: Consider adding these fields to user registration if needed
- risk 4: Template selection may confuse users
  - mitigation: Clear descriptions and sensible default (Lessora AI)
  - action: Add help text or tooltips if user feedback indicates confusion

## Handoff notes

- Implementation is complete from a code perspective
- All client-side and server-side changes have been made
- TemplateSelectionModal follows the same pattern as ExportFormatModal
- DepEd prompt includes comprehensive anti-hallucination rules to prevent placeholder text
- Template selection defaults to "lessora-ai" to maintain existing user experience
- The `templateId` field is optional in the schema with a default value for backward compatibility
- User profile fields (firstName, lastName, school) are used in DepEd template metadata
- Manual testing is required to verify AI output quality for both templates
- Consider adding user profile fields if they don't exist (firstName, lastName, school)
- Future enhancement: Save user's template preference across sessions