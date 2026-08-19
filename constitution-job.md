<!--
Sync Impact Report
- Version change: 1.1.1 → 1.1.2
- Modified sections: Technology Stack, Backend Integration Contract, Architectural Guidelines,
  Files & Uploads, Anti-Regression Checklist, Governance (removed exact dependency versions,
  ports, nginx, PM2, docker-compose, and Deployment Reference)
- Removed sections: Deployment Reference, Relevant dependency versions table,
  Prerequisites & Runtime Reference (port conventions)
-->

# DGDOC Frontend Constitution

## Core Principles

### I. English Code, Portuguese UI

All class names, properties, methods, variables, business rules, entities, and Spec Kit
artifacts (specifications, research, plans, data models) MUST be written in **English**.
All end-user visible content (labels, messages, validation text, notifications, page copy)
MUST be written in **Portuguese**.

**Rationale**: English keeps the codebase and cross-project contracts consistent with the
backend and robot services; Portuguese matches the operational audience of the DGDOC portal.

### II. Strict Typing & Naming Conventions

Code MUST follow the naming conventions of each technology (PascalCase for React
components/types, camelCase for functions and variables, kebab-case for file-based routes,
UPPER_SNAKE_CASE for environment variables).

TypeScript `strict` mode MUST remain enabled. The JavaScript `var` keyword and the
TypeScript `any` type are **prohibited** (equivalent to forbidden `var`/`dynamic` usage in
strongly typed stacks). Prefer explicit types, interfaces, and Zod schemas for runtime
validation at boundaries.

**Rationale**: The project already runs with `strict: true` in `tsconfig.json`; explicit
typing prevents regressions across the large API surface shared with the NestJS backend.

### III. Layered Frontend Architecture

The portal MUST preserve the established separation of concerns:

- **App Router pages** under `src/app/` for routing and server components.
- **Feature components** under `src/components/features/` for domain UI (shippers, companies,
  products, settings, users, auth).
- **API clients** under `src/lib/api/` for typed HTTP access to backend resources.
- **Server-side proxy routes** under `src/app/api/**` (primarily `src/app/api/proxy/**`)
  when the browser must not call the backend directly or when the session token must be
  injected server-side via `auth()`.
- **Shared types** under `src/types/` for domain models consumed by UI and API layers.

Key frontend files that MUST remain the integration anchor points:

- `src/auth.ts` — NextAuth configuration (login, refresh, logout, profile).
- `src/middleware.ts` — route protection (redirect to `/login` without session).
- `src/lib/api/config.ts` — `API_BASE_URL` and `apiUrl()` helper.
- `src/lib/api/http.ts` — HTTP client with Bearer token and 401 retry.
- `next.config.ts` — `images.remotePatterns` and CI flags (`SKIP_TYPE_CHECK`).

New features MUST extend these layers instead of introducing ad-hoc fetch logic inside
presentation components.

**Rationale**: The current codebase consistently centralizes HTTP concerns in `src/lib/api/`
and protects tokens via Next.js route handlers; breaking this pattern causes auth and CORS
regressions.

### IV. Backend Integration Contract

All backend communication MUST respect the live integration contract defined in this
constitution and verified against the codebase:

- Base URL from `NEXT_PUBLIC_API_URL` via `apiUrl()` in `src/lib/api/config.ts`
  (embedded in the client bundle at build time).
- Authentication through NextAuth v5 Credentials (`src/auth.ts`) with JWT access/refresh
  tokens issued by the NestJS backend.
- Global backend route prefix `apiv1` configured in `bomi-sddg-backend/src/main.ts` via
  `app.setGlobalPrefix('apiv1', ...)`, with **exception**: `GET uploads/(.*)` excluded from
  the prefix.
- Coordinated changes across frontend proxy routes, direct client calls, and backend controllers
  when routes, headers, or file-serving paths change.

Authentication endpoints the frontend MUST keep aligned with the backend:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `PATCH /api/auth/profile` (supports `multipart/form-data`)

Profile updates are implemented in `src/auth.ts` and proxied via routes such as
`src/app/api/proxy/auth/profile/route.ts`.

Proxy routes under `src/app/api/proxy/**` MUST:

1. Call `auth()` on the server (NextAuth v5).
2. Extract `session.accessToken`.
3. Forward to the backend with `Authorization: Bearer <token>`.

Representative proxy mappings (Next path → backend target):

- `/api/proxy/shippers` → `${API_BASE_URL}/shippers`
- `/api/proxy/uploads/*` → `${API_BASE_URL}/uploads/*`

Client-side HTTP MUST use `httpJson()` from `src/lib/api/http.ts` for authenticated calls,
including 401 retry and session refresh behavior already implemented there.

**Rationale**: Misaligned routes between frontend, backend prefix, and upload
exceptions are a known high-risk regression area for this system.

### V. Security by Default

Sensitive data (tokens, passwords, secrets, PII) MUST NOT appear in source code, logs,
user-visible error messages, or client-side storage beyond what NextAuth/session already
requires.

Environment variables (`NEXTAUTH_SECRET`, `SESSION_PASSWORD`, `NEXT_PUBLIC_API_URL`, email
credentials) MUST be read from `.env.local` / `.env.production.local` and validated at
runtime where the codebase already enforces minimum lengths or presence
(`NEXTAUTH_SECRET` and `SESSION_PASSWORD` minimum 32 characters).

Route protection MUST remain in `src/middleware.ts` for non-public paths. Server proxy
routes MUST reject unauthenticated requests with `401` before forwarding to the backend.
Role-based UI restrictions (e.g., `userType`) MUST be enforced consistently in middleware
and components, including cookie usage patterns verified in `src/middleware.ts`.

Generic `try/catch` blocks that swallow errors without appropriate handling or user-safe
messaging are prohibited.

**Rationale**: The application handles dangerous-goods compliance documents; auth and data
handling failures must fail closed, not leak internals.

### VI. Simplicity & Focused Change

Implement the minimum change that satisfies the specification. Do not refactor unrelated
modules, rename broad surfaces, or introduce new abstractions unless the feature requires
them.

Prefer existing UI primitives (`src/components/ui/`, `src/components/form/`) and hooks
(`src/lib/hooks/`) over duplicate implementations. Avoid over-engineering and YAGNI
violations.

Avoid isolated adjustments in a single project when the change touches routes, headers,
tokens, CORS, or file paths — those changes MUST be coordinated across frontend and backend.

**Rationale**: The frontend is a large, production portal in a multi-repo workspace; small,
coordinated diffs reduce QA risk in a manual-validation workflow.

### VII. Manual Quality Assurance

Automated test suites are **not** configured in this repository. Quality assurance relies on
manual validation and production QA unless the user explicitly requests automated tests.

Business logic MUST still be written for future testability: low coupling, high cohesion,
pure functions where practical, and thin route handlers delegating to reusable modules.

`tasks.md` MUST NOT plan or request automated tests (unit, integration, e2e) unless the user
explicitly asks for them. Instead, `tasks.md` MUST include manual validation steps
equivalent to the acceptance scenarios in `spec.md`.

**Rationale**: Reflects the current `package.json` scripts and project QA practice while
keeping code structurally testable if automation is introduced later.

## Architectural Guidelines

### Technology Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS |
| Auth | NextAuth v5 (Credentials provider) + iron-session |
| Forms / validation | react-hook-form, Zod, `@hookform/resolvers` |
| Charts / calendar | ApexCharts, FullCalendar |
| Package manager | npm (`package-lock.json`) |

### DGDOC Workspace Context

DGDOC is formed by **three independent Node.js projects**, each with its own `package.json`
and `package-lock.json`:

| Project | Path | Role |
|---------|------|------|
| Frontend | `bomi-sddg-frontend/` | Next.js App Router portal (this repository) |
| Backend | `bomi-sddg-backend/` | NestJS API + MongoDB (Mongoose) + PDF (Puppeteer) + files |
| Robot | `bomi-sddg-robo/` | Scheduled Node/TS process writing to MongoDB |

The workspace goal is to prevent regressions caused by inconsistent routes, environment
variables, and MongoDB integration. The frontend communicates with the backend via
HTTP; the robot integrates with the backend **indirectly through MongoDB**, not via HTTP
from the frontend.

### Sibling Projects & Responsibilities

Understanding backend and robot behavior is mandatory when changing dashboard metrics,
shipper data flows, settings, or file handling in the frontend.

**Backend (`bomi-sddg-backend`)**

- NestJS API with global validation, CORS, throttling, logging interceptors, and Mongoose.
- Domains include `auth`, `users`, `companies`, `products`, `shippers`, `settings`,
  `notifications`, `dashboard`, `files`, and related modules.
- Serves files via:
  - `GET /uploads/...` (`StaticFilesController`, `JwtAuthGuard`)
  - `GET /files?path=...` (`FilesByPathController`, `JwtAuthGuard`, binary by path)
- Operational settings stored in MongoDB `settings` collection (e.g., key `Files Path`).
- Key files: `src/main.ts`, `src/app.module.ts`, `src/config/swagger.ts`,
  `src/modules/settings/**`, `Dockerfile`.
- Swagger enabled only when `NODE_ENV != production`.

**Robot (`bomi-sddg-robo`)**

- `node-cron` scheduler connecting to MongoDB and external sources per `SOURCE_DB_TYPE`:
  - `1` — SQL Server
  - `2` — AS/400
  - `3` — static JSON (`static_data.json`)
- Writes to collections consumed by the backend: `shippers`, `companies`, `products`,
  `logs`, `nfProcessingLog`, `settings` (`scope: "robot"`), `robot_state`, `robot_statistics`.
- Kill Switch and dynamic scheduler read from `settings` with `scope: "robot"`.
- Reads dynamic settings from MongoDB approximately every 10 seconds; may restart the
  scheduler when cron changes.
- Runs job immediately on startup, then schedules via cron; maintains locks/state in MongoDB.
- Key files: `src/config/env.ts`, `src/index.ts`, `src/services/settings.service.ts`,
  `src/repositories/sddgRepository.ts`.

**Dashboard robot metrics (frontend impact)**

- Backend aggregates `nfProcessingLog` in
  `bomi-sddg-backend/src/modules/dashboard/dashboard.controller.ts`.
- Endpoint with global prefix: `GET /apiv1/dashboard/robot/metrics`.
- Frontend dashboard routes under `src/app/api/dashboard/**` proxy these metrics.

### Project Layout (repository root)

```text
src/
├── app/                    # Routes, layouts, API route handlers
│   ├── (dashboard)/        # Authenticated application pages
│   └── api/
│       ├── proxy/          # Bearer-token proxy to NestJS backend
│       └── dashboard/      # Aggregated dashboard endpoints
├── components/
│   ├── features/           # Domain-specific UI
│   ├── form/               # Reusable form controls
│   └── ui/                 # Generic UI primitives
├── context/                # React context providers
├── lib/
│   ├── api/                # Typed API clients
│   └── hooks/              # Shared hooks
├── types/                  # Shared TypeScript types
├── auth.ts                 # NextAuth configuration
└── middleware.ts           # Session and role gate
```

### API Access Patterns

1. **Direct browser calls** — `httpJson(apiUrl("/api/..."))` using `NEXT_PUBLIC_API_URL`
   for endpoints safe to call from the client.
2. **Server proxy** — `src/app/api/proxy/**/route.ts` calls `auth()`, attaches
   `Authorization: Bearer <accessToken>`, forwards to `${API_BASE_URL}/...`.
3. **Dashboard routes** — `src/app/api/dashboard/**` for aggregated metrics proxied to
   backend dashboard modules.

New endpoints MUST choose the pattern already used for similar resources; do not mix
patterns for the same resource without justification.

Frontend env files: `.env.local` (development), `.env.production.local` (production),
based on `.env.example`.

### Frontend Environment Variables

| Variable | Purpose | Read in |
|----------|---------|---------|
| `NEXTAUTH_URL` | Public NextAuth URL | `src/auth.ts` |
| `NEXTAUTH_URL_INTERNAL` | Internal NextAuth URL | `src/auth.ts` |
| `NEXTAUTH_SECRET` | Auth secret (min 32 chars) | `src/auth.ts` |
| `SESSION_PASSWORD` | iron-session password (min 32 chars) | `src/lib/session.ts` |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `src/lib/api/config.ts` |
| `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` | Frontend email | email-related routes |
| `SKIP_TYPE_CHECK` | Skip typecheck/lint on build when `1` | `next.config.ts` |

Cross-project awareness (backend env affects frontend integration):

- Backend requires `CORS_ORIGINS` CSV including the frontend origin.
- Backend validates at bootstrap: `MONGODB_URI`, `MONGODB_DB_NAME`, JWT secrets, and
  `CORS_ORIGINS` in `bomi-sddg-backend/src/main.ts`.

## Security Requirements

- MUST keep authentication flows in `src/auth.ts` aligned with backend auth endpoints
  listed in Principle IV.
- MUST NOT commit real `.env.local`, `.env.production.local`, or production secrets.
- MUST NOT log full tokens, refresh tokens, or passwords (truncate or omit in debug output).
- MUST validate password rules via existing helpers (`src/lib/password-validation.ts`) for
  user-facing password flows.
- MUST preserve CORS alignment: frontend origin must remain listed in backend
  `CORS_ORIGINS` when deploying new environments.
- File and image access MUST respect `next.config.ts` `images.remotePatterns` and upload
  proxy paths under `src/app/api/proxy/uploads/`.

## Files & Uploads (High-Risk Area)

File and upload paths are a **high-risk regression zone** (404/403 when misaligned). Any
change touching uploads MUST verify all items below.

**Backend**

- `StaticFilesController` at `@Controller('uploads')` with `JwtAuthGuard`.
- `GET uploads/(.*)` excluded from global prefix `apiv1` in `src/main.ts`.
- Physical root may come from MongoDB `settings` key `Files Path`, else `process.cwd()`.
- `FilesByPathController` serves binary via `GET /files?path=...` with JWT.

**Frontend**

- `next.config.ts` — `images.remotePatterns` for upload paths (e.g., `/api/uploads/**`).
- `src/app/api/proxy/uploads/[[...path]]/route.ts` proxies to
  `${API_BASE_URL}/uploads/...`.

**Coordination rule**: prefix exclusion, proxy target path, `remotePatterns`, and
`Files Path` setting MUST be updated together when any one changes.

## Performance Standards

- Reuse session token caching in `httpJson` / `getTokenFromSession` (10s cache) instead of
  hammering `getSession()` on every request.
- Prefer server components and route handlers for data that does not require client
  interactivity.
- Use `next/dynamic` for heavy client-only chart bundles (as in dashboard components) to
  avoid blocking initial page load.
- CI MAY set `SKIP_TYPE_CHECK=1` to skip typecheck/lint during `next build`; local and
  pre-release validation MUST still run `npm run lint` and a full build without that flag
  before production deployment.
- Avoid N+1 client fetches: batch list data through existing list endpoints and dashboard
  aggregation routes where available.

## Quality Assurance & Testability

Although automated tests are absent, every feature MUST define **manual validation steps**
in `tasks.md` that map to `spec.md` acceptance scenarios.

Manual checks SHOULD cover:

- Authenticated and unauthenticated access paths.
- Role-restricted routes (`userType === 0` for user management).
- API error handling (401 redirect to `/login`, validation errors in Portuguese).
- Upload/preview flows when files are involved.
- Regression on proxy vs direct API paths after route changes.
- Dashboard robot metrics when touching `nfProcessingLog`-related UI.

Code structure SHOULD favor:

- Pure validation/transformation functions in `src/lib/`.
- Thin React components delegating data fetching to `src/lib/api/` modules.
- Typed responses instead of unchecked `JSON.parse` results.

## Anti-Regression Checklist

Before merging or marking a feature done, verify:

- [ ] Backend route prefix in `bomi-sddg-backend/src/main.ts` (`apiv1`) aligned with
      frontend calls (`src/auth.ts`, `src/lib/api/*`) and Next proxy routes
      (`src/app/api/**`).
- [ ] Auth changes validated: `NEXTAUTH_SECRET`, `SESSION_PASSWORD` (min 32 chars), cookie
      behavior in `src/middleware.ts`.
- [ ] Upload/file changes validated: backend `uploads/(.*)` prefix exclusion,
      `images.remotePatterns` in `next.config.ts`, MongoDB `Files Path` in `settings`.
- [ ] Robot-related UI validated: `settings` with `scope: "robot"`, Kill Switch behavior,
      dashboard metrics sourced from `nfProcessingLog`.
- [ ] No isolated single-project fix for routes, headers, tokens, CORS, or paths — backend
      updated in the same change set when required.

## Spec Kit Workflow

When planning features with Spec Kit, artifacts MUST be produced **in this exact order**:

1. `spec.md` — Primary feature specification (`Status: Draft` initially).
2. `research.md` — Research and ambiguity resolution.
3. `plan.md` — Technical implementation plan.
4. `data-model.md` — Data modeling and entities.
5. `requirements.md` — Requirements validation checklist.

`tasks.md` is mandatory but MAY ONLY be created after `requirements.md` is fully validated
and approved.

Additional Spec Kit rules:

- Spec Kit artifacts MUST use English for technical names, entities, and structure.
- `tasks.md` MUST NOT include Git operations (local or remote), `dotnet` commands, or
  automated test creation unless the user explicitly requests automated tests.
- Build, compilation, Git, deployment, and service startup commands are **manual developer
  responsibilities** and MUST NOT appear as agent tasks.

Reference: `AGENTS.md` for agent workflow; ignore Git automation
hooks from Spec Kit extensions when executing constitution or feature work — Git is managed
manually by the developer.

## Post-Implementation

After the AI agent completes all tasks in `tasks.md` for a feature, the `Status` property
in that feature's `spec.md` MUST be updated from `Draft` to `Done`.

This update is mandatory as the final step of the implementation cycle and is independent
of subsequent manual QA performed by the developer in homologation or production.

## Governance

This constitution documents principles evidenced in the current `bomi-sddg-frontend`
codebase and governs all future features, architectural changes, and code reviews.

Compliance expectations:

- Every spec and plan MUST include a **Constitution Check** gate before implementation.
- Deviations (new patterns, new dependencies, auth changes, route prefix changes) MUST be
  documented in the plan's Complexity Tracking table with justification.
- Amendments to this constitution require updating the version below, recording the change
  rationale, and syncing dependent templates under `.specify/templates/`.

Runtime development guidance: `README.md`, `AGENTS.md`.

**Version**: 1.1.2 | **Ratified**: 2026-06-24 | **Last Amended**: 2026-06-25
