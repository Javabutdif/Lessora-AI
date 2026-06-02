# Task: Lite Web App User Portal

**Date**: 2026-05-31
**Status**: Complete
**Priority**: High

## Objective

Create a lite web app version in client-side-admin for regular users (teachers) with:

- User authentication (login/register)
- Lesson plan generation page
- History page to view past lesson plans

This is an alternative to the mobile app, providing web access to core features.

## Context

- client-side-admin currently has admin-only features (admin login, dashboard, user management)
- Need to add a separate user portal for teachers to access via web
- Should reuse existing server-side APIs for auth and lesson plan generation
- Keep it lightweight and focused on core features

## Current state

- status: completed
- next action: none
- blockers: none

## Scope

### In Scope

1. User login page (`/login`)
2. User registration page (`/register`)
3. Lesson plan generation page (`/generate`)
4. History page to view generated lesson plans (`/history`)
5. User authentication context/state management
6. API integration for user endpoints
7. Protected routes for authenticated users
8. Basic navigation between pages

### Out of Scope

- Admin features (keep separate)
- Advanced analytics
- Profile management (can be added later)
- Mobile responsiveness optimization (basic responsive is fine)

## Implementation Notes

- Separate user routes from admin routes (`/login` vs `/admin/login`)
- Reuse existing API service patterns
- Follow the design language from LandingPage.tsx
- Use localStorage for user token (similar to admin token but separate key)
- Reference client-side mobile app for feature parity

## Related Files

- `client-side-admin/src/App.tsx` - routing
- `client-side-admin/src/services/api.ts` - API integration
- `client-side/src/screens/Auth/` - reference for auth screens
- `client-side/src/screens/Dashboard/GeneratePlanScreen.tsx` - reference for generation
- `client-side/src/screens/Dashboard/HistoryScreen.tsx` - reference for history
- `server-side/src/routes/auth.routes.ts` - user auth endpoints
- `server-side/src/routes/ai.routes.ts` - lesson plan endpoints

## Success Criteria

- [ ] Users can register and login
- [ ] Authenticated users can generate lesson plans
- [ ] Users can view their lesson plan history
- [ ] Routes are properly protected
- [ ] UI is consistent with landing page design
- [ ] API integration works correctly

## Progress

- [x] Task brief created
- [ ] Spec document created
- [ ] Implementation plan created
- [ ] User auth pages implemented
- [ ] Generation page implemented
- [ ] History page implemented
- [ ] Testing completed
