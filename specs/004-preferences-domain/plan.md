# Implementation Plan: Preferences Domain

**Branch**: `004-preferences-domain` | **Date**: 2026-06-12 | **Spec**: `spec.md`

**Input**: Feature specification from `/specs/004-preferences-domain/spec.md`

**Note**: Retroactive plan created from the existing implementation. There is no `tasks.md` for this cycle by explicit request.

## Summary

The Preferences domain provides language selection, centralized message catalog, color customization, theme reset, dark mode preset, and runtime preference loading. The implementation applies preferences through cookie, BFF persistence, and global CSS variables.

## Technical Context

**Language/Version**: TypeScript with Next.js App Router

**Primary Dependencies**: Next.js, React

**Storage**: `locale` cookie, external user preferences, and CSS variables in the document

**Validation**: Manual validation of language switching, persistence, reset, dark mode, and runtime loading

**Target Platform**: Web application

**Project Type**: Web frontend with Backend for Frontend

**Performance Goals**: Preferences should be applied without blocking basic application rendering

**Constraints**: Locale must be normalized; authenticated preferences must go through the BFF

**Scale/Scope**: Global preferences for public and private pages

## Constitution Check

- **BFF Boundary**: Passed. Preference persistence uses internal routes.
- **Server-Side Security**: Passed. Authenticated updates read the cookie server-side.
- **Authentication Scope**: Passed. User persistence requires session; local cookie supports visitors.
- **i18n and Preferences**: Passed. This domain centralizes i18n and theming.
- **Environment Safety**: Passed. No sensitive configuration is exposed.
- **Performance Impact**: Passed. Runtime applies defaults when user data does not load.
- **Manual Validation**: Passed. Validation is manual and does not require automated test tasks.

## Project Structure

### Documentation (this feature)

```text
specs/004-preferences-domain/
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
│   ├── (private)/settings/page.tsx
│   └── api/user/settings/
├── components/
│   ├── language-switcher.tsx
│   ├── settings-panel.tsx
│   └── user-preferences-runtime.tsx
└── lib/
    ├── messages.ts
    └── locale-client.ts
```

**Structure Decision**: Global preferences stay in shared helpers and components, while authenticated persistence stays in user settings BFF routes.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
