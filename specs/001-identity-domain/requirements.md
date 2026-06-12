# Requirements Checklist: Identity Domain

**Purpose**: Validate that the retroactive Identity domain specification reflects the current implementation and follows the constitution.

**Created**: 2026-06-12

**Feature**: `specs/001-identity-domain/spec.md`

## Content Quality

- [x] Project-specific content is written in English.
- [x] Technical names and entities remain in English.
- [x] The specification has `Status: Done`.
- [x] There are no pending questions.
- [x] Scope covers login, registration, recovery, session, logout, and route protection.

## Constitution Alignment

- [x] BFF boundary is preserved for external authentication calls.
- [x] Token is stored only in an HttpOnly cookie.
- [x] Private and public routes have defined routing rules.
- [x] UI content uses the localization catalog.
- [x] Validation is defined through equivalent manual flow.
- [x] No item requests git, dotnet, or automated tests.

## Manual Validation Coverage

- [x] Validate `/` redirect with and without session.
- [x] Validate login with email.
- [x] Validate login with username.
- [x] Validate invalid login error.
- [x] Validate successful registration without automatic login.
- [x] Validate two-step recovery.
- [x] Validate logout with local session cleanup.
- [x] Validate private route blocking without session.

## Approval

- [x] Retroactive requirements are complete for the current implementation state.
