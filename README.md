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
- **Lesson Plan History**: View, edit, and reuse previously generated lesson plans
- **Document Export**: Export lesson plans in DOC, PDF, and DOCX formats
- **User Authentication**: Secure account registration and login
- **AI Response Credits**: Fair usage system with credit-based generation limits
- **Mobile & Web Access**: Use the mobile app or web portal based on preference

### For Administrators
- **User Management**: Create, view, and manage teacher accounts
- **Admin Dashboard**: Monitor platform usage and user activity
- **Separate Admin Portal**: Dedicated administrative interface

## 🏗️ Architecture

Lessora AI follows a client-server architecture with three main components:

### Client Applications

#### Mobile App (`client-side/`)
- **Technology**: React Native with Expo SDK 54.0.0
- **UI Framework**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation with bottom tabs
- **Key Screens**:
  - Onboarding and authentication
  - Dashboard with recent plans
  - Lesson plan generation
  - History and preview
  - Export functionality

#### Web Portal (`client-side-admin/`)

- **Technology**: React 18 + TypeScript + Vite
- **Styling**: CSS Modules + CSS custom properties (tokens in `src/styles/tokens.css`)
- **Visual language**: "Academic notebook" — paper background, navy ink, Source Serif 4 display, hairline rules. No cards, no pill chips, no gradients. See [`client-side-admin/README.md`](client-side-admin/README.md) for the full design system.
- **Features**:
  - Teacher portal: signup, login, password reset, AI lesson-plan generation, history, preview, export
  - Admin portal: login, platform dashboard with metric cards, user management with edit/delete
  - Public: landing page (hero + features + Android CTA), support donation page, privacy / terms / about docs
  - Responsive design for desktop and mobile browsers

### Server (`server-side/`)
- **Technology**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: OpenAI API (GPT-4o-mini)
- **Architecture Pattern**: Routes → Controllers → Services → Schemas/Models

#### API Structure
```
/api/auth          - User authentication (register, login)
/api/admin         - Admin operations (user management)
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
   
   See **[Environment Configuration](docs/ai/quickstart.md#environment-configuration)** for detailed setup instructions and security guidelines.

4. **Start the development servers**

   ```bash
   # Terminal 1: Start the backend server
   cd server-side
   npm run dev

   # Terminal 2: Start the mobile app
   cd client-side
   npm start

   # Terminal 3: Start the web portal
   cd client-side-admin
   npm run dev
   ```

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
│   │   ├── screens/      # Screen components
│   │   ├── services/     # API service layer
│   │   └── utils/        # Utility functions
│   └── App.tsx           # App entry point
├── client-side-admin/    # React web portal (admin + teacher + landing)
│   ├── src/
│   │   ├── components/   # Reusable UI components (Button, Card, Input, Modal, ...)
│   │   ├── pages/        # Route components (Landing, Login, Register, Generate, History, Preview, ...)
│   │   ├── services/     # API service layer
│   │   ├── styles/       # Design tokens + shared CSS modules
│   │   └── utils/        # Helpers (e.g. SEO metadata)
│   └── index.html        # Web entry point (loads Source Serif 4 + Inter + JetBrains Mono)
├── server-side/          # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── schemas/      # Mongoose & Zod schemas
│   │   ├── services/     # Business logic
│   │   └── config/       # Configuration files
│   └── server.ts         # Server entry point
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

- **Frontend**: React Native (Expo), React, TypeScript, NativeWind (mobile), CSS Modules + tokens (web)
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose
- **AI**: OpenAI API (GPT-4o-mini)
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
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
