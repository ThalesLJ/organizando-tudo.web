# Requirements Checklist: Experience System Domain

**Purpose**: Validate that the retroactive Experience System domain specification reflects the current implementation and follows the constitution.

**Created**: 2026-06-12

**Feature**: `specs/006-experience-system-domain/spec.md`

## Content Quality

- [x] Project-specific content is written in English.
- [x] Technical names and entities remain in English.
- [x] The specification has `Status: Done`.
- [x] There are no pending questions.
- [x] Scope covers private layout, UI primitives, loading, feedback, and auth shell.

## Constitution Alignment

- [x] Visual system uses Tailwind CSS and CSS variables.
- [x] Private navigation uses localized messages.
- [x] Private layout depends on server-side resolved authenticated user.
- [x] Private loading preserves persistent navigation.
- [x] Validation is defined through equivalent manual flow.
- [x] No item requests git, dotnet, or automated tests.

## Manual Validation Coverage

- [x] Validate private shell with username and navigation.
- [x] Validate logout in private header.
- [x] Validate color application in private shell.
- [x] Validate `ui-*` classes in cards, inputs, buttons, and feedback.
- [x] Validate loading in dashboard, financial, notes, settings, and viewer.
- [x] Validate standardized error and success messages.
- [x] Validate public shell for login, registration, and recovery.
- [x] Validate social links in public shell when displayed.
- [x] Validate text selection behavior for public and private note content.

## Approval

- [x] Retroactive requirements are complete for the current implementation state.
