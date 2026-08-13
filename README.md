# Lessora AI

<img src="./src/app/assets/LessoraLogo.png" alt="Lessora AI logo" width="300" />

Lessora AI is an AI-powered educational platform that helps teachers create organized, professional, and curriculum-ready lesson plans in minutes. By transforming simple teacher inputs into structured lesson plans, activities, objectives, and assessments, Lessora AI reduces preparation time and allows educators to focus more on teaching and student engagement. No account required to start generating.

## 🎯 Overview

Lessora AI provides teachers with two ways to access AI-powered lesson planning:
- **Web Portal**: React-based web application for browser access
- **Admin Dashboard**: Administrative interface for user management

The platform uses OpenAI's GPT models to generate comprehensive, curriculum-aligned lesson plans from minimal teacher input.

## ✨ Key Features

### For Teachers
- **AI-Powered Lesson Generation**: Create complete lesson plans from topic, grade level, duration, and learning goals — no account required
- **Multiple Templates**: Support for various lesson plan formats including DepEd semi-detailed templates
- **Lesson Plan History**: View, edit, refine, and reuse previously generated lesson plans (session-based)
- **Document Export**: Export lesson plans in DOC, PDF, and DOCX formats
- **Public Discover Page**: Browse lesson plans created by other teachers on the platform
- **AI Response Credits**: Fair usage system with daily credit reset (3 free generations per day without an account, 5 per day for registered teachers)
- **Web Access**: Browser-based access at any time

### For Administrators
- **User Management**: Create, view, and manage teacher accounts
- **Admin Dashboard**: Monitor platform usage and user activity
- **Separate Admin Portal**: Dedicated administrative interface

## 🏗️ Architecture

Lessora AI is now a single **Next.js 15 App Router monolith**. The Express server and Vite dev server have been merged into one process.

#### Technology
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + CSS custom properties (tokens in `src/app/globals.css`)
- **Visual language**: "Academic notebook" — paper background, navy ink, Source Serif 4 display, hairline rules. No cards, no pill chips, no gradients.
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT stored in HTTP-only cookies (admin), anonymous session tokens via localStorage (teachers)
- **AI Integration**: OpenAI API (GPT-4o-mini)
- **Email**: Resend for password reset and notifications
- **Payments**: PayMongo integration for support donations
- **Scheduling**: node-cron for credit refresh and activity reports
- **Data Fetching**: TanStack React Query

#### API Structure
```
/api/auth/login          - Admin + teacher login (sets HttpOnly cookie)
/api/auth/register       - Teacher registration
/api/auth/forgot-password - Password reset request
/api/auth/reset-password  - Password reset submit
/api/auth/verify-reset-token/[token] - Verify reset token
/api/auth/me             - Get current auth state
/api/ai/lesson-plan/config       - AI template configuration
/api/ai/lesson-plan/generate     - Generate lesson plan
/api/ai/lesson-plan/refine       - Refine existing plan
/api/ai/lesson-plan/history      - List user's plans
/api/ai/lesson-plan/history/:id  - Get plan detail
/api/ai/lesson-plan/public       - List public plans
/api/ai/lesson-plan/public/:id   - Get public plan detail
/api/ai/session/ensure           - Ensure/create anonymous session
/api/ai/session/me               - Get session info
/api/admin/stats                 - Admin stats (protected)
/api/admin/metrics/dashboard     - Dashboard metrics (protected)
/api/admin/metrics/landing       - Landing page metrics (public)
/api/admin/lesson-plans          - All lesson plans (protected)
/api/admin/users                 - List users (protected)
/api/admin/users/:id             - Update/delete user (protected)
/api/user/analytics              - User usage stats
/api/user/profile                - Update profile
/api/user/settings               - Update settings
/api/support/donations/config    - Donation config
/api/support/donations/checkout  - Create donation checkout
/api/support/donations/:ref      - Check donation status
/api/support/donations/webhook   - PayMongo webhook
/api/health                      - Health check
```

#### App Structure
```
src/
  app/
    (public)/
      home/page.tsx          — Landing page
      discover/page.tsx      — Public lesson plan browse
      support/page.tsx       — Donation page
      privacy-policy/page.tsx — Privacy policy
      terms-and-conditions/page.tsx — Terms
      about/page.tsx          — About page
    (teacher)/
      generate/page.tsx       — Lesson plan generation
      preview/[id]/page.tsx   — Lesson plan preview
      refine/[id]/page.tsx    — Lesson plan refinement
      dashboard/page.tsx      — Redirect to /generate
    (admin)/
      login/page.tsx          — Admin login
      admin/
        dashboard/page.tsx    — Admin dashboard
        users/page.tsx        — User management
        lesson-plans/page.tsx — Admin lesson plan oversight
    api/
      ...                     — All API route handlers
    components/               — Shared UI components
    hooks/                    — Custom React hooks
    lib/                      — API client, utils
  lib/
    schemas/                  — Mongoose schemas
    services/                 — Business logic services
    middleware/               — Auth, rate limiting, error handling
    schedulers.ts             — Cron job initialization
    db.ts                     — MongoDB connection
  emails/                     — Email templates
  middleware.ts               — Next.js middleware
  globals.css                 — Global styles + design tokens
  portal-theme.module.css     — Shared portal CSS utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- OpenAI API key
- Resend API key (for password reset emails)
- PayMongo API key (for donations)

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your values
```

### Environment Variables

Create a `.env` file in the root:

```env
MONGODB_URI=mongodb://localhost:27017/lessora
MONGODB_DBNAME=lessora
JWT_SECRET=change-me-in-production
ADMIN_EMAIL=admin@lessora.com
ADMIN_PASSWORD=LessoraAdmin123
ADMIN_FIRST_NAME=Lessora
ADMIN_LAST_NAME=Admin
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@lessora.com
PAYMONGO_SECRET_KEY=pk_test_...
PAYMONGO_API_BASE_URL=https://api.paymongo.com
CREDIT_REFRESH_START_DATE=2026-06-09T00:00:00+08:00
CREDIT_MAX_PER_USER=5
BASE_URL=http://localhost:3000
PUBLIC_APP_URL=http://localhost:3000
```

### Start the development server

```bash
npm run dev
```

The app runs on `http://localhost:3000`. No separate server or Vite process needed.

### Build for production

```bash
npm run build
npm start
```

## 🛠️ Development Workflow

### Project Structure
```
lessora-ai/
├── src/
│   ├── app/           — Next.js App Router (pages + API routes)
│   │   ├── (public)/  — Public pages (landing, discover, support, info)
│   │   ├── (teacher)/ — Teacher pages (generate, preview, refine)
│   │   ├── (admin)/   — Admin pages (dashboard, users, lesson plans)
│   │   ├── api/       — API route handlers
│   │   ├── components/ — Shared React components
│   │   ├── hooks/     — Custom hooks
│   │   └── lib/       — API client, utilities
│   ├── lib/
│   │   ├── schemas/   — Mongoose schemas
│   │   ├── services/  — Business logic
│   │   ├── middleware/ — Auth, rate limiting, error handling
│   │   └── db.ts      — MongoDB connection
│   ├── emails/        — Email templates
│   ├── middleware.ts  — Next.js middleware
│   └── globals.css    — Design tokens + global styles
├── docs/              — Documentation
├── .archiona/         — Archiona pre-coding gate
└── package.json
```

### Making Changes

For any feature work:

1. **Read the documentation**
   - `.archiona/workflow.md` — pre-coding gate rules
   - `docs/ai/commands.md` — available commands
   - `docs/ai/standards.md` — coding standards

2. **Create an Archiona plan**
   ```bash
   archiona plan --slug <topic> --title "<Title>"
   ```
   Fill every section, then tick `- [x] **Approved**`.

3. **Follow the layer order**
   - Server (lib/): Schemas → Services → Route Handlers
   - Client (app/): Pages → Components → Hooks

4. **Validate your changes**
   ```bash
   npm run build
   ```

### Testing

```bash
# Build and verify
npm run build

# Run dev server
npm run dev
```

## 📚 Documentation

- **[Project Context](docs/ai/project-context.md)** - Product overview and key facts
- **[Architecture](docs/ai/architecture.md)** - System design and module boundaries
- **[Quickstart](docs/ai/quickstart.md)** - Fastest path from idea to implementation
- **[Commands](docs/ai/commands.md)** - Available CLI commands
- **[Lessora Structure Workflow](docs/ai/lessora-structure-workflow.md)** - API development guidelines
- **[Architecture Flows](docs/ai/architecture-flows.md)** - Data flows and interfaces
- **[Standards](docs/ai/standards.md)** - Coding standards and conventions

## 🔑 Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + design tokens
- **State Management**: TanStack React Query
- **Database**: MongoDB + Mongoose
- **AI**: OpenAI API (GPT-4o-mini)
- **Authentication**: JWT (HTTP-only cookies), anonymous session tokens
- **Email**: Resend
- **Payments**: PayMongo
- **Scheduling**: node-cron

### Web design system (academic notebook)

The platform follows a single, restrained design language:

- **Paper + ink palette** — warm paper `#FAFAF7`, near-black ink `#111111`, single deep navy accent `#1E3A8A`.
- **Source Serif 4** for display. Inter for body, JetBrains Mono for IDs and small-caps eyebrows.
- **Hairline rules instead of cards.** Sections separated by 1px lines, not boxed containers.
- **Flat buttons, rectangular tags.** No gradients, no pill chips, no box-shadows.
- **Underline-only inputs** by default.

Tokens live in [`src/app/globals.css`](src/app/globals.css).

## 📄 License

This project is licensed under the Apache License 2.0. See [LICENSE](./LICENSE) for the full license text.

## 👥 Contributors

- Jims

---

**Note**: This is an active development project. Features and documentation are continuously evolving. Always refer to the latest documentation in the `docs/` directory for current implementation details.
