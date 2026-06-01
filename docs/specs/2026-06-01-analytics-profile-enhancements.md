# Spec: Analytics and Profile Enhancements

## Purpose

Add real-time token analytics data from the server and implement basic profile management features (edit profile, settings, help & support) to the mobile client application.

## Scope

- in scope:
  - Real token usage analytics API endpoint
  - Profile update API endpoint
  - Analytics screen displaying real server data
  - Edit profile functionality (name, email, school, bio)
  - Basic settings screen (notifications preferences)
  - Help & support screen (FAQs and contact info)
  - Modal-based UI for profile features
- out of scope:
  - Advanced analytics visualizations (charts, graphs)
  - Password change functionality
  - Avatar/photo upload
  - Email verification for changes
  - Complex notification system
  - Live chat support
  - Payment/subscription management

## Proposed behavior

### 1. Analytics - Real Token Data

**Current State:**
- [`AnalyticsScreen.tsx`](client-side/src/screens/Dashboard/AnalyticsScreen.tsx) displays static token calculations based on `user.aiResponseCredits`
- Token usage is calculated as `5 - remainingTokens`
- No server-side analytics endpoint exists

**Proposed Behavior:**
- Create new API endpoint `GET /api/user/analytics` that returns:
  - Total tokens allocated to user
  - Tokens remaining (`aiResponseCredits`)
  - Tokens used (calculated from lesson plan history)
  - Total lesson plans created
  - Current subscription status
- Update [`AnalyticsScreen.tsx`](client-side/src/screens/Dashboard/AnalyticsScreen.tsx) to fetch data from new endpoint
- Display accurate token usage based on actual generation history
- Maintain pull-to-refresh functionality

**API Response Structure:**
```typescript
{
  data: {
    totalTokens: number;        // Total allocated (e.g., 5 for free tier)
    tokensRemaining: number;    // Current aiResponseCredits
    tokensUsed: number;         // Calculated from history
    plansCreated: number;       // Total lesson plans
    subscriptionStatus: string; // "Active (Free Trial)" | "Premium Subscriber"
    accountType: string;        // "Teacher Profile"
  }
}
```

### 2. Profile - Edit Profile

**Current State:**
- [`ProfileScreen.tsx`](client-side/src/screens/Dashboard/ProfileScreen.tsx) has "Edit Profile" button with no functionality
- User schema in [`user.schema.ts`](server-side/src/schemas/user.schema.ts) has: `firstName`, `lastName`, `email`, `school`, `bio`

**Proposed Behavior:**
- Create modal component `EditProfileModal.tsx` that opens when "Edit Profile" is tapped
- Modal displays form with fields:
  - First Name (required)
  - Last Name (required)
  - Email (required, validated)
  - School (optional)
  - Bio (optional, max 500 chars)
- Create API endpoint `PUT /api/user/profile` to update user data
- Validate email format and uniqueness on server
- Update AuthContext user data after successful save
- Show success/error toast messages

**API Request Structure:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  school?: string;
  bio?: string;
}
```

**API Response Structure:**
```typescript
{
  data: {
    user: {
      id: string;
      name: string;          // Combined firstName + lastName
      email: string;
      firstName: string;
      lastName: string;
      school?: string;
      bio?: string;
      aiResponseCredits: number;
    }
  }
}
```

### 3. Profile - Settings

**Current State:**
- "Settings" button in [`ProfileScreen.tsx`](client-side/src/screens/Dashboard/ProfileScreen.tsx) has no functionality

**Proposed Behavior:**
- Create modal component `SettingsModal.tsx` that opens when "Settings" is tapped
- Display simple settings options:
  - **Notifications**: Toggle for email notifications (future feature placeholder)
  - **Language**: Display current language (English) - read-only for now
  - **Theme**: Display current theme (Light) - read-only for now
- Create API endpoint `PUT /api/user/settings` to save preferences
- Store settings in user document (add `settings` field to schema)
- Keep implementation minimal and extensible

**Settings Data Structure:**
```typescript
{
  notifications: {
    email: boolean;
  };
  language: string;  // "en"
  theme: string;     // "light"
}
```

### 4. Profile - Help & Support

**Current State:**
- "Help & Support" button in [`ProfileScreen.tsx`](client-side/src/screens/Dashboard/ProfileScreen.tsx) has no functionality

**Proposed Behavior:**
- Create modal component `HelpSupportModal.tsx` that opens when "Help & Support" is tapped
- Display sections:
  - **FAQs**: Collapsible accordion with common questions
    - "How do I generate a lesson plan?"
    - "What are response tokens?"
    - "How do I export my lesson plans?"
    - "How do I upgrade my account?"
  - **Contact Support**: Display support email with "Copy" button
  - **App Version**: Display current app version
- No API endpoint needed (static content)
- Use existing UI components (Card, TouchableOpacity)

**FAQ Content Structure:**
```typescript
{
  question: string;
  answer: string;
}[]
```

## Acceptance criteria

- [x] Analytics screen fetches and displays real token data from server
- [x] Token counts are accurate based on actual usage history
- [x] Analytics screen has pull-to-refresh functionality
- [x] Edit Profile modal opens from ProfileScreen
- [x] Users can update firstName, lastName, email, school, and bio
- [x] Email validation prevents invalid/duplicate emails
- [x] Profile changes persist to database
- [x] Updated profile data reflects in AuthContext and UI
- [x] Settings modal opens from ProfileScreen
- [x] Settings can be saved and retrieved
- [x] Help & Support modal opens from ProfileScreen
- [x] FAQs are displayed in collapsible format
- [x] Support email can be copied to clipboard
- [x] All modals can be dismissed properly
- [x] Error handling works for all API calls
- [x] Loading states are shown during API requests
- [x] Success/error toasts display appropriately

## Constraints

- technical:
  - Must use existing authentication middleware
  - Must follow existing API response patterns
  - Must use existing UI components where possible
  - Must maintain TypeScript type safety
  - Modal-based UI to avoid navigation complexity
- product:
  - Keep UI simple and intuitive
  - Follow existing design system (colors, fonts, spacing)
  - Maintain consistency with current screens
  - No over-engineering - basic functionality only
- delivery:
  - All features should work offline-first where possible
  - Settings should be extensible for future features
  - Help content should be easily updatable

## Risks and open questions

- risk: Email changes could affect authentication - need to handle token refresh
- risk: Concurrent profile updates could cause data conflicts
- question: Should email changes require verification before taking effect?
- question: What specific notification preferences should be included?
- question: Should we add a "Delete Account" option in settings?
- question: What support email address should be displayed?

## Related docs

- plan: [`2026-06-01-analytics-profile-enhancements.md`](../plans/2026-06-01-analytics-profile-enhancements.md)
- task brief: [`2026-06-01-analytics-profile-enhancements.md`](../ai/tasks/2026-06-01-analytics-profile-enhancements.md)