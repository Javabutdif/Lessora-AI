# Lessora AI

<img src="./client-side/src/assets/LessoraLogo.png" alt="Lessora AI logo" width="300" />

Lessora AI is an AI-powered educational platform designed to help teachers create organized, professional, and curriculum-ready lesson plans in minutes. By transforming simple teacher inputs into structured lesson plans, activities, objectives, and assessments, Lessora AI reduces preparation time and allows educators to focus more on teaching and student engagement.

## 🎯 Overview

Lessora AI provides teachers with multiple ways to access AI-powered lesson planning:
- **Mobile App**: React Native mobile application for iOS and Android
- **Web Portal**: React-based web application for browser access
- **Admin Dashboard**: Administrative interface for user management

The platform uses OpenAI's GPT models to generate comprehensive, curriculum-aligned lesson plans from minimal teacher input.

## ✨ Key Features

### For Teachers
- **AI-Powered Lesson Generation**: Create complete lesson plans from topic, grade level, duration, and learning goals
- **Multiple Templates**: Support for various lesson plan formats including DepEd semi-detailed templates
- **Lesson Plan History**: View, edit, refine, and reuse previously generated lesson plans
- **Document Export**: Export lesson plans in DOC, PDF, and DOCX formats
- **Analytics & Profile**: Track usage patterns and manage account settings
- **User Authentication**: Secure account registration and login with forgot/reset password flow
- **AI Response Credits**: Fair usage system with credit-based generation limits
- **Mobile & Web Access**: Use the mobile app or web portal based on preference
- **Offline-Ready**: Built with Expo for smooth performance on iOS and Android

### For Administrators
- **User Management**: Create, view, and manage teacher accounts
- **Admin Dashboard**: Monitor platform usage and user activity
- **Separate Admin Portal**: Dedicated administrative interface

## 🏗️ Architecture

Lessora AI follows a client-server architecture with three main components:

### Client Applications

#### Mobile App (`client-side/`)
- **Technology**: React Native with Expo SDK 54
- **UI Framework**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation with bottom tabs
- **Key Screens**:
  - Onboarding, landing, authentication (login/register/password reset)
  - Dashboard with home, generate, history, preview, refine, analytics, profile
  - Export functionality (DOC, PDF, DOCX)
- **Production Builds**: Configured for Expo Application Services (EAS) — cloud builds for Android APK/AAB and iOS

#### Web Portal (`client-side-admin/`)

- **Technology**: React 18 + TypeScript + Vite
- **Styling**: CSS Modules + CSS custom properties (tokens in `src/styles/tokens.css`)
- **Visual language**: "Academic notebook" — paper background, navy ink, Source Serif 4 display, hairline rules. No cards, no pill chips, no gradients. See [`client-side-admin/README.md`](client-side-admin/README.md) for the full design system.
- **Teacher features**: signup, login, password reset, AI lesson-plan generation, history, preview, refine plans, export
- **Admin features**: login, platform dashboard with metrics, user management, lesson plan oversight
- **Public pages**: landing page (hero + features + Android CTA), support donation, privacy / terms / about docs
- **Responsive design** for desktop and mobile browsers

### Server (`server-side/`)
- **Technology**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: OpenAI API (GPT-4o-mini)
- **Email**: Resend for password reset and notifications
- **Payments**: PayMongo integration for support donations
- **Scheduling**: Cron jobs for credit refresh and activity reports
- **Rate Limiting**: Per-route middleware with configurable windows
- **Architecture Pattern**: Routes → Controllers → Services → Schemas/Models

#### API Structure
```
/api/auth          - User authentication (register, login, password reset)
/api/user          - User-specific operations (lesson plans, credits)
/api/admin         - Admin operations (user management, metrics, lesson plans)
/api/ai            - AI lesson plan generation and history
/api/support       - Public support donation checkout and webhook flow
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- OpenAI API key
- Expo CLI (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lessora-ai
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server-side
   npm install

   # Install mobile app dependencies
   cd ../client-side
   npm install

   # Install web portal dependencies
   cd ../client-side-admin
   npm install
   ```

3. **Configure environment variables**

    Create `.env` files in the `server-side/`, `client-side/`, and `client-side-admin/` directories.
    
    See **[Environment Configuration](docs/ai/quickstart.md#environment-configuration)** for detailed setup instructions.

4. **Start the development servers**

    ```bash
    # Terminal 1: Start the backend server
    cd server-side
    npm run dev

    # Terminal 2: Start the mobile app
    cd ../client-side
    npm start

    # Terminal 3: Start the web portal
    cd ../client-side-admin
    npm run dev
    ```

### Mobile App: Production Builds

For Android and iOS production builds, the project uses [Expo Application Services (EAS)](https://expo.dev/eas):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android (APK)
eas build -p android --profile preview

# Build for Android (App Bundle)
eas build -p android --profile production

# Build for iOS
eas build -p ios
```

EAS workflows are defined in `client-side/.eas/workflows/create-production-builds.yml`.

### Quick Start with Scripts

The repository includes bootstrap scripts for quick setup:

**PowerShell (Windows)**
```powershell
./scripts/bootstrap.ps1
```

**Bash (macOS/Linux)**
```bash
./scripts/bootstrap.sh
```

## 🛠️ Development Workflow

### Project Structure
```
lessora-ai/
├── client-side/          # React Native mobile app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React contexts (Auth, Loading)
│   │   ├── navigation/   # Navigation configuration
│   │   ├── screens/      # Screen components (Auth, Dashboard, Landing)
│   │   ├── services/     # API service layer
│   │   ├── types/        # TypeScript declarations
│   │   └── utils/        # Utility functions (document export)
│   └── App.tsx           # App entry point
├── client-side-admin/    # React web portal (admin + teacher + landing)
│   ├── src/
│   │   ├── components/   # Reusable UI components (Button, Card, Input, Modal, ...)
│   │   ├── pages/        # Route components (Landing, Login, Register, Generate, History, Preview, Support, ...)
│   │   ├── services/     # API service layer
│   │   ├── styles/       # Design tokens + shared CSS modules
│   │   ├── types/        # Component prop types
│   │   └── utils/        # Helpers (e.g. SEO metadata)
│   ├── index.html        # Web entry point (loads Source Serif 4 + Inter + JetBrains Mono)
│   └── src/App.tsx       # Route definitions (public, teacher, admin)
├── server-side/          # Node.js backend
│   ├── src/
│   │   ├── app.ts        # Express app setup (middleware, routes, rate limiting)
│   │   ├── server.ts     # Server entry point
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, error handling, rate limiting
│   │   ├── routes/       # API routes (auth, ai, admin, user, support)
│   │   ├── schemas/      # Mongoose & Zod schemas
│   │   ├── services/     # Business logic (OpenAI, email, payments, schedulers)
│   │   ├── config/       # Configuration files
│   │   ├── bootstrap/    # Database seeding
│   │   ├── emails/       # Email templates
│   │   ├── types/        # Shared TypeScript types
│   │   └── utils/        # Utility functions
├── docs/                 # Documentation
│   ├── ai/              # AI agent documentation
│   ├── specs/           # Feature specifications
│   └── plans/           # Implementation plans
└── scripts/             # Automation scripts
```

### Making Changes

For any feature work involving client-server communication:

1. **Read the documentation**
   - `docs/ai/commands.md` - Available commands
   - `docs/ai/standards.md` - Coding standards
   - `docs/ai/lessora-structure-workflow.md` - API development workflow

2. **Create task artifacts**
   ```bash
   npm run workflow -- scaffold --slug <topic> --artifacts bundle
   ```

3. **Follow the layer order**
   - Server: Routes → Controllers → Services → Schemas/Models
   - Client: Screens → Services → API

4. **Validate your changes**
   ```bash
   # PowerShell
   ./scripts/check.ps1

   # Bash
   ./scripts/check.sh
   ```

### Testing

```bash
# Run all validation checks
npm run workflow -- check

# Type checking
cd client-side && npx tsc --noEmit
cd server-side && npx tsc --noEmit

# Run tests (when available)
npm test
```

## 📚 Documentation

- **[Project Context](docs/ai/project-context.md)** - Product overview and key facts
- **[Architecture](docs/ai/architecture.md)** - System design and module boundaries
- **[Quickstart](docs/ai/quickstart.md)** - Fastest path from idea to implementation
- **[Commands](docs/ai/commands.md)** - Available CLI commands
- **[Lessora Structure Workflow](docs/ai/lessora-structure-workflow.md)** - API development guidelines
- **[Architecture Flows](docs/ai/architecture-flows.md)** - Data flows and interfaces
- **[Standards](docs/ai/standards.md)** - Coding standards and conventions

### Task Management

The project uses a structured workflow for managing development tasks:

- **Specs** (`docs/specs/`) - What should change and why
- **Plans** (`docs/plans/`) - How the work will be carried out
- **Tasks** (`docs/ai/tasks/`) - Current execution state

Use the workflow CLI to manage these artifacts:
```bash
npm run workflow -- scaffold --slug <topic> --artifacts bundle
npm run workflow -- check
npm run workflow -- finalize
```

## 🔑 Key Technologies

- **Frontend (Mobile)**: React Native (Expo SDK 54), TypeScript, NativeWind (Tailwind CSS for RN), React Navigation, EAS
- **Frontend (Web)**: React 18, TypeScript, Vite, CSS Modules + design tokens, React Router DOM, React Query
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod validation
- **AI**: OpenAI API (GPT-4o-mini)
- **Authentication**: JWT, bcrypt
- **Email**: Resend
- **Payments**: PayMongo
- **Development**: Vite, Metro bundler, ESLint, Prettier

### Web design system (academic notebook)

The admin + web portal are intentionally built with a single, restrained design language rather than the typical SaaS gradient + card aesthetic:

- **Paper + ink palette** — warm paper `#FAFAF7`, near-black ink `#111111`, single deep navy accent `#1E3A8A`. No secondary indigo / teal / pink rounds.
- **Source Serif 4** for display (page titles, metric numbers, hero). Inter for body, JetBrains Mono for IDs and small-caps eyebrows.
- **Hairline rules instead of cards.** Sections are separated by 1 px lines, not boxed containers. A 3 px solid black top rule sits at the start of every page.
- **Flat buttons, rectangular tags.** No gradients, no pill chips, no `backdrop-filter`, no box-shadows.
- **Underline-only inputs** by default; a boxed variant exists for 3+ field forms (e.g. teacher registration).

Tokens live in [`client-side-admin/src/styles/tokens.css`](client-side-admin/src/styles/tokens.css). The full design system is documented in [`client-side-admin/README.md`](client-side-admin/README.md#design-system--academic-notebook).

Specs and plans that drove the current look are in `docs/specs/2026-06-29-client-side-admin-minimal-redesign.md`.

## 🤝 Contributing

1. Read the documentation in `docs/ai/`
2. Follow the structure workflow in `docs/ai/lessora-structure-workflow.md`
3. Create task briefs for non-trivial changes
4. Run validation checks before committing
5. Keep changes focused and well-documented

## 📄 License

This project is licensed under the Apache License 2.0. See [LICENSE](./LICENSE) for the full license text.

## 👥 Contributors

- Jims

---

**Note**: This is an active development project. Features and documentation are continuously evolving. Always refer to the latest documentation in the `docs/` directory for current implementation details.
