# Requirements Checklist: Financial Domain

**Purpose**: Validate that the retroactive Financial domain specification reflects the current implementation and follows the constitution.

**Created**: 2026-06-12

**Feature**: `specs/003-financial-domain/spec.md`

## Content Quality

- [x] Project-specific content is written in English.
- [x] Technical names and entities remain in English.
- [x] The specification has `Status: Done`.
- [x] There are no pending questions.
- [x] Scope covers dashboard, budgets, expenses, and aggregations.

## Constitution Alignment

- [x] BFF boundary is preserved for budgets and expenses.
- [x] Financial operations require authenticated session.
- [x] Text uses the localization catalog.
- [x] Parallel loading is documented as a performance decision.
- [x] Validation is defined through equivalent manual flow.
- [x] No item requests git, dotnet, or automated tests.

## Manual Validation Coverage

- [x] Validate dashboard with budgets and expenses.
- [x] Validate total budget calculation.
- [x] Validate total spent calculation.
- [x] Validate total remaining calculation.
- [x] Validate budget creation, editing, and deletion.
- [x] Validate expense creation, editing, and deletion.
- [x] Validate expense association with budget.
- [x] Validate reload after mutations.
- [x] Validate empty states and error messages.

## Approval

- [x] Retroactive requirements are complete for the current implementation state.
