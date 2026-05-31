<!-- CLI-parsed fields (keys are case-sensitive; must appear as "- key: value" bullets):
  status        required  Values: todo | in progress | completed
  next action   required  Free-text description of the next step
  blockers      optional  Use "none" when clear
  spec          optional  Path like docs/specs/YYYY-MM-DD-slug.md  or "none"
  plan          optional  Path like docs/plans/YYYY-MM-DD-slug.md  or "none" (requires spec when set)

  Wrap file paths in backticks: - spec: `docs/specs/2026-05-31-admin-landing-page.md`
  Key capitalisation matters: "- Status: todo" (capital S) will NOT be parsed.
-->

# Task Brief: Admin Landing Page

## Summary

- task: Create a public-facing landing page for the admin portal (client-side-admin) that showcases Lessora AI with app download functionality
- requested outcome: A professional landing page at `/` that features Lessora AI content, design consistency with client-side, and a download button; admin routes protected at `/admin/*`
- primary constraint: Maintain design/color scheme parity with client-side, reuse image assets, use available design skills

## Linked artifacts

- spec: `none`
- plan: `none`

## Current state

- status: completed
- current owner: completed
- next action: none - landing page is fully implemented and ready for testing/deployment
- blockers: none

## Progress checklist

- [x] Review client-side design assets, color scheme, and UI components
- [x] Review available design skills in `skills/react-native-design/` and `skills/react-native-architecture/`
- [x] Copy Lessora transparent logo to admin assets folder
- [x] Design and implement landing page with Lessora AI branding
- [x] Implement color scheme (dark navy #0a0e27-#1a1f3a, blue #3b82f6, purple #7c3aed gradients)
- [x] Update App.tsx routing: move admin to `/admin/*`, set landing page as default `/`
- [x] Implement primary CTA: Download App button (Google Drive link)
- [x] Implement secondary CTA: Login button routing to `/admin/login`
- [x] Create feature highlights section (3-column grid)
- [x] Polish UI with professional styling
  - Enhanced shadows and inset highlights
  - Smooth hover animations (4px lift for buttons, 6px for cards)
  - Gradient decorative blobs
  - Refined typography and spacing
- [x] Add developer credit: "Developed by Javabutdif"
- [x] Set download link to: `https://drive.google.com/file/d/1QVbg90SLPxsSMcxWAYHkger74yNziE8k/view?usp=drive_link`

## Implementation Summary

### Landing Page Features:

- **Logo Section:** 280px transparent Lessora AI logo with drop-shadow, tagline "Less Planning, More Teaching"
- **Headline:** 32px bold headline with improved letter spacing
- **Description:** Clear value proposition explaining the platform's benefits
- **Primary CTA:** Download App button (blue-to-purple gradient, 220px width)
- **Secondary CTA:** Login button (transparent with blue border, 220px width)
- **Feature Grid:** 3-column responsive grid showcasing:
  - ⚡ Minutes Not Hours - Create plans instantly
  - 🎯 Structured Plans - Professional format
  - 🤖 AI-Powered - Smart generation
- **Footer:** Copyright notice + "Developed by Javabutdif" credit with blue highlight

### Technical Implementation:

- **Framework:** React with TypeScript
- **Styling:** Inline CSS with sophisticated gradients and animations
- **Design System:** Blue (#3b82f6) and purple (#7c3aed) color palette from Lessora branding
- **Routing:** Protected `/admin/*` routes, public landing page at `/`
- **Asset Management:** Transparent logo imported from `client-side-admin/src/assets/`

### Files Modified:

1. **`client-side-admin/src/App.tsx`** - Updated routing structure
   - `/` → LandingPage
   - `/admin/login` → LoginPage
   - `/admin/dashboard` → AdminDashboard (protected)
   - `/admin/users` → UserManagement (protected)

2. **`client-side-admin/src/pages/LandingPage.tsx`** - New landing page component
   - Professional hero section with logo
   - Responsive CTA buttons with hover effects
   - Feature highlights grid
   - Footer with developer credit

3. **`client-side-admin/src/pages/LoginPage.tsx`** - Updated navigation
   - Redirects to `/admin/dashboard` after login
   - Logout redirects to `/admin/login`

4. **`client-side-admin/src/pages/AdminDashboard.tsx`** - Updated navigation
   - Logout redirects to `/admin/login`
   - Users button navigates to `/admin/users`

5. **`client-side-admin/src/pages/UserManagement.tsx`** - Updated navigation
   - Back button navigates to `/admin/dashboard`

6. **`client-side-admin/src/assets/`** - New folder containing:
   - Transparent Logo.png (copied from client-side)

### Scope

- in scope:
  - ✅ Public landing page at `/` showcasing Lessora AI
  - ✅ Reuse design/color scheme from client-side app
  - ✅ Use Lessora logo and design assets
  - ✅ Download app button with Google Drive link
  - ✅ Login button routing to admin
  - ✅ Refactor routing: admin at `/admin/*`
  - ✅ Protect `/admin/*` routes with authentication
  - ✅ Use design patterns and professional styling
  - ✅ Add developer attribution
- out of scope:
  - Changing authentication logic
  - Modifying server-side admin endpoints
  - Creating new admin features beyond routing refactor
