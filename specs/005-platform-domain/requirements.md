# Requirements Checklist: Platform Domain

**Purpose**: Validate that the retroactive Platform domain specification reflects the current implementation and follows the constitution.

**Created**: 2026-06-12

**Feature**: `specs/005-platform-domain/spec.md`

## Content Quality

- [x] Project-specific content is written in English.
- [x] Technical names and entities remain in English.
- [x] The specification has `Status: Done`.
- [x] There are no pending questions.
- [x] Scope covers BFF, external configuration, health, metadata, and deployment.

## Constitution Alignment

- [x] BFF boundary is documented as mandatory.
- [x] Sensitive data remains server-side.
- [x] External configuration fails explicitly when missing.
- [x] Health check does not expose sensitive data.
- [x] Validation is defined through equivalent manual flow.
- [x] No item requests git, dotnet, or automated tests.

## Manual Validation Coverage

- [x] Validate protected BFF route without cookie.
- [x] Validate protected BFF route with cookie.
- [x] Validate `EXTERNAL_USER_API_URL` resolution as base URL.
- [x] Validate `EXTERNAL_USER_API_URL` resolution as full endpoint.
- [x] Validate clear failure when `EXTERNAL_USER_API_URL` is missing.
- [x] Validate `/api/health` payload.
- [x] Validate metadata fallback when `NEXT_PUBLIC_SITE_URL` is missing.
- [x] Validate deployment documentation with health endpoint.

## Approval

- [x] Retroactive requirements are complete for the current implementation state.
