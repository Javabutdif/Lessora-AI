# Detailed Lesson Plan, Daily Lesson Log, and Matatag Template Implementation Plan

**Goal:** Add new Detailed Lesson Plan, Daily Lesson Log, and Matatag template options and route their generation through dedicated template files, while keeping the current lesson plan document flow unchanged.

**Architecture:** Add the template options in both client apps, pass the selected `templateId` to the backend, and route the generation logic to dedicated template files for the new formats. The main service should stay focused on shared AI flow and credit handling.

**Tech Stack:** React Native client, Express + TypeScript backend, existing OpenAI Responses API integration, existing lesson plan document model, existing `aiResponseCredits` quota system.

---

## References

- spec: [2026-06-07-detailed-lesson-plan-template.md](../specs/2026-06-07-detailed-lesson-plan-template.md)
- task brief: [2026-06-07-detailed-lesson-plan-template.md](../ai/tasks/2026-06-07-detailed-lesson-plan-template.md)

## Steps

- [ ] Add the Detailed Lesson Plan, Daily Lesson Log, and Matatag options to the mobile and web template selectors.
- [ ] Create dedicated backend template files for the new formats.
- [ ] Route generation requests to the correct template file when each template is selected.
- [ ] Keep existing templates working without changing their behavior.

## Validation

- [ ] Run the relevant targeted TypeScript checks.
- [ ] Confirm existing generation still works for Lessora AI and DepEd Semi-Detailed templates.

## Risks

- risk 1: the template images may still require light mapping work to fit the current lesson plan document shape.
- risk 2: if the split is too thin, the main service may still feel cluttered.

## Handoff notes

- anything the next agent needs to know: this proposal intentionally keeps the change small and avoids touching refine/export behavior.
