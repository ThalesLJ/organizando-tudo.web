# Requirements Checklist: Preferences Domain

**Purpose**: Validate that the retroactive Preferences domain specification reflects the current implementation and follows the constitution.

**Created**: 2026-06-12

**Feature**: `specs/004-preferences-domain/spec.md`

## Content Quality

- [x] Project-specific content is written in English.
- [x] Technical names and entities remain in English.
- [x] The specification has `Status: Done`.
- [x] There are no pending questions.
- [x] Scope covers language, messages, colors, and runtime preferences.

## Constitution Alignment

- [x] i18n and preferences are documented as central behavior.
- [x] Authenticated persistence uses BFF.
- [x] Colors use global CSS variables.
- [x] Locale falls back to English.
- [x] Validation is defined through equivalent manual flow.
- [x] No item requests git, dotnet, or automated tests.

## Manual Validation Coverage

- [x] Validate switching to locale `en`.
- [x] Validate switching to locale `pt`.
- [x] Validate switching to locale `es`.
- [x] Validate fallback for invalid locale.
- [x] Validate authenticated language persistence.
- [x] Validate preference loading in `/settings`.
- [x] Validate color saving.
- [x] Validate color reset.
- [x] Validate dark mode preset.
- [x] Validate runtime default application when `/api/user` fails.

## Approval

- [x] Retroactive requirements are complete for the current implementation state.
