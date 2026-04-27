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
- Language switcher rendering is client-only to avoid hydration mismatch caused by browser extensions or antivirus DOM injection and uses the same monochrome visual style as authentication inputs
- Notes editor page uses TipTap rich text editor in client components
- Runtime user preferences loader applies locale and colors globally on app load

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
- Authentication pages (`/login`, `/register`, `/recover`) use a black-and-white responsive layout and keep locale switching available
- Login and register pages show enlarged minimalist social links for LinkedIn and GitHub using `react-icons` (`FaLinkedin`, `FaGithub`)
- Recover page uses a two-step flow: first send code with email, then replace with verification code + new password + confirm password form
- Authentication pages use a reference-sized visual scale for controls and typography (title, labels, inputs, buttons, helper text, and social icons), with `4` scale spacing between field labels and inputs
- Authentication container is centered, moderately narrow, and vertically aligned to match the reference login, register, and recovery screens
- Authentication texts are localized through `messages.ts` for `en`, `pt`, and `es`

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