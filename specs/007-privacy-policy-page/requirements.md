# Requirements Checklist: Privacy Policy and Brazilian Portuguese Policy Pages

**Purpose**: Validate that the Privacy Policy and Brazilian Portuguese Policy feature specification, research, plan, and data model fulfill all user requirements, adhere to the constitution, and meet Microsoft Partner Center certification rules.

**Created**: 2026-08-18

**Feature**: `specs/007-privacy-policy-page/spec.md`

## Content Quality

- [x] Project-specific content in Spec Kit artifacts is written in English.
- [x] Technical names, domain structures, and entities remain in English.
- [x] The specification has `Status: Draft` until implementation is completed.
- [x] There are no unresolved ambiguities or pending questions.
- [x] Scope covers the `/policy` English page, `/politica` Brazilian Portuguese clone page, and navigation.

## Constitution Alignment

- [x] Visual system uses Tailwind CSS, CSS variables, and shared layout principles.
- [x] Multi-language support follows the project's localization principles with English and Brazilian Portuguese.
- [x] Routes are public without interfering with session security or BFF rules.
- [x] Validation is defined through equivalent manual validation flows.
- [x] No item requests git, dotnet, or automated test suites.

## Microsoft Store Compliance & Requirements Coverage

- [x] Dedicated `/policy` route satisfies Microsoft Store Policy 10.5.1 (Personal Information - Privacy Policy).
- [x] Identifies Publisher as "Delius Tech" and Product as "Organizando Tudo" (Product ID: `9N7M3398TRMD`).
- [x] Clearly states that the application is open-source and provides the GitHub repository link.
- [x] Clarifies that the system only stores user-provided data (accounts, notes, budgets, expenses, preferences).
- [x] Discloses security measures (HTTPS encryption, HttpOnly cookies, password hashing).
- [x] Details user rights regarding data access, editing, export, and deletion.
- [x] Provides direct support contact channels.
- [x] Dedicated `/politica` route provides the Brazilian Portuguese version (PT-BR) of the policy.

## Manual Validation Coverage

- [x] Verify `/policy` returns HTTP 200 and renders the English Privacy Policy without requiring login.
- [x] Verify `/politica` returns HTTP 200 and renders the Brazilian Portuguese Privacy Policy without requiring login.
- [x] Verify language switching between `/policy` and `/politica`.
- [x] Verify home/back link navigates appropriately.
- [x] Verify text selection (`user-select: text`) across all policy sections.
- [x] Verify responsive layout across mobile and desktop viewports.

## Approval

- [x] Specification and planning artifacts are complete and ready for review.
