# Analytics and Profile Enhancements Implementation Plan

**Goal:** Implement real-time token analytics from the server and add basic profile management features (edit profile, settings, help & support) to the mobile client application.

**Architecture:** Create new user-focused API routes and controllers on the server-side to handle analytics and profile updates. On the client-side, create modal components for profile features and update the AnalyticsScreen to fetch real data. Use existing authentication middleware and UI components to maintain consistency.

**Tech Stack:** 
- Server: Node.js, Express, MongoDB, Mongoose, Zod validation
- Client: React Native, Expo, TypeScript, React Navigation
- Existing patterns: JWT authentication, API service layer, Toast notifications

---

## References

- spec: [`2026-06-01-analytics-profile-enhancements.md`](../specs/2026-06-01-analytics-profile-enhancements.md)
- task brief: [`2026-06-01-analytics-profile-enhancements.md`](../ai/tasks/2026-06-01-analytics-profile-enhancements.md)

## Steps

### Phase 1: Server-Side - User Routes and Analytics

- [ ] Create [`server-side/src/schemas/user.schema.ts`](server-side/src/schemas/user.schema.ts) validation schemas
  - Add `updateProfileSchema` with Zod validation for firstName, lastName, email, school, bio
  - Add `updateSettingsSchema` for notification preferences
  - Ensure email validation and length constraints

- [ ] Create [`server-side/src/services/user.service.ts`](server-side/src/services/user.service.ts)
  - Implement `getUserAnalytics(userId)` - fetch user and count lesson plans
  - Implement `updateUserProfile(userId, data)` - update user fields, check email uniqueness
  - Implement `updateUserSettings(userId, settings)` - update settings field
  - Handle errors and return consistent response format

- [ ] Create [`server-side/src/controllers/user.controller.ts`](server-side/src/controllers/user.controller.ts)
  - Implement `getAnalytics` controller - call service, format response
  - Implement `updateProfile` controller - validate input, call service
  - Implement `updateSettings` controller - validate input, call service
  - Use try-catch with proper error responses

- [ ] Create [`server-side/src/routes/user.routes.ts`](server-side/src/routes/user.routes.ts)
  - Add `GET /analytics` route with auth middleware
  - Add `PUT /profile` route with auth middleware
  - Add `PUT /settings` route with auth middleware
  - Export as `userRouter`

- [ ] Update [`server-side/src/app.ts`](server-side/src/app.ts)
  - Import and mount `userRouter` at `/api/user`
  - Ensure it's placed after auth middleware setup

- [ ] Update [`server-side/src/schemas/user.schema.ts`](server-side/src/schemas/user.schema.ts) (User model)
  - Add `settings` field to User schema with default structure
  - Structure: `{ notifications: { email: boolean }, language: string, theme: string }`

### Phase 2: Client-Side - API Service Updates

- [ ] Update [`client-side/src/services/api.ts`](client-side/src/services/api.ts)
  - Add `UserAnalytics` type definition
  - Add `UpdateProfilePayload` type definition
  - Add `UpdateSettingsPayload` type definition
  - Implement `getUserAnalytics()` function using `requestGetData`
  - Implement `updateUserProfile(payload)` function using `requestData`
  - Implement `updateUserSettings(payload)` function using `requestData`

### Phase 3: Client-Side - Analytics Screen Update

- [ ] Update [`client-side/src/screens/Dashboard/AnalyticsScreen.tsx`](client-side/src/screens/Dashboard/AnalyticsScreen.tsx)
  - Replace static calculations with API call to `getUserAnalytics()`
  - Update state to store full analytics data
  - Update UI to display real data from API response
  - Maintain pull-to-refresh functionality
  - Add error handling with Toast messages
  - Keep loading states

### Phase 4: Client-Side - Edit Profile Modal

- [ ] Create [`client-side/src/components/ui/EditProfileModal.tsx`](client-side/src/components/ui/EditProfileModal.tsx)
  - Create modal component with form fields (firstName, lastName, email, school, bio)
  - Use existing Input/InputField components
  - Add form validation (required fields, email format)
  - Implement save handler calling `updateUserProfile()`
  - Update AuthContext user data on success
  - Show Toast on success/error
  - Add loading state during save
  - Include cancel/close button

- [ ] Update [`client-side/src/screens/Dashboard/ProfileScreen.tsx`](client-side/src/screens/Dashboard/ProfileScreen.tsx)
  - Add state for EditProfileModal visibility
  - Add onPress handler to "Edit Profile" button to open modal
  - Pass user data and update callback to modal
  - Refresh user display after successful update

### Phase 5: Client-Side - Settings Modal

- [ ] Create [`client-side/src/components/ui/SettingsModal.tsx`](client-side/src/components/ui/SettingsModal.tsx)
  - Create modal component with settings options
  - Add toggle for email notifications
  - Display language (read-only for now)
  - Display theme (read-only for now)
  - Implement save handler calling `updateUserSettings()`
  - Show Toast on success/error
  - Add loading state during save
  - Include cancel/close button

- [ ] Update [`client-side/src/screens/Dashboard/ProfileScreen.tsx`](client-side/src/screens/Dashboard/ProfileScreen.tsx)
  - Add state for SettingsModal visibility
  - Add onPress handler to "Settings" button to open modal
  - Pass settings data and update callback to modal

### Phase 6: Client-Side - Help & Support Modal

- [ ] Create [`client-side/src/components/ui/HelpSupportModal.tsx`](client-side/src/components/ui/HelpSupportModal.tsx)
  - Create modal component with scrollable content
  - Add FAQ section with collapsible items (use TouchableOpacity + state)
  - Define FAQ content array with questions and answers
  - Add Contact Support section with email display
  - Implement "Copy Email" button using Clipboard API
  - Add App Version display (from app.json or package.json)
  - Use existing Card components for sections
  - Include close button

- [ ] Update [`client-side/src/screens/Dashboard/ProfileScreen.tsx`](client-side/src/screens/Dashboard/ProfileScreen.tsx)
  - Add state for HelpSupportModal visibility
  - Add onPress handler to "Help & Support" button to open modal

### Phase 7: Testing and Refinement

- [ ] Test analytics data fetching
  - Verify token counts are accurate
  - Test pull-to-refresh
  - Verify error handling

- [ ] Test edit profile functionality
  - Test all field updates
  - Verify email validation
  - Test duplicate email handling
  - Verify data persistence
  - Test AuthContext update

- [ ] Test settings functionality
  - Test toggle switches
  - Verify settings persistence
  - Test error handling

- [ ] Test help & support
  - Verify FAQ collapsing works
  - Test email copy functionality
  - Verify all content displays correctly

- [ ] Test modal interactions
  - Verify all modals open/close properly
  - Test keyboard handling in forms
  - Verify modal dismissal on backdrop tap

- [ ] End-to-end testing
  - Test complete user flow from ProfileScreen
  - Verify all features work together
  - Test on both iOS and Android if possible

## Validation

- [ ] Run server-side: `cd server-side && npm run dev`
- [ ] Run client-side: `cd client-side && npx expo start`
- [ ] Test all API endpoints with authenticated requests
- [ ] Verify database updates persist correctly
- [ ] Test all UI interactions and modal flows
- [ ] Verify error handling and loading states
- [ ] Check TypeScript compilation with no errors
- [ ] Verify Toast notifications display correctly

## Risks

- Email changes could affect authentication - ensure JWT token remains valid after email update
- Concurrent profile updates could cause race conditions - consider optimistic updates
- Modal keyboard handling on different devices may need adjustment
- Settings structure should be extensible but not over-engineered
- FAQ content needs to be maintained and updated as features change
- Large bio text might need scrolling or text truncation in display

## Handoff notes

- Keep all implementations simple and focused on core functionality
- Reuse existing UI components (Card, Button, Input, Modal patterns)
- Follow existing API response patterns for consistency
- Use existing error handling and Toast notification patterns
- Consider adding loading skeletons for better UX
- Settings field in User schema should be optional with sensible defaults
- FAQ content should be easily editable (consider moving to constants file)
- Support email should be configurable (environment variable or config file)
- Modal components should be reusable and follow existing modal patterns in the codebase