# Client History Tab Implementation Plan

**Goal:** Provide a dedicated screen and bottom navigation tab to view and search previously generated lesson plans.

**Architecture:** Create a new `HistoryScreen.tsx` in `client-side/src/screens/Dashboard`. Update the bottom tab navigator (`BottomTabBar.tsx`) to replace the placeholder `Analytics` tab with `History`. The history screen fetches plans from the existing `/ai/lesson-plan/history` endpoint using `listRecentLessonPlans` and filters them locally using a search input. Clicking on a plan navigates to `Preview` screen within the `Generate` stack.

**Tech Stack:** React Native, Expo, React Navigation, NativeWind.

---

## References

- spec: [2026-05-29-client-history-tab.md](../specs/2026-05-29-client-history-tab.md)
- task brief: [2026-05-29-client-history-tab.md](../ai/tasks/2026-05-29-client-history-tab.md)
- product doc: none

## Steps

- [x] **Step 1: Update Navigation Types & Tab Bar**
  - Add `History: undefined` to `DashboardTabParamList` in `client-side/src/navigation/types.ts`.
  - Replace `Analytics` with `History` in `client-side/src/navigation/BottomTabBar.tsx`.
  - Use `book` or `time-outline` (e.g. `time` / `time-outline` or `receipt` / `receipt-outline`) for the history tab icon.

- [x] **Step 2: Create History Screen Component**
  - Create `client-side/src/screens/Dashboard/HistoryScreen.tsx`.
  - Fetch lesson plans on focus using `useFocusEffect` and `listRecentLessonPlans()`.
  - Add a search input text box with a search icon to filter list items by `title`, `subject`, and `gradeLevel`.
  - Create a list with pulling-to-refresh (`RefreshControl`).
  - Style list items nicely like recent cards but in a vertical scrollable list view.
  - Implement navigation to the preview screen on card press.

- [x] **Step 3: Update Home Screen "View All" Navigation**
  - In `client-side/src/screens/Dashboard/HomeScreen.tsx`, link the "View All" button next to "Recent Plans" to navigate to the `History` tab.

- [x] **Step 4: Implement Responsive Custom Modal Grade Selector**
  - Replace native `@react-native-picker/picker` in `GeneratePlanScreen.tsx` with a custom touchable selector and a slide-up `<Modal>` sheet displaying a scrollable list of grade options to ensure 100% responsiveness across all mobile platforms.

## Validation

- [x] Run `npx tsc --noEmit` in `client-side` to ensure no TypeScript compilation issues.
- [x] Manual test and verification.

## Risks

- risk 1: The `Generate` stack's `Preview` screen expects a specific navigation path. We must ensure navigation from `History` (a sibling tab) to `Generate` stack's `Preview` screen is smooth and passes the `lessonPlanId` parameter correctly.
- risk 2: If the user has a large number of plans, local search filtering is sufficient for the first 10-20 plans retrieved, but if pagination is needed later we may need to extend the API. For now, the existing endpoint returns the most recent 10 plans, which is a perfect start.

## Handoff notes

- The implementation will use existing components and navigation infrastructure.
