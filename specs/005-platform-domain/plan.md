# Implementation Plan: Platform Domain

**Branch**: `005-platform-domain` | **Date**: 2026-06-12 | **Spec**: `spec.md`

**Input**: Feature specification from `/specs/005-platform-domain/spec.md`

**Note**: Retroactive plan created from the existing implementation. There is no `tasks.md` for this cycle by explicit request.

## Summary

The Platform domain supports the BFF architecture, external API resolution, HTTP helpers, public health check, metadata base, and documented deployment. The implementation keeps sensitive integrations server-side and provides normalized responses for product domains.

## Technical Context

**Language/Version**: TypeScript with Next.js App Router

**Primary Dependencies**: Next.js, React, PM2 in the documented operational environment

**Storage**: Environment variables, session cookie, and deployment `.env` file

**Validation**: Manual validation of BFF, external configuration, health endpoint, metadata, and documented deployment

**Target Platform**: Node.js web application

**Project Type**: Web frontend with Backend for Frontend and operational support

**Performance Goals**: Health check should respond with a simple payload; BFF should prevent client-side external calls

**Constraints**: Secrets and tokens remain server-side; deployment and git are manual developer operations when needed

**Scale/Scope**: Web infrastructure for Identity, Notes, Financial, Preferences, and Experience System

## Constitution Check

- **BFF Boundary**: Passed. Platform defines and preserves the BFF boundary.
- **Server-Side Security**: Passed. External configuration and tokens stay server-side.
- **Authentication Scope**: Passed. Helpers support unauthorized responses for protected routes.
- **i18n and Preferences**: Passed. Platform supports root layout and metadata without conflicting with preferences.
- **Environment Safety**: Passed. External variables are documented and resolved explicitly.
- **Performance Impact**: Passed. Health check is simple and BFF uses `no-store` strategies for fresh data.
- **Manual Validation**: Passed. Validation is manual and does not require automated test tasks.

## Project Structure

### Documentation (this feature)

```text
specs/005-platform-domain/
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
│   ├── layout.tsx
│   └── api/
├── lib/
│   ├── http.ts
│   ├── external-api.ts
│   ├── auth.ts
│   └── auth-config.ts
docs/
└── deploy-web.md
.github/
└── workflows/deploy.yml
.env.example
```

**Structure Decision**: Platform is distributed across server-side helpers, BFF route handlers, root layout, operational documentation, and deployment workflow.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
