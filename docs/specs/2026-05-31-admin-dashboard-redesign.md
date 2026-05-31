# Spec: Admin Dashboard and User Management Mobile-Responsive Redesign

## Purpose

Redesign the admin dashboard and user management interface to be fully mobile-responsive with a reusable component library, replacing 100% inline styles with a proper design system while maintaining the current dark theme aesthetic with glass-morphism.

## Scope

### In scope:
- Design system with CSS variables for colors, spacing, typography, shadows, and breakpoints
- Reusable component library (Button, Card, Badge, Input, Modal, Table, Loading states, Toast)
- Mobile-responsive AdminDashboard with adaptive grid layouts (3-col → 2-col → 1-col)
- Mobile-responsive UserManagement with table-to-card transformation
- Enhanced UserManagementModal with better UX and accessibility
- Touch-friendly interactions (min 44x44px targets)
- Hover/focus states for all interactive elements
- Loading skeletons replacing text-based loading states
- Custom confirmation modal replacing native `window.confirm()`
- Accessibility improvements (ARIA, keyboard navigation, focus management)

### Out of scope:
- Backend API changes
- Authentication/authorization logic changes
- New features beyond responsive redesign
- Data visualization/charts
- Advanced filtering/sorting beyond basic search
- Real-time updates/websockets
- Multi-language support
- Dark/light theme toggle (dark theme only)

## Proposed behavior

### 1. Design System Foundation

#### 1.1 CSS Variables (Design Tokens)
Create a centralized design tokens file with CSS custom properties:

**Color Palette:**
```css
:root {
  /* Primary Colors */
  --color-primary: #60a5fa;
  --color-primary-light: #93c5fd;
  --color-primary-dark: #3b82f6;
  
  /* Status Colors */
  --color-success: #22c55e;
  --color-success-light: #86efac;
  --color-warning: #f59e0b;
  --color-warning-light: #fde68a;
  --color-error: #ef4444;
  --color-error-light: #fecdd3;
  --color-info: #2dd4bf;
  
  /* Accent Colors (for metric cards) */
  --color-accent-blue: #60a5fa;
  --color-accent-green: #22c55e;
  --color-accent-orange: #f59e0b;
  --color-accent-pink: #fb7185;
  --color-accent-teal: #2dd4bf;
  --color-accent-purple: #c084fc;
  
  /* Neutral Colors */
  --color-white: #ffffff;
  --color-gray-50: rgba(255, 255, 255, 0.95);
  --color-gray-100: rgba(255, 255, 255, 0.8);
  --color-gray-200: rgba(255, 255, 255, 0.7);
  --color-gray-300: rgba(255, 255, 255, 0.62);
  --color-gray-400: rgba(255, 255, 255, 0.6);
  --color-gray-500: rgba(148, 163, 184, 0.8);
  --color-gray-600: rgba(148, 163, 184, 0.6);
  
  /* Background Colors */
  --color-bg-primary: #020817;
  --color-bg-secondary: #040b18;
  --color-bg-tertiary: #01060f;
  --color-bg-card: rgba(5, 11, 22, 0.86);
  --color-bg-card-hover: rgba(5, 11, 22, 0.95);
  --color-bg-input: rgba(5, 11, 22, 0.5);
  --color-bg-overlay: rgba(0, 0, 0, 0.6);
  
  /* Border Colors */
  --color-border-primary: rgba(96, 165, 250, 0.22);
  --color-border-secondary: rgba(148, 163, 184, 0.18);
  --color-border-tertiary: rgba(148, 163, 184, 0.1);
  --color-border-input: rgba(148, 163, 184, 0.3);
  --color-border-focus: rgba(96, 165, 250, 0.6);
}
```

**Spacing Scale:**
```css
:root {
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-7: 28px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
}
```

**Typography Scale:**
```css
:root {
  /* Font Families */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
  
  /* Font Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 13px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 30px;
  --font-size-5xl: 32px;
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Letter Spacing */
  --letter-spacing-tight: -0.01em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.1em;
  --letter-spacing-wider: 0.12em;
}
```

**Border Radius:**
```css
:root {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 22px;
  --radius-4xl: 24px;
  --radius-full: 9999px;
}
```

**Shadows:**
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-glow-blue: 0 0 20px rgba(96, 165, 250, 0.3);
  --shadow-glow-green: 0 0 20px rgba(34, 197, 94, 0.3);
}
```

**Breakpoints:**
```css
:root {
  --breakpoint-mobile: 768px;
  --breakpoint-tablet: 1024px;
  --breakpoint-desktop: 1200px;
}
```

**Transitions:**
```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
}
```

**Z-Index Scale:**
```css
:root {
  --z-index-base: 1;
  --z-index-dropdown: 100;
  --z-index-sticky: 200;
  --z-index-modal-backdrop: 900;
  --z-index-modal: 1000;
  --z-index-toast: 1100;
}
```

#### 1.2 Responsive Breakpoints
- **Mobile**: < 768px (single column, stacked layout)
- **Tablet**: 768px - 1199px (2-column layout where appropriate)
- **Desktop**: ≥ 1200px (3-column layout, full features)

### 2. Component Library

#### 2.1 Button Component
**Variants:**
- `primary`: Blue background, white text (main actions)
- `secondary`: Transparent with border (secondary actions)
- `danger`: Red background/border (destructive actions)
- `ghost`: Minimal styling, hover effect only

**Sizes:**
- `sm`: 32px height, 8px 12px padding
- `md`: 40px height, 10px 16px padding (default)
- `lg`: 44px height, 12px 20px padding (mobile-optimized)

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Accessibility:**
- Minimum 44x44px touch target on mobile
- Focus visible outline (2px solid primary color)
- Disabled state with reduced opacity and cursor: not-allowed
- Loading state with spinner and disabled interaction

#### 2.2 Card Component
**Props:**
```typescript
interface CardProps {
  variant?: 'default' | 'highlighted' | 'interactive';
  padding?: 'sm' | 'md' | 'lg';
  accentColor?: string;
  hoverable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Styles:**
- Glass-morphism effect: `background: rgba(5, 11, 22, 0.86)`
- Border: `1px solid rgba(148, 163, 184, 0.18)`
- Border radius: `var(--radius-3xl)` (22px)
- Hover state: Slightly lighter background, subtle scale transform
- Optional accent border for highlighted cards

#### 2.3 Badge Component
**Variants:**
- `success`: Green (active status)
- `warning`: Orange (pending status)
- `error`: Red (inactive/error status)
- `info`: Blue (informational)
- `neutral`: Gray (default)

**Props:**
```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

**Styles:**
- Small: 12px font, 4px 8px padding
- Medium: 13px font, 6px 10px padding
- Border radius: `var(--radius-sm)` (6px)
- Background: Semi-transparent variant color (22% opacity)
- Border: Variant color (44% opacity)
- Text: Full variant color

#### 2.4 Input Component
**Types:**
- Text input
- Email input
- Select dropdown
- Textarea

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}
```

**Styles:**
- Background: `var(--color-bg-input)`
- Border: `1px solid var(--color-border-input)`
- Focus border: `var(--color-border-focus)` with glow
- Error border: Red with error message below
- Label: 14px, semibold, above input
- Height: 40px (44px on mobile for better touch)

#### 2.5 Modal Component
**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

**Features:**
- Backdrop: Semi-transparent black overlay
- Close on backdrop click
- Close on ESC key press
- Focus trap (keyboard navigation contained)
- Smooth fade-in/out animation
- Responsive sizing (90% width on mobile, max-width on desktop)
- Scroll behavior: Modal content scrolls, backdrop fixed

**Accessibility:**
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` for title
- Focus management (focus first focusable element on open)
- Return focus to trigger element on close

#### 2.6 Table Component (Desktop) / Card List (Mobile)
**Desktop Table:**
- Sticky header on scroll
- Hover row highlight
- Sortable columns (future enhancement)
- Minimum column widths to prevent cramping

**Mobile Card Layout:**
- Stacked cards with all information visible
- Clear visual hierarchy
- Touch-friendly action buttons
- Swipe actions (future enhancement)

**Props:**
```typescript
interface TableProps {
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
  }>;
  data: Array<Record<string, any>>;
  onRowClick?: (row: any) => void;
  actions?: Array<{
    label: string;
    onClick: (row: any) => void;
    variant: 'primary' | 'danger';
  }>;
  loading?: boolean;
  emptyMessage?: string;
}
```

#### 2.7 Loading Skeleton Component
**Types:**
- Text skeleton (single line)
- Card skeleton (full card shape)
- Table skeleton (rows with columns)
- Metric skeleton (for dashboard stats)

**Props:**
```typescript
interface SkeletonProps {
  variant: 'text' | 'card' | 'metric' | 'table';
  count?: number;
  height?: string;
  width?: string;
}
```

**Animation:**
- Shimmer effect (gradient moving left to right)
- Subtle pulse animation
- Background: Slightly lighter than card background

#### 2.8 Toast Notification Component
**Variants:**
- `success`: Green with checkmark icon
- `error`: Red with X icon
- `warning`: Orange with warning icon
- `info`: Blue with info icon

**Props:**
```typescript
interface ToastProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // Auto-dismiss after ms
  onClose: () => void;
}
```

**Behavior:**
- Slide in from top-right
- Auto-dismiss after 4 seconds (configurable)
- Manual dismiss with X button
- Stack multiple toasts vertically
- Position: Fixed top-right (top-center on mobile)

#### 2.9 Confirmation Modal Component
**Props:**
```typescript
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}
```

**Features:**
- Replaces native `window.confirm()`
- Clear visual distinction for destructive actions
- Loading state during async operations
- Keyboard shortcuts (Enter to confirm, ESC to cancel)

### 3. Admin Dashboard Redesign

#### 3.1 Responsive Grid Layout
**Desktop (≥1200px):**
- Header: Full width, flex layout with logo, title, and actions
- Info cards: 3-column grid
- Metrics section: 3-column grid for stat cards

**Tablet (768px - 1199px):**
- Header: Stacked or wrapped layout
- Info cards: 2-column grid
- Metrics section: 2-column grid

**Mobile (<768px):**
- Header: Stacked layout, full-width buttons
- Info cards: Single column
- Metrics section: Single column
- Increased padding and spacing for touch

#### 3.2 Metric Cards Enhancement
**Visual Improvements:**
- Larger, more prominent numbers (40px on mobile, 32px on desktop)
- Color-coded accent indicators (colored dot or left border)
- Icon representation for each metric type
- Subtle hover effect with scale transform
- Loading skeleton during data fetch

**Responsive Behavior:**
- Full width on mobile with generous padding
- Minimum height to maintain consistency
- Stacked layout for label, value, and description

#### 3.3 Header Section
**Desktop:**
- Logo/title on left
- Status badge and action buttons on right
- Single row layout

**Mobile:**
- Logo/title full width
- Status badge below title
- Action buttons stacked or in button group
- Hamburger menu for navigation (future enhancement)

#### 3.4 Loading States
Replace "Loading metrics..." text with:
- Skeleton cards matching the layout
- Shimmer animation
- Maintain layout structure during loading

### 4. User Management Redesign

#### 4.1 Desktop Table View (≥768px)
**Enhancements:**
- Sticky header on scroll
- Hover row highlight with subtle background change
- Better column spacing and alignment
- Status badges instead of plain text
- Action buttons with icons
- Pagination controls at bottom

**Table Structure:**
```
| Avatar | Name | Email | Status | Created | Actions |
```

#### 4.2 Tablet View (768px - 1199px)
**Two-column card grid:**
- Each card shows user information
- Horizontal layout within card
- Actions on the right side
- Status badge prominent

#### 4.3 Mobile View (<768px)
**Single-column card list:**
- Full-width cards with vertical layout
- Avatar at top (if available)
- Name as heading
- Email, status, and date stacked
- Action buttons full-width at bottom
- Swipe gestures for quick actions (future)

**Card Structure:**
```
┌─────────────────────────┐
│ [Avatar]                │
│ John Doe                │
│ john@example.com        │
│ [Active Badge]          │
│ Joined: Jan 1, 2026     │
│ ┌─────┐ ┌──────┐       │
│ │ Edit│ │Delete│       │
│ └─────┘ └──────┘       │
└─────────────────────────┘
```

#### 4.4 Search and Filter
**Desktop:**
- Search bar in header
- Filter dropdowns inline
- Results count display

**Mobile:**
- Search bar full-width
- Filter button opens bottom sheet
- Sticky search bar on scroll

#### 4.5 Empty States
**No users found:**
- Centered icon/illustration
- Clear message
- Call-to-action button (if applicable)

**No search results:**
- "No results for '{query}'" message
- Clear filters button
- Suggestions for refining search

#### 4.6 Confirmation Modal
Replace `window.confirm()` with custom modal:
- Clear warning message
- User details displayed
- "Cancel" and "Delete User" buttons
- Red color scheme for destructive action
- Loading state during deletion

### 5. User Management Modal Improvements

#### 5.1 Enhanced UX
**Form Improvements:**
- Larger touch targets (44px height on mobile)
- Better spacing between fields
- Inline validation with error messages
- Success toast after save (instead of silent success)
- Disabled state for submit button during save

**Keyboard Shortcuts:**
- ESC to close modal
- Enter to submit form (when valid)
- Tab navigation through fields

#### 5.2 Responsive Behavior
**Desktop:**
- 500px max width
- Centered on screen
- Comfortable padding

**Mobile:**
- 95% width
- Larger padding for touch
- Full-height on small screens
- Bottom sheet style (future enhancement)

#### 5.3 Accessibility
- Focus trap within modal
- Focus first input on open
- Return focus to trigger button on close
- ARIA labels for all form fields
- Error announcements for screen readers

### 6. Accessibility Requirements

#### 6.1 Keyboard Navigation
- All interactive elements accessible via Tab
- Logical tab order
- Skip links for main content
- Keyboard shortcuts documented

#### 6.2 Screen Reader Support
- Semantic HTML elements
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Descriptive link text

#### 6.3 Focus Management
- Visible focus indicators (2px outline)
- Focus trap in modals
- Focus restoration after modal close
- Skip to main content link

#### 6.4 Color Contrast
- WCAG AA minimum (4.5:1 for normal text)
- WCAG AAA preferred (7:1 for normal text)
- Test all color combinations
- Don't rely on color alone for information

#### 6.5 Touch Targets
- Minimum 44x44px for all interactive elements
- Adequate spacing between touch targets (8px minimum)
- Larger targets on mobile devices

### 7. Technical Approach

#### 7.1 Styling Solution: CSS Modules
**Rationale:**
- Type-safe with TypeScript
- Scoped styles prevent conflicts
- Better than inline styles for maintainability
- No runtime overhead (unlike styled-components)
- Easier to adopt than Tailwind for existing codebase

**File Structure:**
```
src/
  styles/
    tokens.css          # Design tokens (CSS variables)
    global.css          # Global styles and resets
  components/
    Button/
      Button.tsx
      Button.module.css
    Card/
      Card.tsx
      Card.module.css
    ...
```

#### 7.2 Component Organization
```
src/
  components/
    ui/                 # Reusable UI components
      Button/
      Card/
      Badge/
      Input/
      Modal/
      Table/
      Skeleton/
      Toast/
      ConfirmationModal/
    layout/             # Layout components
      PageHeader/
      PageContainer/
```

#### 7.3 Responsive Utilities
Create utility classes/mixins for common responsive patterns:
```css
/* Responsive grid utility */
.grid-responsive {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Mobile-first media queries */
@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### 7.4 Migration Strategy
1. Create design tokens file first
2. Build component library incrementally
3. Migrate AdminDashboard page
4. Migrate UserManagement page
5. Migrate UserManagementModal
6. Remove all inline styles
7. Test responsive behavior at all breakpoints

## Acceptance criteria

- [ ] Design tokens file created with all CSS variables defined
- [ ] All 9 reusable components built and documented
- [ ] AdminDashboard responsive at mobile (1-col), tablet (2-col), and desktop (3-col)
- [ ] UserManagement table transforms to cards on mobile (<768px)
- [ ] All interactive elements have minimum 44x44px touch targets on mobile
- [ ] All buttons and cards have hover/focus states
- [ ] Loading skeletons replace all text-based loading states
- [ ] Custom confirmation modal replaces `window.confirm()`
- [ ] Toast notifications show after successful actions
- [ ] All components pass WCAG AA color contrast requirements
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators visible on all focusable elements
- [ ] Modal focus trap works correctly
- [ ] No inline styles remain in any component
- [ ] Responsive behavior tested on mobile (375px), tablet (768px), and desktop (1200px+)
- [ ] All components have proper TypeScript types
- [ ] Dark theme with glass-morphism aesthetic maintained

## Constraints

### Technical:
- Must use React with TypeScript
- Must maintain existing API integration
- Must use CSS Modules for styling (not Tailwind or styled-components)
- Must support modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Must work on iOS Safari and Chrome Android
- No breaking changes to existing routes or data structures

### Product:
- Must maintain current dark theme aesthetic
- Must preserve glass-morphism design language
- Must keep existing functionality (no feature removal)
- Must improve mobile experience without degrading desktop experience

### Delivery:
- Specification must be approved before implementation
- Implementation should be done incrementally (component library first)
- Each component should be tested in isolation before integration
- Responsive behavior must be tested at all breakpoints

## Risks and open questions

### Risks:
1. **CSS Modules adoption**: Team may not be familiar with CSS Modules
   - Mitigation: Provide examples and documentation
2. **Breaking existing styles**: Removing inline styles might cause regressions
   - Mitigation: Incremental migration with thorough testing
3. **Performance**: Loading skeleton animations might impact performance
   - Mitigation: Use CSS animations (GPU-accelerated), test on low-end devices
4. **Browser compatibility**: CSS custom properties and modern features
   - Mitigation: Test on target browsers, provide fallbacks if needed

### Open questions:
1. Should we add a component library documentation tool (Storybook)?
   - Recommendation: Yes, for long-term maintainability
2. Should we implement dark/light theme toggle now or later?
   - Decision: Out of scope for this redesign (dark theme only)
3. Should we add animation library (Framer Motion) for complex animations?
   - Decision: Use CSS animations first, evaluate need later
4. Should we implement real-time updates for user management?
   - Decision: Out of scope, can be added later
5. Should pagination be implemented now or later?
   - Recommendation: Include basic pagination in this redesign

## Related docs

- Task brief: [2026-05-31-admin-dashboard-redesign.md](../ai/tasks/2026-05-31-admin-dashboard-redesign.md) (to be created)
- Implementation plan: [2026-05-31-admin-dashboard-redesign.md](../plans/2026-05-31-admin-dashboard-redesign.md) (to be created)