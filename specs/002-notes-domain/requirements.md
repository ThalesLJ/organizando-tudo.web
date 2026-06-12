# Requirements Checklist: Notes Domain

**Purpose**: Validate that the retroactive Notes domain specification reflects the current implementation and follows the constitution.

**Created**: 2026-06-12

**Feature**: `specs/002-notes-domain/spec.md`

## Content Quality

- [x] Project-specific content is written in English.
- [x] Technical names and entities remain in English.
- [x] The specification has `Status: Done`.
- [x] There are no pending questions.
- [x] Scope covers list, search, filters, editor, privacy, and public viewer.

## Constitution Alignment

- [x] BFF boundary is preserved for every notes call.
- [x] Private operations require authenticated session.
- [x] Private content is not exposed in preview.
- [x] UI uses message catalog and shared theme.
- [x] Validation is defined through equivalent manual flow.
- [x] No item requests git, dotnet, or automated tests.

## Manual Validation Coverage

- [x] Validate authenticated notes list loading.
- [x] Validate search by title and content.
- [x] Validate all, public, and private filters.
- [x] Validate sorting by date and title.
- [x] Validate rich text note creation.
- [x] Validate existing note editing.
- [x] Validate visibility toggle.
- [x] Validate deletion with confirmation.
- [x] Validate public viewer for public note.
- [x] Validate private note access blocking without session.

## Approval

- [x] Retroactive requirements are complete for the current implementation state.
