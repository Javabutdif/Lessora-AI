# Spec: DepEd Semi-Detailed Lesson Plan Template

## Purpose

Add a Philippine Department of Education (DepEd) compliant semi-detailed lesson plan template as an alternative to the existing Lessora AI template, allowing Filipino educators to generate lesson plans that follow official DepEd formatting standards and requirements.

## Scope

- in scope:
  - Template selection UI before lesson plan generation
  - Two template options: "Lessora AI Template" (default) and "DepEd Semi-Detailed"
  - DepEd-compliant lesson plan structure with all required sections
  - AI prompt engineering for DepEd format compliance
  - Template-specific document generation logic
  - Backward compatibility with existing Lessora AI template
  - Template identifier in API payload and database
- out of scope:
  - Additional templates beyond the two specified
  - User-created custom templates
  - Template customization or editing by users
  - Template preview before generation
  - Saving user's template preference
  - Template management interface
  - Template versioning or updates
  - Multi-template comparison features

## Proposed behavior

### Template Selection Workflow

1. User navigates to Generate Lesson Plan screen
2. First input field shows "Lesson Plan Template" selector
3. User taps template selector to open TemplateSelectionModal
4. Modal displays two template options:
   - **Lessora AI Template** (default)
     - Icon: sparkles
     - Description: "Standard AI-generated lesson plan"
   - **DepEd Semi-Detailed**
     - Icon: document-text
     - Description: "Philippine DepEd format with detailed sections"
5. User selects desired template
6. Modal closes and selected template is displayed in selector
7. User continues with remaining form fields (topic, grade, duration, goals)
8. User taps "Generate with AI" button
9. System sends generation request with `templateId` parameter
10. AI generates lesson plan using template-specific prompt and structure

### DepEd Semi-Detailed Template Structure

The DepEd template follows the official Philippine Department of Education semi-detailed lesson plan format with these sections:

#### I. Metadata
- Grade Level
- Subject
- Date
- Duration
- Teacher Name
- School Name

#### II. Learning Competencies
- MELCs (Most Essential Learning Competencies) code
- Detailed competency description

#### III. Objectives
- Knowledge: Cognitive objectives
- Skills: Psychomotor objectives
- Attitude: Affective objectives (values and attitudes)

#### IV. Content
- Detailed content description for the topic

#### V. Learning Resources
- References (textbooks, modules, curriculum guides)
- Materials (physical materials needed)
- Digital Resources (websites, videos, digital tools)

#### VI. Procedure
- **A. Preliminary Activities (5 minutes)**
  - Prayer
  - Greetings
  - Checking of Attendance
  - Review of previous lesson
- **B. Motivation (5-7 minutes)**
  - Engaging activity to introduce topic
- **C. Lesson Proper**
  - 1. Presentation (5-7 minutes)
  - 2. Discussion (10-15 minutes)
  - 3. Guided Practice (7-10 minutes)
  - 4. Independent Practice (5-7 minutes)
- **D. Generalization (3-5 minutes)**
  - Summary questions and key takeaways
- **E. Application (5 minutes)**
  - Real-world application activity

#### VII. Assessment
- Assessment type (Formative or Summative)
- Instructions for students
- 3-5 grade-appropriate assessment questions

#### VIII. Assignment
- Homework or follow-up task

#### IX. Remarks
- Left blank for teacher to fill after lesson delivery

#### X. Reflection
- Number of students who mastered the lesson (to be filled)
- Number of students who need remediation (to be filled)
- Teaching effectiveness reflection (to be filled)

### AI Prompt Engineering

The system uses different prompts based on selected template:

**Lessora AI Template Prompt:**
- Standard structured format
- Focuses on: Overview, Objectives, Materials, Procedure, Assessment, Teacher Notes
- Flexible content generation
- Minimum requirements: 3 objectives, 3 materials, 5 procedure steps

**DepEd Semi-Detailed Prompt:**
- Strict DepEd format compliance
- Anti-hallucination rules to prevent placeholder text
- Requires complete, specific content for all sections
- Uses actual teacher name, school, and date from user profile
- Grade-appropriate content generation
- Detailed procedure with time allocations
- Real assessment questions (no placeholders)

### Template Identifier Storage

- `templateId` field added to lesson plan generation payload
- Values: `"lessora-ai"` (default) or `"deped-semi-detailed"`
- Stored in database with lesson plan record
- Used to determine which prompt and structure to use
- Backward compatible: existing records without `templateId` default to `"lessora-ai"`

### UI Components

**TemplateSelectionModal:**
- Modal overlay with backdrop
- Two template cards with icons and descriptions
- Visual indication of selected template (checkmark, border highlight)
- Close button and tap-outside-to-close functionality
- Consistent styling with existing modals (ExportFormatModal)

**GeneratePlanScreen Updates:**
- Template selector field added above Topic/Subject field
- Displays selected template name and icon
- Taps open TemplateSelectionModal
- Default selection: "Lessora AI Template"
- Template selection persists during form session
- Resets to default when navigating away and returning

## Acceptance criteria

- [ ] User can select between "Lessora AI Template" and "DepEd Semi-Detailed" templates
- [ ] Template selection modal displays both options with clear descriptions
- [ ] Selected template is visually indicated in the modal
- [ ] Selected template name is displayed in the form field
- [ ] Default template is "Lessora AI Template" (maintains current behavior)
- [ ] Template selection is included in API payload as `templateId`
- [ ] Server validates `templateId` as enum: `["lessora-ai", "deped-semi-detailed"]`
- [ ] AI generates lesson plans using template-specific prompts
- [ ] DepEd template generates all required sections with complete content
- [ ] DepEd template includes teacher name and school from user profile
- [ ] DepEd template uses current date in metadata
- [ ] DepEd template generates real, specific content (no placeholders)
- [ ] Lessora AI template continues to work exactly as before
- [ ] Template identifier is stored with lesson plan in database
- [ ] Existing lesson plans without `templateId` default to "lessora-ai"
- [ ] UI is intuitive and matches existing design patterns
- [ ] No breaking changes to existing functionality

## Constraints

- technical:
  - Must work with existing OpenAI API integration
  - Must use existing document block structure for both templates
  - Must maintain backward compatibility with existing lesson plans
  - Must not require database migration for existing records
  - Must work within OpenAI token limits
  - Template selection must use existing modal patterns
- product:
  - Must not confuse users with too many options
  - Must clearly explain difference between templates
  - Must maintain fast generation times (< 30 seconds)
  - Must generate classroom-ready content for both templates
  - DepEd template must follow official Philippine standards
- delivery:
  - Must be implemented without breaking existing features
  - Must work on both iOS and Android
  - Must be testable with both templates
  - Must include proper error handling

## Risks and open questions

- risk 1: DepEd template structure may be too rigid for AI to follow consistently
  - mitigation: Use detailed anti-hallucination rules in prompt
- risk 2: AI may generate placeholder text instead of real content for DepEd template
  - mitigation: Explicit instructions to avoid brackets and placeholders
- risk 3: DepEd template may increase token usage significantly
  - mitigation: Monitor token usage and adjust if needed
- risk 4: Users may not understand which template to choose
  - mitigation: Clear descriptions and default to familiar template
- risk 5: DepEd template may not match all regional variations
  - mitigation: Use standard DepEd format, allow teacher customization after export
- question 1: Should we save user's template preference for future sessions?
  - decision: No, keep it simple for initial implementation
- question 2: Should we add template preview before generation?
  - decision: No, out of scope for initial release
- question 3: Should we add more templates in the future?
  - decision: Possible, but not in current scope

## Related docs

- plan: [`docs/plans/2026-05-31-deped-semi-detailed-template.md`](../plans/2026-05-31-deped-semi-detailed-template.md)
- task brief: [`docs/ai/tasks/2026-05-31-deped-semi-detailed-template.md`](../ai/tasks/2026-05-31-deped-semi-detailed-template.md)