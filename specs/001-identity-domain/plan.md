# Implementation Plan: Identity Domain

**Branch**: `001-identity-domain` | **Date**: 2026-06-12 | **Spec**: `spec.md`

**Input**: Feature specification from `/specs/001-identity-domain/spec.md`

**Note**: Retroactive plan created from the existing implementation. There is no `tasks.md` for this cycle by explicit request.

## Summary

The Identity domain provides routed application entry, email or username login, registration, password recovery, HttpOnly session handling, logout, and public/private route protection. The implementation preserves the BFF as the only path to external authentication and keeps tokens out of client-side code.

## Technical Context

**Language/Version**: TypeScript with Next.js App Router

**Primary Dependencies**: Next.js, React, Zod

**Storage**: HttpOnly `auth_token` cookie; user data and credentials remain in the external API

**Validation**: Manual validation of login, registration, recovery, logout, and route protection flows

**Target Platform**: Web application

**Project Type**: Web frontend with Backend for Frontend

**Performance Goals**: Redirects and session validation should happen without unnecessary intermediate screens

**Constraints**: The token must never be exposed to client-side code; private routes depend on an active session

**Scale/Scope**: Authentication and private access for Dashboard, Financial, Notes, and Settings domains

## Constitution Check

- **BFF Boundary**: Passed. Browser code calls only internal authentication and user routes.
- **Server-Side Security**: Passed. The token is written to an HttpOnly cookie and forwarded server-side.
- **Authentication Scope**: Passed. Public and private routes are defined in middleware and reinforced by the private layout.
- **i18n and Preferences**: Passed. Authentication copy uses the centralized catalog.
- **Environment Safety**: Passed. The external URL is resolved server-side.
- **Performance Impact**: Passed. Entry and middleware perform direct redirects; user data uses `no-store`.
- **Manual Validation**: Passed. Validation is manual and does not require automated test tasks.

## Project Structure

### Documentation (this feature)

```text
specs/001-identity-domain/
├── spec.md
├── research.md
├── plan.md
├── data-model.md
└── requirements.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── recover/page.tsx
│   └── api/auth/
├── components/
│   ├── auth-page-shell.tsx
│   ├── login-form.tsx
│   ├── register-form.tsx
│   ├── recover-form.tsx
│   └── logout-button.tsx
├── lib/
│   ├── auth.ts
│   ├── auth-config.ts
│   ├── require-auth.ts
│   ├── schemas.ts
│   └── external-api.ts
└── middleware.ts
```

**Structure Decision**: The domain is split between public pages, form components, BFF route handlers, and server-side session utilities.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
