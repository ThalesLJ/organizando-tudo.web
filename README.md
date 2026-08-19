# Organizando Tudo Web

Organizando Tudo Web is a modern, multilingual Next.js web application for personal productivity and organization. It provides secure authentication, rich-text note taking, comprehensive financial budgeting and expense tracking, and personalized user preferences (themes and languages). The application incorporates a robust Backend for Frontend (BFF) layer that encapsulates and protects all communication with the backend API.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **UI Library**: [React](https://react.dev/) 19
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4 with dynamic CSS variables
- **Rich Text Editor**: [TipTap](https://tiptap.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Code Quality**: ESLint with Next.js Core Web Vitals and TypeScript configuration

## Architecture

This application follows a strict **Backend for Frontend (BFF)** architecture pattern. Client-side browser code never calls external backend services directly; all client requests flow through internal Next.js server-side route handlers.

```text
Browser Client -> Next.js BFF (Route Handlers) -> External API -> Next.js BFF -> Browser Client
```

### Architectural Highlights

- **Secure Session Isolation**: Authentication tokens are stored exclusively in `HttpOnly` cookies and forwarded as Bearer tokens to external APIs on the server side, keeping tokens completely inaccessible to client-side JavaScript.
- **Route Protection**: Edge middleware (`src/middleware.ts`) and server-side authentication guards intercept private page requests, automatically redirecting unauthenticated users to `/login`.
- **Internationalization (i18n)**: Centralized multilingual dictionary catalog (`en`, `pt`, `es`) supporting runtime locale switching with automatic cookie persistence and English fallback.
- **Dynamic Theming**: UI palette customization powered by CSS custom properties and client-side preference synchronization.

## Main Routes

### Public Pages

- `/login` — User authentication and login form
- `/register` — Account registration
- `/recover` — Password reset and recovery flow
- `/view-note/:id` — Public read-only note viewer
- `/policy` — Privacy policy (English route)
- `/politica` — Privacy policy (Portuguese route)

### Private Pages (Protected)

- `/dashboard` — Financial overview, budget progress, and quick statistics
- `/financial` — Full budget and expense management
- `/notes` — Note management, search, filtering, and sorting
- `/add-note` — Rich-text note creation
- `/add-note/:id` — Note creation with parent reference
- `/edit-note/:id` — Note editing and visibility management
- `/settings` — User profile, language selection, and theme color customization

### Internal BFF API Routes

- `/api/auth/*` — Session login, registration, recovery, and logout
- `/api/budgets/*` — Budget CRUD operations proxy
- `/api/expenses/*` — Expense tracking operations proxy
- `/api/notes/*` — Note CRUD and public note access proxy
- `/api/user/*` — User profile and preferences endpoints
- `/api/health` — Internal service health check endpoint

## Project Structure

```text
organizando-tudo.web/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD deployment workflow for self-hosted Linux runner
├── .specify/                       # Spec Kit memory, configurations, and templates
│   └── memory/
│       └── constitution.md         # Project constitution and architectural principles
├── specs/                          # Specification-Driven Development feature specs
├── src/
│   ├── app/
│   │   ├── (private)/              # Authenticated route group
│   │   │   ├── add-note/           # Add note page
│   │   │   ├── dashboard/          # Private dashboard page with financial summaries
│   │   │   ├── edit-note/          # Edit note page
│   │   │   ├── financial/          # Financial manager (budgets & expenses)
│   │   │   ├── notes/              # Notes management list page
│   │   │   ├── settings/           # User preferences and profile settings page
│   │   │   ├── view-note/          # Private note viewer page
│   │   │   └── layout.tsx          # Private dashboard layout with navigation header
│   │   ├── api/                    # Backend for Frontend (BFF) internal API route handlers
│   │   │   ├── auth/               # Auth routes (login, register, recover, logout)
│   │   │   ├── budgets/            # Budget management proxy endpoints
│   │   │   ├── expenses/           # Expense tracking proxy endpoints
│   │   │   ├── health/             # Internal health check endpoint
│   │   │   ├── notes/              # Note CRUD and public note endpoints
│   │   │   └── user/               # User profile and preferences endpoints
│   │   ├── login/                  # Public login page
│   │   ├── policy/                 # Privacy policy page (English route)
│   │   ├── politica/               # Privacy policy page (Portuguese route)
│   │   ├── recover/                # Password recovery page
│   │   ├── register/               # User registration page
│   │   ├── view-note/              # Public note viewer route
│   │   ├── globals.css             # Tailwind CSS styles and dynamic CSS variables
│   │   ├── layout.tsx              # Root layout with font definitions and providers
│   │   └── page.tsx                # Root redirect page
│   ├── components/                 # Reusable UI and domain components
│   │   ├── app-loading.tsx         # Global loading screen component
│   │   ├── auth-page-shell.tsx     # Layout wrapper for authentication screens
│   │   ├── dashboard-financial.tsx # Financial summary card widgets
│   │   ├── financial-manager.tsx   # Budget and expense management UI
│   │   ├── language-switcher.tsx   # Locale selector dropdown
│   │   ├── login-form.tsx          # Authentication form
│   │   ├── logout-button.tsx       # Session termination button
│   │   ├── note-editor.tsx         # TipTap rich-text note editor
│   │   ├── note-viewer.tsx         # Note display component
│   │   ├── notes-manager.tsx       # Note listing, search, and sorting UI
│   │   ├── privacy-policy-content.tsx # Privacy policy content renderer
│   │   ├── recover-form.tsx        # Password recovery form
│   │   ├── register-form.tsx       # User registration form
│   │   ├── settings-panel.tsx      # Preferences and account settings UI
│   │   └── user-preferences-runtime.tsx # Client-side runtime theme & preference loader
│   ├── lib/                        # Shared utilities, schemas, and helpers
│   │   ├── auth-config.ts          # Auth cookie configuration constants
│   │   ├── auth.ts                 # Server-side cookie and session helpers
│   │   ├── external-api.ts         # External API client for BFF route handlers
│   │   ├── http.ts                 # Standard HTTP fetch wrapper
│   │   ├── locale-client.ts        # Client-side locale detection and cookie updater
│   │   ├── messages.ts             # Centralized i18n dictionaries (en, pt, es)
│   │   ├── policy-content.ts       # Privacy policy localized copy
│   │   ├── require-auth.ts         # Server-side authentication guard helper
│   │   └── schemas.ts              # Zod validation schemas
│   └── middleware.ts               # Next.js edge middleware for route protection
├── .env.example                    # Template environment variables file
├── eslint.config.mjs               # ESLint configuration
├── next.config.ts                  # Next.js application configuration
├── package.json                    # Project metadata, dependencies, and npm scripts
├── postcss.config.mjs              # PostCSS configuration for Tailwind CSS
├── README.md                       # Project documentation
└── tsconfig.json                   # TypeScript compiler configuration
```

## Environment Variables

Create a local `.env` file in the project root based on [`.env.example`](./.env.example):

```env
PORT=3001
NEXT_PUBLIC_APP_URL=http://localhost:3001
EXTERNAL_USER_API_URL=http://localhost:3000
```

### Variable Descriptions

- `PORT`: Port used by the Next.js application during local execution and under PM2 process management.
- `NEXT_PUBLIC_APP_URL`: Public-facing application URL consumed by client components.
- `EXTERNAL_USER_API_URL`: Backend API base URL consumed by server-side BFF route handlers.
- `NEXT_PUBLIC_SITE_URL` *(Optional)*: Canonical site URL used for OpenGraph and metadata resolution.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 LTS or 22 LTS recommended)
- `npm` (version 10+)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd organizando-tudo.web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your local environment:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Available Scripts

```bash
# Starts the Next.js development server on port 3001
npm run dev

# Compiles the production build
npm run build

# Starts the compiled production application
npm run start

# Runs ESLint across the codebase
npm run lint
```

## Deployment

The project includes an automated deployment pipeline powered by GitHub Actions defined in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

- **Target Architecture**: Self-hosted Linux runner with PM2 process supervisor.
- **Workflow Triggers**: Automatic on push to `master`, or manual via `workflow_dispatch`.
- **Deployment Flow**:
  1. Synchronizes project source to active release directory (excluding caches and dependencies).
  2. Injects production environment configuration from `WEB_ENV_FILE`.
  3. Installs clean production dependencies (`npm install`) and builds the Next.js application (`npm run build`).
  4. Restarts the PM2 process with zero-downtime reload under `WEB_PM2_APP_NAME`.
  5. Runs post-deployment health check against `https://organizandotudo.thaleslj.com/api/health`.

## SDD (Microsoft Speckit)

This project is developed using **Specification-Driven Development (SDD)** with Microsoft Spec Kit. All features, architecture modifications, and bug fixes must originate from structured specifications before code changes are applied.

- **Agent Guidance & Setup**: [`AGENTS.md`](./AGENTS.md)
- **Project Constitution**: [`.specify/memory/constitution.md`](./.specify/memory/constitution.md)
- **Feature Specifications**: [`specs/`](./specs/)

Main Spec Kit commands:

```text
/speckit.constitution - Establish or update project principles
/speckit.specify      - Create a baseline feature specification
/speckit.plan         - Create technical implementation plan
/speckit.tasks        - Generate actionable task breakdown
/speckit.implement    - Execute implementation tasks
```
