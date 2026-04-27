# Next.js Architecture Specification

This document defines the architectural structure and development rules for the Next.js application.

The Next.js application acts as both frontend and Backend For Frontend (BFF).

---

## 1) Architectural Role

The Next.js application has two responsibilities:

- Render the user interface
- Act as a controlled backend layer between the client and the external API

All communication between the client and external services must pass through Next.js.

---

## 2) Architectural Pattern

The project follows the BFF (Backend For Frontend) pattern.

Key characteristics:

- The frontend does not communicate directly with external APIs
- All requests are routed through Next.js
- Authentication is handled via HttpOnly cookies
- Sensitive logic is executed on the server side

---

## 3) Application Structure

The application must be organized into logical layers:

- UI layer
- Application layer
- Server layer
- Shared utilities

Each layer has a clear responsibility and must not overlap concerns.

---

## 4) UI Layer

Responsible for:

- Rendering pages and components
- Handling user interactions
- Triggering application actions

Constraints:

- Must not contain business logic
- Must not handle authentication logic directly
- Must not access external APIs
- Login form rendering is client-only to avoid hydration mismatch caused by browser DOM injection
- Language switcher rendering is client-only to avoid hydration mismatch caused by browser extensions or antivirus DOM injection and uses the same theme visual style as authentication inputs
- Notes editor page uses TipTap rich text editor in client components
- Runtime user preferences loader applies locale and colors globally on app load
- Full-page async loading states use the shared `AppLoading` component: `position: absolute` within `inset-0` relative to the private layout content panel (below the navbar), centered label, `select-none`, background `var(--bg-primary)`; the private shell uses a flex column so `main` and the inner `ui-panel` grow with `flex-1` / `min-height: 0` and `position: relative` so the overlay does not cover the header. Public note view wraps loading in a `relative min-h-screen` container so the same absolute overlay fills only that page body

---

## 5) Application Layer

Responsible for:

- Orchestrating frontend behavior
- Managing state and interactions
- Calling internal Next.js endpoints

Constraints:

- Must not contain sensitive logic
- Must not directly access external APIs

---

## 6) Server Layer

Responsible for:

- Handling all API routes
- Communicating with external API (NestJS)
- Reading and writing cookies
- Attaching authentication tokens
- Transforming requests and responses

This layer represents the BFF.

Current BFF internal routes include:

- `/api/notes` (GET, POST)
- `/api/notes/:id` (GET, PUT, DELETE)
- `/api/budgets` (GET, POST)
- `/api/budgets/:id` (GET, PUT, DELETE)
- `/api/expenses` (GET, POST)
- `/api/expenses/:id` (GET, PUT, DELETE)
- `/api/user/settings/colors` (PATCH)
- `/api/user/settings/language` (PATCH)

For `/api/notes/:id` GET:

- BFF tries external public note endpoint first
- if note is not public, BFF falls back to authenticated endpoint with user token

---

## 7) Authentication Handling

- JWT is stored in HttpOnly cookies
- The server layer extracts the token from cookies
- The token is forwarded to the external API as a Bearer token
- The client never accesses the token directly
- Login identifier can be either email or username as plain text
- On successful login, the client redirects to `/dashboard`
- Default page background is `#ffe3d5`, default typography color is `#946a56`, and shared surfaces (`ui-panel`, `ui-card`, inputs, secondary actions) use transparent backgrounds via `#00000000` so the page background shows through where borders define structure
- Authentication pages (`/login`, `/register`, `/recover`) use the legacy peach and brown responsive layout and keep locale switching available
- Login and register pages show enlarged minimalist social links for LinkedIn and GitHub using `react-icons` (`FaLinkedin`, `FaGithub`)
- Recover page uses a two-step flow: first send code with email, then replace with verification code + new password + confirm password form
- Authentication pages use a reference-sized visual scale for controls and typography (title, labels, inputs, buttons, helper text, and social icons), with `4` scale spacing between field labels and inputs
- Authentication container is centered, moderately narrow, and vertically aligned to match the reference login, register, and recovery screens
- Authentication texts are localized through `messages.ts` for `en`, `pt`, and `es`
- Private application pages use the same legacy peach and brown visual system through shared UI classes for shells, panels, cards, inputs, buttons, and feedback messages
- Dashboard, financial CRUD, notes list, note editor, public note viewer, settings, navigation and floating action controls follow the authentication visual pattern
- Private navigation renders logout as plain text like other nav links (no border or button chrome), aligned on the right of the header row; it remains a `button` for accessibility and POST logout
- Note editor pages use the private layout panel as their single background container
- Public note viewer uses a single content container, a floating title without background, and a full-width themed page background
- Public note viewer uses a floating `react-icons` back icon without button background
- Page and section titles are non-selectable across the app, including authentication titles, private page headings and heading helper text
- Clickable UI items and their children are non-selectable across the app, including links, buttons, selects, labels and button-like controls
- Authentication forms also mark helper copy as non-selectable, including the recover info box, the login and register footer lines ("Don't have an account?" / "Already have an account?"), and the recover "Remember your password?" line
- Notes list and public note viewer keep public note content selectable while private-content placeholders are explicitly non-selectable
- Notes list removes the private layout panel background so filters and note cards float directly on the page (same `!important` panel reset as Dashboard/Financial when `.notes-floating-page` is present)
- Dashboard and Financial pages use the same `private-floating-page` marker so the private layout panel yields no outer border, background, or padding and inner sections float on the page background; the panel reset lives outside `@layer` and uses `!important` so it wins over `p-5 sm:p-6` utilities on the same element as `ui-panel`
- Notes list aligns visibility filters to the left and sorting controls to the right, with private-content placeholders centered horizontally and vertically
- Notes list expands horizontally beyond the private layout padding to align with the private navbar content width
- Public note previews keep a fixed height increased by 30px total and use a minimalist vertical scrollbar when content exceeds the preview area
- Notes list card text is 1px larger across titles, previews, timestamps and actions
- Notes list dates use `dd/MM/yyyy HH:mm:ss` for Portuguese and `yyyy/MM/dd hh:mm:ss AM/PM` for other languages
- The notes creation action is a viewport-fixed floating button positioned at the bottom-right of the page
- User color preferences now include independent labels for page backgrounds, text, borders, input background, header background/text, primary button background/text and secondary button background/text
- Settings page uses one shared `ui-card` wrapper for the Language and Colors forms; color pickers are laid out in a responsive grid (one column on small screens, two on `sm`, three on `lg`)

---

## 8) Data Flow

All data must follow this path:

Client → Next.js → External API → Next.js → Client

Direct communication between client and external API is not allowed.

Locale and theme flow:

Client -> `/api/user` -> External API -> apply CSS variables + locale cookie/lang in runtime

---

## 9) Security Rules

- Do not expose tokens to the client
- Do not store tokens in localStorage
- Do not call external APIs from the client
- Always validate authentication on the server
- Use HttpOnly cookies for authentication

---

## 10) Module Organization

The application must be divided into modules based on features.

Each module should encapsulate:

- UI components
- Application logic
- Server interaction

Modules must be independent and organized by domain.

Current private note pages include:

- `/dashboard` (financial summary, budget overview, expenses by category)
- `/financial` (budget + expanses CRUD)
- `/notes` (listing)
- `/add-note/:id` (creation)
- `/edit-note/:id` (edition)

Current public note page:

- `/view-note/:id` (read-only HTML rendering, no private navbar)

---

## 11) Environment Variables

- Public variables must use NEXT_PUBLIC prefix
- Sensitive variables must not be exposed to the client
- API endpoints must be defined only on the server side
- EXTERNAL_USER_API_URL can be either:
  - full endpoint URL (example: `http://localhost:3000/api/users/me`)
  - base API URL (example: `http://localhost:3000`) and the BFF resolves `/api/users/me`

---

## 12) Environment Security (Mandatory)

- No environment variable fallback is allowed
- No secret values may be hardcoded in the source code

Rules:

- Never define default values for secrets
- Never use patterns like:
  process.env.SECRET || "default_value"

- If a required environment variable is missing:
  - The application must fail immediately

This ensures:

- No accidental exposure of secrets
- No insecure default configurations
- Predictable and secure deployments

---

## 13) Naming Convention (Mandatory)

All source code must be written in English.

This includes:

- variable names
- function names
- class names
- file names
- folder names
- constants
- types and interfaces

Rules:

- Do not use Portuguese (or any other language) in code
- Use clear and descriptive English naming
- Follow consistent naming conventions across the project

---

## 14) Core Principle

The frontend must remain a thin layer.

All critical logic must be handled on the server side to ensure security, maintainability, and scalability.