# Implementation Plan: Notes Domain

**Branch**: `002-notes-domain` | **Date**: 2026-06-12 | **Spec**: `spec.md`

**Input**: Feature specification from `/specs/002-notes-domain/spec.md`

**Note**: Retroactive plan created from the existing implementation. There is no `tasks.md` for this cycle by explicit request.

## Summary

The Notes domain provides private notes listing, search, filters, sorting, rich text creation and editing, visibility control, deletion, and public viewing. The implementation preserves the BFF for every external call and keeps private content protected in previews and direct access.

## Technical Context

**Language/Version**: TypeScript with Next.js App Router

**Primary Dependencies**: Next.js, React, TipTap, React Icons

**Storage**: External API persistence; filter and editor state on the client

**Validation**: Manual validation of list, editor, visibility, deletion, and public viewing

**Target Platform**: Web application

**Project Type**: Web frontend with Backend for Frontend

**Performance Goals**: Search, filter, and sorting should respond locally without additional calls

**Constraints**: Private content must not appear in public preview or unauthenticated access

**Scale/Scope**: Authenticated user note management and public reading of published notes

## Constitution Check

- **BFF Boundary**: Passed. Components call `/api/notes` and `/api/notes/:id`.
- **Server-Side Security**: Passed. Private operations require cookie and server-side Bearer token forwarding.
- **Authentication Scope**: Passed. Listing, creation, editing, deletion, and private notes require a session.
- **i18n and Preferences**: Passed. List and actions use localized messages; UI uses shared theme.
- **Environment Safety**: Passed. The external URL stays server-side.
- **Performance Impact**: Passed. Filters are derived locally and fetches use `no-store`.
- **Manual Validation**: Passed. Validation is manual and does not require automated test tasks.

## Project Structure

### Documentation (this feature)

```text
specs/002-notes-domain/
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
│   ├── (private)/notes/page.tsx
│   ├── (private)/add-note/page.tsx
│   ├── (private)/add-note/[id]/page.tsx
│   ├── (private)/edit-note/page.tsx
│   ├── (private)/edit-note/[id]/page.tsx
│   ├── view-note/[id]/page.tsx
│   └── api/notes/
├── components/
│   ├── notes-manager.tsx
│   ├── note-editor.tsx
│   └── note-viewer.tsx
└── app/globals.css
```

**Structure Decision**: The domain separates UI surfaces into dedicated components and centralizes external integration in notes BFF routes.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
