# Implementation Plan: Financial Domain

**Branch**: `003-financial-domain` | **Date**: 2026-06-12 | **Spec**: `spec.md`

**Input**: Feature specification from `/specs/003-financial-domain/spec.md`

**Note**: Retroactive plan created from the existing implementation. There is no `tasks.md` for this cycle by explicit request.

## Summary

The Financial domain provides the financial dashboard, budget CRUD, expense CRUD, and derived aggregations. The implementation loads budgets and expenses through the BFF, protects every operation by session, and calculates totals on the client from current data.

## Technical Context

**Language/Version**: TypeScript with Next.js App Router

**Primary Dependencies**: Next.js, React

**Storage**: External API persistence; form state and aggregations on the client

**Validation**: Manual validation of dashboard, budgets, expenses, and reload after mutations

**Target Platform**: Web application

**Project Type**: Web frontend with Backend for Frontend

**Performance Goals**: Budgets and expenses should load in parallel on screens that use both collections

**Constraints**: Every financial operation requires an active session and must not call the external API directly from the browser

**Scale/Scope**: Financial summary and budget/expense management for the authenticated user

## Constitution Check

- **BFF Boundary**: Passed. Components call `/api/budgets` and `/api/expenses`.
- **Server-Side Security**: Passed. Route handlers read the cookie and forward the Bearer token server-side.
- **Authentication Scope**: Passed. Every financial route requires a session.
- **i18n and Preferences**: Passed. Financial text uses the message catalog; UI uses shared theme.
- **Environment Safety**: Passed. The external URL stays server-side.
- **Performance Impact**: Passed. Parallel loading and memoized aggregations are used.
- **Manual Validation**: Passed. Validation is manual and does not require automated test tasks.

## Project Structure

### Documentation (this feature)

```text
specs/003-financial-domain/
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
│   ├── (private)/dashboard/page.tsx
│   ├── (private)/financial/page.tsx
│   ├── api/budgets/
│   └── api/expenses/
└── components/
    ├── dashboard-financial.tsx
    └── financial-manager.tsx
```

**Structure Decision**: The domain separates aggregate reading in the dashboard and operational CRUD in the financial screen, using dedicated BFF routes for budgets and expenses.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
