# Spec: lesson plan preview history

## Purpose

Finalize the untracked code for the `LessonPlanPreviewScreen` and history functionality by fixing TypeScript compiler errors and formalizing the AI tracking documents.

## Scope

- in scope: `HomeScreen.tsx`, `LessonPlanPreviewScreen.tsx`
- out of scope: adding new features or backend endpoints

## Proposed behavior

The app correctly routes users from the `HomeScreen` (recent plans or "Try it now" button) into the nested `DashboardStackNavigator` by passing the proper nested parameters, e.g., `{ screen: "Preview", params: { lessonPlanId } }`. The `LessonPlanPreviewScreen` correctly handles nullable checks for `lessonPlanId` to satisfy strict TypeScript compilation.

## Acceptance criteria

- [x] `HomeScreen.tsx` correctly passes nested navigation parameters.
- [x] `LessonPlanPreviewScreen.tsx` correctly handles nullable types for `lessonPlanId`.
- [x] The `client-side` codebase compiles without any TypeScript errors.

## Constraints

- technical: TypeScript strict mode must pass.
- product: Navigation must not crash.
- delivery: Must be tracked by the repository's AI workflow tools.

## Risks and open questions

- risk 1: none
- question 1: none

## Related docs

- plan: [2026-05-29-lesson-plan-preview-history.md](../plans/2026-05-29-lesson-plan-preview-history.md)
- task brief: [2026-05-29-lesson-plan-preview-history.md](../ai/tasks/2026-05-29-lesson-plan-preview-history.md)
- product doc: none
