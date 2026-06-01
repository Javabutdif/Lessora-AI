# Task Brief: Analytics and Profile Enhancements

## Summary

- task: Implement real token analytics data and profile management features (edit profile, settings, help & support)
- requested outcome: Replace static analytics data with real server-side token usage data; add functional profile editing, settings, and help/support sections
- primary constraint: Keep implementations simple and functional without over-engineering

## Linked artifacts

- spec: `docs/specs/2026-06-01-analytics-profile-enhancements.md`
- plan: `docs/plans/2026-06-01-analytics-profile-enhancements.md`

## Current state

- status: todo
- current owner: unassigned
- next action: Review and approve spec and plan documents
- blockers: none

## Progress checklist

- [ ] Create API endpoint for fetching user token analytics
- [ ] Update AnalyticsScreen to fetch real token data
- [ ] Create API endpoint for updating user profile
- [ ] Implement Edit Profile screen/modal
- [ ] Implement Settings screen/modal
- [ ] Implement Help & Support screen/modal
- [ ] Add navigation from ProfileScreen to new screens
- [ ] Test all new features end-to-end
- [ ] Update API service with new endpoints

## Scope

- in scope:
  - Real-time token usage analytics from server
  - Basic profile editing (name, email, school, bio)
  - Simple settings page (notifications, preferences)
  - Basic help & support section (FAQs, contact info)
  - API endpoints for profile updates and analytics
  - Client-side UI for all new features
- out of scope:
  - Advanced analytics (charts, graphs, historical trends)
  - Password change functionality (separate security feature)
  - Avatar/photo upload
  - Email verification for profile changes
  - Complex notification system
  - Live chat support
  - Payment/subscription management

## File ownership

- planner: Bob (current mode)
- implementer: Code mode agent
- reviewer: Code mode agent
- tester: Manual testing by implementer

## Relevant files

- [`client-side/src/screens/Dashboard/AnalyticsScreen.tsx`](client-side/src/screens/Dashboard/AnalyticsScreen.tsx): Current analytics screen with static data
- [`client-side/src/screens/Dashboard/ProfileScreen.tsx`](client-side/src/screens/Dashboard/ProfileScreen.tsx): Profile screen with placeholder buttons
- [`client-side/src/services/api.ts`](client-side/src/services/api.ts): API service layer
- [`server-side/src/schemas/user.schema.ts`](server-side/src/schemas/user.schema.ts): User data model
- [`server-side/src/routes/auth.routes.ts`](server-side/src/routes/auth.routes.ts): Existing auth routes (reference for new user routes)
- `server-side/src/routes/`: Directory for new user routes
- `server-side/src/controllers/`: Directory for new user controllers
- `server-side/src/services/`: Directory for new user services

## Acceptance criteria

- Analytics screen displays real token usage data from server
- Token counts (remaining, used, total) are accurate and update on refresh
- Users can edit their profile information (name, email, school, bio)
- Profile changes persist to database and reflect immediately
- Settings screen provides basic preference controls
- Help & Support section provides useful information and contact options
- All new screens are accessible from ProfileScreen
- API endpoints are properly authenticated
- Error handling works for all new features
- UI follows existing design patterns and styling

## Validation

- Run client-side: `cd client-side && npx expo start`
- Run server-side: `cd server-side && npm run dev`
- Test analytics data fetching and display
- Test profile editing and data persistence
- Test settings functionality
- Test help & support navigation
- Verify API authentication works correctly

## Risks or dependencies

- User schema already has fields for firstName, lastName, school, bio - can be used directly
- Need to create new user routes separate from auth routes
- Token analytics requires aggregating data from lesson plan history
- Settings functionality scope needs to be clearly defined to avoid feature creep
- Help & Support content needs to be determined (FAQs, contact email, etc.)

## Handoff notes

- Focus on simplicity - avoid over-engineering
- Reuse existing UI components (Card, Button, Input, etc.)
- Follow existing patterns from AnalyticsScreen and ProfileScreen
- Keep API responses consistent with existing patterns
- Consider creating modal-based screens for edit/settings/help to avoid navigation complexity