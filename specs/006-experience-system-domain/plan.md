# Implementation Plan: Experience System Domain

**Branch**: `006-experience-system-domain` | **Date**: 2026-06-12 | **Spec**: `spec.md`

**Input**: Feature specification from `/specs/006-experience-system-domain/spec.md`

**Note**: Retroactive plan created from the existing implementation. There is no `tasks.md` for this cycle by explicit request.

## Summary

The Experience System domain provides shared private layout, `ui-*` visual primitives, CSS variable theming, shared loading, asynchronous operation feedback, public authentication shell, and social links. The implementation connects Identity and Preferences to a coherent visual experience.

## Technical Context

**Language/Version**: TypeScript with Next.js App Router

**Primary Dependencies**: Next.js, React, Tailwind CSS, React Icons

**Storage**: Visual preferences from the authenticated user and global CSS variables

**Validation**: Manual validation of private layout, visual primitives, loading, feedback, and public shell

**Target Platform**: Web application

**Project Type**: Web frontend with shared visual system

**Performance Goals**: Loading should preserve navigation context and shared UI should avoid visual duplication

**Constraints**: Shared visuals must respect theme preferences and localized messages

**Scale/Scope**: Cross-domain experience for Identity, Notes, Financial, Preferences, and Platform

## Constitution Check

- **BFF Boundary**: Passed. Experience System does not call external APIs directly.
- **Server-Side Security**: Passed. Private layout depends on server-side resolved user.
- **Authentication Scope**: Passed. Private shell exists only in authenticated routes.
- **i18n and Preferences**: Passed. Navigation and shells use messages and theme variables.
- **Environment Safety**: Passed. No sensitive data is exposed through visual primitives.
- **Performance Impact**: Passed. Loading respects persistent navigation and primitives reduce duplication.
- **Manual Validation**: Passed. Validation is manual and does not require automated test tasks.

## Project Structure

### Documentation (this feature)

```text
specs/006-experience-system-domain/
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
│   ├── globals.css
│   └── (private)/layout.tsx
└── components/
    ├── app-loading.tsx
    ├── auth-page-shell.tsx
    ├── logout-button.tsx
    └── shared feature components
```

**Structure Decision**: Experience System is cross-cutting, with global style rules, private layout, and shared components consumed by multiple domains.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
