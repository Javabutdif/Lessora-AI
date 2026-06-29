# Lessora Admin Dashboard

A modern, mobile-responsive admin dashboard for the Lessora platform, built with React, TypeScript, and a comprehensive design system.

## Table of Contents

- [Project Overview](#project-overview)
- [Design System](#design-system)
- [Component Library](#component-library)
- [Pages](#pages)
- [Getting Started](#getting-started)
- [Development Guide](#development-guide)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Architecture Decisions](#architecture-decisions)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [Related Documentation](#related-documentation)

---

## Project Overview

The Lessora Admin Dashboard is a fully responsive web application designed for managing users, monitoring system metrics, and overseeing lesson plan generation. The dashboard features a modern dark theme with glass-morphism effects and a comprehensive component library built from the ground up.

### Key Features

- **Mobile-First Responsive Design**: Seamlessly adapts from mobile (375px) to desktop (1920px+)
- **Comprehensive Component Library**: 9 reusable UI components with consistent styling
- **Design System**: CSS custom properties for maintainable, scalable styling
- **Light Theme**: Clean white surfaces with restrained indigo accent and elevation by hairline borders + soft shadows (no glass-morphism)
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Performance Optimized**: Loading skeletons, optimized animations, and efficient rendering
- **Type-Safe**: Full TypeScript support with comprehensive type definitions

### Technology Stack

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.6.2
- **Build Tool**: Vite 5.4.10
- **Routing**: React Router DOM 6.28.0
- **Styling**: CSS Modules with CSS Custom Properties
- **State Management**: React Context API

---

## Design System

The admin dashboard uses a comprehensive design system built on CSS custom properties (CSS variables) for consistent, maintainable styling across all components.

### Design Tokens

All design tokens are defined in [`src/styles/tokens.css`](src/styles/tokens.css) and include:

#### Color Palette

The light theme uses a small, deliberate palette. Ink colors carry the visual hierarchy; indigo is the single accent; status colors expose text/bg/border triples so chips and banners stay readable on light surfaces.

**Page & surfaces**
- `--color-page`: `#F7F8FB` (app background)
- `--color-surface`: `#FFFFFF` (cards, modals, inputs)
- `--color-surface-hover`: `#F4F6FA`

**Ink (text)**
- `--color-ink-primary`: `#0B1220` (body & headings)
- `--color-ink-secondary`: `#475569` (helper text)
- `--color-ink-tertiary`: `#64748B` (captions)

**Accent — indigo**
- `--color-accent`: `#4F46E5`
- `--color-accent-hover`: `#4338CA`
- `--color-accent-pressed`: `#3730A3`
- `--color-accent-tint`: `#EEF2FF` (selected row, accent fill)
- `--color-accent-border`: `#C7D2FE`

**Status (text / bg / border)**

| Status | Text     | Background | Border     |
| ------ | -------- | ---------- | ---------- |
| Success | `#15803D` | `#ECFDF5`  | `#A7F3D0`  |
| Warning | `#B45309` | `#FFFBEB`  | `#FDE68A`  |
| Error   | `#B91C1C` | `#FEF2F2`  | `#FECACA`  |
| Info    | `#0E7490` | `#ECFEFF`  | `#A5F3FC`  |

#### Typography

- **Display**: `Inter Tight` (set in `--font-family-display`) — page hero numbers and section headings
- **Body**: `Inter` (system fallback stack in `--font-family-base`) — paragraphs, table cells, buttons
- **Mono**: `JetBrains Mono` (set in `--font-family-mono`) — tokens, IDs, eyebrow labels

**Font sizes**: `--font-size-xs: 12px`, `--font-size-sm: 13px`, `--font-size-base: 14px`, `--font-size-lg: 16px`, `--font-size-xl: 18px`, `--font-size-2xl: 24px`, `--font-size-5xl: 32px`.

**Font weights**: 400 / 500 / 600 / 700 / 800.

#### Spacing Scale

Consistent spacing using a 4px base unit:
- `--spacing-1`: 4px
- `--spacing-2`: 8px
- `--spacing-4`: 16px
- `--spacing-6`: 24px
- `--spacing-8`: 32px
- `--spacing-12`: 48px

#### Typography Scale

**Font Sizes**
- `--font-size-xs`: 12px
- `--font-size-sm`: 13px
- `--font-size-base`: 14px
- `--font-size-lg`: 16px
- `--font-size-2xl`: 24px
- `--font-size-5xl`: 32px

**Font Weights**
- `--font-weight-normal`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700

#### Breakpoints

Mobile-first responsive breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

---

## Component Library

The admin dashboard includes 9 reusable UI components, all accessible via a single import:

```typescript
import { Button, Card, Badge, Input, Modal, Table, Skeleton, Toast, ConfirmationModal } from './components/ui';
```

### 1. Button Component

Versatile button component with multiple variants and sizes.

**Variants**: `primary`, `secondary`, `ghost`, `danger`  
**Sizes**: `sm`, `md`, `lg`

```tsx
import { Button } from './components/ui';

<Button variant="primary" size="lg" onClick={handleClick}>
  Save Changes
</Button>

<Button variant="danger" loading={isDeleting}>
  Delete User
</Button>
```

**Features**:
- Minimum 44x44px touch targets on mobile
- Loading state with spinner
- Disabled state
- Icon support
- Full-width option

**File**: [`src/components/ui/Button.tsx`](src/components/ui/Button.tsx)

### 2. Badge Component

Status indicators with color-coded variants.

**Variants**: `success`, `warning`, `error`, `info`, `neutral`  
**Sizes**: `sm`, `md`, `lg`

```tsx
import { Badge } from './components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

**File**: [`src/components/ui/Badge.tsx`](src/components/ui/Badge.tsx)

### 3. Card Component

Glass-morphism cards with optional accent colors and hover effects.

```tsx
import { Card } from './components/ui';

<Card padding="lg" accentColor="var(--color-accent-blue)">
  <h3>Total Users</h3>
  <p>1,234</p>
</Card>
```

**Features**:
- Glass-morphism effect with backdrop blur
- Optional accent border
- Hover states
- Configurable padding

**File**: [`src/components/ui/Card.tsx`](src/components/ui/Card.tsx)

### 4. Input Component

Form inputs with validation and error states.

**Types**: Text, Email, Password, Select, Textarea

```tsx
import { Input, Select } from './components/ui';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
/>

<Select
  label="Status"
  value={status}
  onChange={setStatus}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
/>
```

**File**: [`src/components/ui/Input.tsx`](src/components/ui/Input.tsx)

### 5. Skeleton Component

Animated loading placeholders.

**Variants**: `text`, `metric`, `table`

```tsx
import { Skeleton } from './components/ui';

<Skeleton variant="metric" count={6} />
<Skeleton variant="table" count={5} />
```

**File**: [`src/components/ui/Skeleton.tsx`](src/components/ui/Skeleton.tsx)

### 6. Modal Component

Accessible modal dialogs with focus management.

```tsx
import { Modal } from './components/ui';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Edit User"
  size="md"
>
  {/* Modal content */}
</Modal>
```

**Features**:
- Focus trap for accessibility
- ESC key to close
- Backdrop click to close
- Responsive sizing (full-screen on mobile)
- Smooth animations

**File**: [`src/components/ui/Modal.tsx`](src/components/ui/Modal.tsx)

### 7. Toast Component

Notification toasts with auto-dismiss.

**Variants**: `success`, `error`, `warning`, `info`

```tsx
import { Toast } from './components/ui';

<Toast
  variant="success"
  message="User updated successfully"
  duration={4000}
  onClose={handleClose}
/>
```

**File**: [`src/components/ui/Toast.tsx`](src/components/ui/Toast.tsx)

### 8. ConfirmationModal Component

Confirmation dialogs for destructive actions.

```tsx
import { ConfirmationModal } from './components/ui';

<ConfirmationModal
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleDelete}
  title="Delete User"
  message="Are you sure you want to delete this user?"
  variant="danger"
  confirmText="Delete User"
/>
```

**File**: [`src/components/ui/ConfirmationModal.tsx`](src/components/ui/ConfirmationModal.tsx)

### 9. Table Component

Responsive table that transforms to cards on mobile.

```tsx
import { Table } from './components/ui';

<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' }
  ]}
  data={users}
  actions={[
    { label: 'Edit', onClick: handleEdit, variant: 'primary' },
    { label: 'Delete', onClick: handleDelete, variant: 'danger' }
  ]}
  loading={isLoading}
/>
```

**Features**:
- Desktop: Traditional table layout
- Mobile/Tablet: Card layout with stacked information
- Loading skeletons
- Empty states
- Action buttons per row

**File**: [`src/components/ui/Table.tsx`](src/components/ui/Table.tsx)

---

## Pages

### Admin Dashboard

**Route**: `/admin/dashboard`  
**File**: [`src/pages/AdminDashboard.tsx`](src/pages/AdminDashboard.tsx)

The main dashboard displays key metrics and system status.

**Features**:
- 6 metric cards with color-coded accents:
  - Total Users
  - Active Users
  - Lesson Plans
  - Published Plans
  - 7-Day Generations
  - Generation Rate
- Backend status indicator
- Responsive grid layout (3-col → 2-col → 1-col)
- Loading skeletons
- Navigation to User Management

**Responsive Behavior**:
- **Desktop (≥1024px)**: 3-column grid
- **Tablet (768-1023px)**: 2-column grid
- **Mobile (<768px)**: Single column stack

### User Management

**Route**: `/admin/users`  
**File**: [`src/pages/UserManagement.tsx`](src/pages/UserManagement.tsx)

Manage users with full CRUD operations.

**Features**:
- User list with status badges
- Edit user modal
- Delete confirmation modal
- Toast notifications
- Responsive table-to-card transformation

**Responsive Behavior**:
- **Desktop (≥1024px)**: Table view with columns
- **Mobile/Tablet (<1024px)**: Card view with stacked information

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd lessora-ai
   ```

2. **Navigate to the admin client directory**:
   ```bash
   cd client-side-admin
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

### Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Local**: `http://localhost:5174`
- **Network**: `http://<your-ip>:5174`

The dev server proxies `/api/*` requests to the backend at `http://localhost:4000`.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Environment Variables

Currently, no environment variables are required. The application uses hardcoded API endpoints that can be configured in [`src/services/api.ts`](src/services/api.ts).

---

## Development Guide

### Project Structure

```
client-side-admin/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Badge.tsx
│   │   │   ├── Badge.module.css
│   │   │   ├── Card.tsx
│   │   │   ├── Card.module.css
│   │   │   ├── Input.tsx
│   │   │   ├── Input.module.css
│   │   │   ├── Modal.tsx
│   │   │   ├── Modal.module.css
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Skeleton.module.css
│   │   │   ├── Table.tsx
│   │   │   ├── Table.module.css
│   │   │   ├── Toast.tsx
│   │   │   ├── Toast.module.css
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── ConfirmationModal.module.css
│   │   │   └── index.ts           # Component exports
│   │   ├── ProtectedRoute.tsx     # Admin route protection
│   │   ├── UserProtectedRoute.tsx # User route protection
│   │   ├── UserManagementModal.tsx
│   │   └── UserManagementModal.module.css
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminDashboard.module.css
│   │   ├── UserManagement.tsx
│   │   ├── UserManagement.module.css
│   │   ├── LoginPage.tsx
│   │   ├── UserLoginPage.tsx
│   │   ├── UserRegisterPage.tsx
│   │   ├── GeneratePlanPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── PreviewPage.tsx
│   │   └── LandingPage.tsx
│   ├── services/
│   │   └── api.ts                 # API client
│   ├── styles/
│   │   ├── tokens.css             # Design tokens
│   │   └── utilities.module.css   # Utility classes
│   ├── types/
│   │   └── components.ts          # TypeScript types
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── main.css                   # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Adding New Components

1. **Create component files**:
   ```bash
   # In src/components/ui/
   touch NewComponent.tsx NewComponent.module.css
   ```

2. **Define TypeScript types** in `src/types/components.ts`:
   ```typescript
   export interface NewComponentProps {
     variant?: 'default' | 'highlighted';
     children: React.ReactNode;
   }
   ```

3. **Implement the component**:
   ```tsx
   // NewComponent.tsx
   import React from 'react';
   import styles from './NewComponent.module.css';
   import type { NewComponentProps } from '../../types/components';

   export const NewComponent: React.FC<NewComponentProps> = ({
     variant = 'default',
     children
   }) => {
     return (
       <div className={`${styles.component} ${styles[variant]}`}>
         {children}
       </div>
     );
   };
   ```

4. **Style with CSS Modules**:
   ```css
   /* NewComponent.module.css */
   .component {
     padding: var(--spacing-4);
     background: var(--color-bg-card);
     border-radius: var(--radius-lg);
   }

   .highlighted {
     border: 1px solid var(--color-primary);
   }
   ```

5. **Export from index.ts**:
   ```typescript
   // src/components/ui/index.ts
   export { NewComponent } from './NewComponent';
   export type { NewComponentProps } from '../../types/components';
   ```

### Using Design Tokens

Always use CSS custom properties instead of hardcoded values:

```css
/* ❌ Don't do this */
.button {
  background: #60a5fa;
  padding: 16px;
  border-radius: 8px;
}

/* ✅ Do this */
.button {
  background: var(--color-primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}
```

### CSS Modules Conventions

1. **Use camelCase for class names**:
   ```css
   .primaryButton { }
   .cardHeader { }
   ```

2. **Compose styles when needed**:
   ```css
   .button {
     /* Base button styles */
   }

   .primaryButton {
     composes: button;
     background: var(--color-primary);
   }
   ```

3. **Use data attributes for variants**:
   ```tsx
   <button className={styles.button} data-variant={variant}>
     Click me
   </button>
   ```

   ```css
   .button[data-variant="primary"] {
     background: var(--color-primary);
   }
   ```

### TypeScript Type Definitions

All component types are centralized in [`src/types/components.ts`](src/types/components.ts). This ensures consistency and makes it easy to find type definitions.

```typescript
// Example type definition
export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
```

---

## Responsive Design

The admin dashboard uses a mobile-first responsive design strategy with three main breakpoints.

### Breakpoint Strategy

**Mobile-First Approach**: Base styles target mobile devices, with progressive enhancement for larger screens.

```css
/* Mobile styles (default) */
.container {
  padding: var(--spacing-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-6);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-8);
  }
}
```

### Layout Transformations

#### Admin Dashboard Grid

- **Desktop (≥1024px)**: 3-column grid for metrics
- **Tablet (768-1023px)**: 2-column grid
- **Mobile (<768px)**: Single column stack

#### User Management Table

- **Desktop (≥1024px)**: Traditional table layout
- **Mobile/Tablet (<1024px)**: Card layout with stacked information

#### Modal Sizing

- **Desktop (≥768px)**: Centered with max-width, backdrop blur
- **Mobile (<768px)**: Full-screen, no backdrop blur

#### Toast Positioning

- **Desktop (≥768px)**: Top-right corner
- **Mobile (<768px)**: Top-center

### Touch Target Guidelines

All interactive elements meet the minimum 44x44px touch target size on mobile devices:

- Buttons: 44px height on mobile
- Links: Minimum 44x44px clickable area
- Form inputs: 44px height on mobile
- Table action buttons: 44x44px minimum

### Testing Responsive Layouts

Use browser DevTools responsive mode to test at these key breakpoints:

- **375px**: iPhone SE
- **390px**: iPhone 12/13/14
- **768px**: iPad Mini
- **1024px**: iPad Pro
- **1200px**: Standard Desktop
- **1920px**: Full HD

---

## Accessibility

The admin dashboard is designed to meet WCAG AA accessibility standards.

### WCAG AA Compliance

- **Color Contrast**: All text meets 4.5:1 contrast ratio (normal text) or 3:1 (large text)
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Semantic HTML and ARIA labels throughout
- **Focus Management**: Visible focus indicators and proper focus order

### Keyboard Navigation

**Tab Navigation**:
- Tab through all interactive elements in logical order
- Shift+Tab to navigate backward
- No keyboard traps (except intentional modal focus traps)

**Keyboard Shortcuts**:
- **ESC**: Close modals and dialogs
- **Enter**: Submit forms, activate buttons
- **Space**: Activate buttons and checkboxes

### ARIA Labels and Roles

All components use appropriate ARIA attributes:

```tsx
// Modal example
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Edit User</h2>
  {/* Modal content */}
</div>

// Button with loading state
<button aria-busy={loading} disabled={loading}>
  {loading ? 'Saving...' : 'Save Changes'}
</button>

// Form input with error
<input
  aria-invalid={!!error}
  aria-describedby={error ? 'input-error' : undefined}
/>
{error && <span id="input-error" role="alert">{error}</span>}
```

### Focus Management

**Focus Indicators**: All focusable elements show a 2px outline when focused via keyboard:

```css
.button:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

**Modal Focus Trap**: When a modal opens:
1. Focus moves to the first focusable element in the modal
2. Tab navigation is trapped within the modal
3. Focus returns to the trigger element when modal closes

### Screen Reader Compatibility

Tested with:
- **NVDA** (Windows)
- **VoiceOver** (macOS/iOS)

All components announce their state and purpose clearly to screen readers.

---

## Testing

### Testing Documentation

Comprehensive testing documentation is available in the task brief:
- **Full Testing Guide**: [`docs/ai/tasks/2026-05-31-admin-dashboard-redesign.md`](../docs/ai/tasks/2026-05-31-admin-dashboard-redesign.md)

### Quick Testing Checklist

#### Responsive Testing
- [ ] Test at 375px (iPhone SE)
- [ ] Test at 768px (iPad Mini)
- [ ] Test at 1024px (iPad Pro)
- [ ] Test at 1200px+ (Desktop)
- [ ] Verify no horizontal scroll at any breakpoint
- [ ] Verify touch targets are 44x44px minimum on mobile

#### Functionality Testing
- [ ] Admin Dashboard loads and displays metrics
- [ ] User Management table/cards display correctly
- [ ] Edit user modal works
- [ ] Delete confirmation modal works
- [ ] Toast notifications appear and auto-dismiss
- [ ] Navigation between pages works

#### Accessibility Testing
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] ESC key closes modals
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Performance Benchmarks

**Build Output**:
- JavaScript Bundle: 232.76 kB (68.61 kB gzipped)
- CSS Bundle: 31.43 kB (6.01 kB gzipped)
- Build Time: ~2.2 seconds

**Target Metrics**:
- Initial Load: < 3 seconds
- Lighthouse Performance: > 80
- Lighthouse Accessibility: > 90

---

## Architecture Decisions

### Why CSS Modules Over Tailwind/Styled-Components?

**CSS Modules** were chosen for several reasons:

1. **Type Safety**: Full TypeScript support with typed class names
2. **Scoped Styles**: Automatic class name scoping prevents conflicts
3. **No Runtime Overhead**: Styles are extracted at build time (unlike styled-components)
4. **Easier Migration**: Simpler to adopt than Tailwind for existing codebase
5. **Design Tokens**: Works seamlessly with CSS custom properties
6. **Better for Component Libraries**: Clear separation of styles and logic

### Component Library Approach

**Centralized Component Library**: All reusable UI components are in `src/components/ui/` with a single export point (`index.ts`).

**Benefits**:
- Single import statement for all components
- Consistent API across components
- Easy to maintain and update
- Type-safe with centralized type definitions

### Responsive Strategy: Table-to-Card Transformation

**Desktop**: Traditional table layout for data-dense views  
**Mobile**: Card layout for better readability and touch interaction

**Why This Approach?**:
- Tables are difficult to use on mobile (horizontal scrolling, small touch targets)
- Cards provide better information hierarchy on small screens
- Maintains all functionality while improving UX
- Smooth transformation at breakpoint (no jarring layout shifts)

### State Management Approach

**React Context API** for global state (authentication, user data)  
**Local Component State** for UI state (modals, forms, loading states)

**Why Not Redux/Zustand?**:
- Application state is relatively simple
- Context API provides sufficient functionality
- Reduces bundle size and complexity
- Easier for new developers to understand

---

## File Structure

### Key Directories

**`src/components/ui/`**: Reusable UI component library  
**`src/pages/`**: Page components (routes)  
**`src/styles/`**: Design tokens and global styles  
**`src/types/`**: TypeScript type definitions  
**`src/services/`**: API client and services

### Naming Conventions

**Components**: PascalCase (e.g., `Button.tsx`, `UserManagement.tsx`)  
**CSS Modules**: PascalCase with `.module.css` suffix (e.g., `Button.module.css`)  
**Types**: PascalCase with descriptive suffixes (e.g., `ButtonProps`, `UserData`)  
**CSS Classes**: camelCase (e.g., `.primaryButton`, `.cardHeader`)  
**CSS Variables**: kebab-case with prefixes (e.g., `--color-primary`, `--spacing-4`)

---

## Contributing

### Code Style Guidelines

1. **Use TypeScript**: All new code should be TypeScript
2. **Use Design Tokens**: Always use CSS custom properties
3. **Follow Component Structure**: Component + CSS Module + Types
4. **Write Accessible Code**: Include ARIA labels, keyboard support
5. **Test Responsively**: Test at all breakpoints
6. **Document Complex Logic**: Add comments for non-obvious code

### Component Creation Guidelines

When creating a new component:

1. Define TypeScript types in `src/types/components.ts`
2. Create component file with `.tsx` extension
3. Create CSS Module file with `.module.css` extension
4. Use design tokens for all styling
5. Ensure accessibility (ARIA, keyboard navigation)
6. Test at all responsive breakpoints
7. Export from `src/components/ui/index.ts`

### Pull Request Process

1. Create a feature branch from `main`
2. Implement changes following code style guidelines
3. Test thoroughly (responsive, accessibility, functionality)
4. Update documentation if needed
5. Submit pull request with clear description
6. Address review feedback
7. Merge after approval

---

## Related Documentation

### Specification
- **Admin Dashboard Redesign Spec**: [`docs/specs/2026-05-31-admin-dashboard-redesign.md`](../docs/specs/2026-05-31-admin-dashboard-redesign.md)
  - Complete specification with design system details
  - Component requirements and acceptance criteria
  - Accessibility requirements

### Implementation Plan
- **Implementation Plan**: [`docs/plans/2026-05-31-admin-dashboard-redesign.md`](../docs/plans/2026-05-31-admin-dashboard-redesign.md)
  - 5-phase implementation strategy
  - Task breakdown and timeline
  - Risk mitigation strategies

### Testing Documentation
- **Testing & Validation**: [`docs/ai/tasks/2026-05-31-admin-dashboard-redesign.md`](../docs/ai/tasks/2026-05-31-admin-dashboard-redesign.md)
  - Comprehensive testing checklists
  - Manual testing instructions
  - Browser compatibility matrix
  - Accessibility testing guide

### External Resources
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **React Documentation**: https://react.dev/
- **TypeScript Documentation**: https://www.typescriptlang.org/docs/
- **Vite Documentation**: https://vitejs.dev/

---

## License

This project is part of the Lessora platform. See the main repository LICENSE file for details.

---

**Last Updated**: 2026-05-31  
**Version**: 1.0.0  
**Status**: Production Ready

---

*Built with ❤️ by the Lessora team*
