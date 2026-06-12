<!--
Sync Impact Report
Version change: 1.1.1 -> 1.2.0
Modified principles:
- I. Thin Frontend and BFF Boundary -> I. Thin Frontend and BFF Boundary
- II. TypeScript/NestJS Naming and Typed Code -> II. TypeScript/NestJS Naming and Typed Code
- III. Internationalized and Preference-Aware UX -> III. Internationalized and Preference-Aware UX
- IV. Secure Session and Server-Side Integration -> IV. Secure Session and Server-Side Integration
- V. Consistent UI System and Runtime Performance -> V. Consistent UI System and Runtime Performance
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- .specify/templates/plan-template.md: pending alignment with mandatory artifact order and manual validation rules
- .specify/templates/spec-template.md: pending alignment with English project-specific content guidance
- .specify/templates/tasks-template.md: pending alignment to remove automated test tasks and forbid git/dotnet validation tasks
- .specify/templates/commands/*.md: not present
Follow-up TODOs: none
-->
# Organizando Tudo Web Constitution

## Core Principles

### I. Thin Frontend and BFF Boundary

The Next.js application MUST remain both the user interface layer and the
Backend for Frontend boundary. Browser-executed code MUST call only internal
Next.js API routes for application data. External API communication, token
forwarding, request normalization, and sensitive decisions MUST remain inside
server-side route handlers or shared server-side utilities.

The expected data flow is:

```text
Client -> Next.js BFF -> External API -> Next.js BFF -> Client
```

Rationale: the implemented architecture protects credentials, centralizes
integration behavior, and keeps UI components focused on rendering and user
interaction without coupling them to external service details.

### II. TypeScript/NestJS Naming and Typed Code

The general project language is English. All names for classes, properties,
methods, functions, variables, business rules, entities, DTOs, modules,
controllers, providers, services, repositories, schemas, and contracts MUST be
written in English while remaining consistent with the application domain.

TypeScript code MUST follow idiomatic standards from the TypeScript, Next.js,
and NestJS ecosystems:

- Classes, decorators, modules, controllers, providers, services, repositories,
  entities, DTOs, schemas, types, interfaces, and enums MUST use PascalCase.
- Methods, functions, properties, parameters, and local variables MUST use
  camelCase.
- Immutable global constants MAY use UPPER_SNAKE_CASE when they represent shared
  static values.
- Files, folders, and technical artifacts SHOULD use kebab-case when applicable
  to the framework convention or the existing codebase pattern.
- Interfaces MUST NOT be required to start with `I`; names MUST represent the
  contract clearly and remain compatible with TypeScript/NestJS practices.

Types MUST be explicit at module boundaries, public contracts, DTOs, schemas,
entities, API responses, and integrations. The use of `any`, unjustified broad
casts, uncontracted objects, `Record<string, any>`, and type suppressions
without real handling is forbidden. `unknown` MAY be used only when explicit
narrowing or validation happens before consumption.

Input parsing and request validation MUST be explicit. Zod schemas SHOULD be
used in frontend flows that are already standardized around them. In NestJS
code, DTOs, pipes, validators, and typed contracts SHOULD be prioritized to keep
validation consistent and coupling low.

Rationale: the codebase uses TypeScript and explicit contracts to keep the
frontend and any NestJS services readable, testable, and secure without
importing C#/.NET-specific naming conventions.

### III. Internationalized and Preference-Aware UX

User-facing text MUST be resolved through the centralized localization catalog
when it belongs to shared application flows or persisted UX. Supported languages
are English, Portuguese, and Spanish. New language keys MUST preserve the same
structure across locales and fall back to English when the locale is missing or
invalid.

User preferences for language and colors MUST remain first-class behavior.
Locale changes MUST update the `locale` cookie and authenticated user language
preferences when applicable. Color customization MUST continue to use CSS
variables so layouts, shared components, and runtime preference loading remain
consistent across public and private pages.

Rationale: multilingual navigation, authentication flows, notes, financial
screens, and settings are already part of the product surface; future work must
not regress that consistency.

### IV. Secure Session and Server-Side Integration

Authentication tokens MUST be stored only in HttpOnly cookies and MUST NOT be
read by client-side code, persisted in localStorage, or exposed in rendered
payloads. Server-side routes MUST read the cookie, validate the session when
needed, and forward the token to the external API as a Bearer token.

Private pages MUST remain protected by middleware and server-side user checks.
Public authentication pages MUST redirect authenticated users away from login,
registration, and recovery. Public note reads MAY attempt the external public
endpoint first, but private note access MUST require an active session.

Rationale: the project already separates session ownership from UI state; this
is mandatory to preserve confidentiality and predictable access control.

### V. Consistent UI System and Runtime Performance

UI work MUST preserve the existing shared visual system based on Tailwind CSS,
CSS variables, `ui-*` component classes, the default peach/brown theme, and
runtime user preferences. New pages and components MUST reuse the established
loading, error, success, card, input, button, navigation, and floating-page
patterns unless a specification explicitly justifies a new pattern.

Client-side components MUST avoid unnecessary network waterfalls and stale state
updates. Related and independent data SHOULD be fetched in parallel. Async
effects MUST prevent updates to unmounted components when the current pattern
already does so. Rich text rendering MUST preserve the current public/private
note behavior, including selectable public content and protected private
placeholders.

Rationale: the implemented UI depends on a coherent runtime theme and
predictable loading states; fragmented styles or inefficient fetch patterns
reduce perceived quality and maintainability.

## Project Language and Spec Kit Artifacts

Project-specific content in Spec Kit artifacts MUST be written in English,
including plans, research, specifications, data models, requirements,
checklists, and tasks. The structure, headings, and section names from the
original English templates MUST be preserved when they are part of the Spec Kit
standard.

Technical names, domain names used in code, entities, properties, methods,
contracts, and business rules MUST remain in English and consistent with the
implemented application domain.

## Security Requirements

- Sensitive data MUST NOT be exposed with `NEXT_PUBLIC_`.
- External API endpoints MUST be read server-side and fail clearly when required
  configuration is missing.
- Secrets, tokens, and credentials MUST NOT be hardcoded in source files,
  documentation, or Spec Kit artifacts.
- Internal API routes MUST return normalized JSON responses and avoid leaking
  raw external API details beyond user-meaningful error messages.
- Mutating routes MUST require an authenticated cookie when operating on
  protected resources.
- Cookie options MUST keep `httpOnly`, `sameSite: "lax"`, root path scope, and
  production-only secure mode unless a future security specification replaces
  the session model.
- Client-side components MUST NOT call external service URLs directly.
- Generic `try-catch` blocks without proper handling, error normalization, safe
  logging, or controlled propagation MUST NOT be used.

## Performance Requirements

- Route handlers and client-side fetches that depend on fresh user data MUST use
  `no-store` semantics or an equivalent freshness strategy.
- Related and independent requests SHOULD run in parallel, as already done for
  budgets and expenses.
- Client-only rendering MUST be used for components that can create hydration
  mismatch risks, including locale switching, runtime preferences, and rich text
  editing.
- Shared loading states MUST avoid covering persistent navigation unless the
  whole page is intentionally public and standalone.
- Additional dependencies MUST be justified by user-facing value, bundle impact,
  and consistency with the current Next.js, React, Tailwind, TipTap, Zod, and
  React Icons stack.
- The production build and lint process MUST remain compatible with the scripts
  declared in `package.json`.

## Manual Quality and Testability

The current quality process is performed by QA in the production environment.
Even so, business logic MUST be developed to support future testability by
prioritizing low coupling, explicit contracts, cohesive functions, dependency
injection when applicable, and separation between domain rules, external
integration, and presentation.

This project does not have an automated test suite configured. No
specification, plan, checklist, data model, or `tasks.md` MUST require creation,
execution, or maintenance of unit, integration, end-to-end, or equivalent
automated tests. When validation is needed, `tasks.md` MUST include equivalent
manual testing steps to validate the deliveries.

## Mandatory Spec Kit Flow

Specification-Driven Development is the mandatory project workflow. When
planning new features through Spec Kit, artifacts MUST be generated in the exact
order below:

1. `spec.md` as the primary feature specification.
2. `research.md` as ambiguity research and resolution.
3. `plan.md` as the technical implementation plan.
4. `data-model.md` as data and entity modeling.
5. `requirements.md` as the requirements validation checklist.

The `tasks.md` file is mandatory, but MUST be generated and worked on only after
the complete validation and approval required by `requirements.md`.

No task described in `tasks.md` or any other generated artifact MUST validate,
fix, or execute actions in the local or remote git repository. No task MUST run
`dotnet` commands for application validation, build, or execution. Any git or
`dotnet` compilation/validation operation MUST be performed only manually by
the developer.

## Development Workflow and Quality Gates

Every new feature MUST start from a clear specification and the mandatory Spec
Kit artifacts before implementation, except for narrow documentation or
configuration corrections.

Every feature plan MUST pass the constitutional gates before implementation:

- The BFF boundary is preserved; client-side code does not call external APIs
  directly.
- Authentication and authorization behavior is identified for every private
  route or protected operation.
- Locale and user preference impact is documented for user-facing text, layout,
  or theme changes.
- Environment variable changes distinguish public values from server-only
  configuration.
- Security-sensitive behavior remains server-side and does not expose tokens.
- Performance impact is considered for new client-side effects, route handlers,
  dependencies, and data-fetching patterns.
- Validation is documented through equivalent manual steps compatible with QA in
  production.
- `tasks.md` generation happens only after complete approval of the
  `requirements.md` checklist.

Documentation that describes architecture, deployment, i18n, security, Spec Kit
workflow, or theming MUST be updated when a change modifies the documented
behavior. Git actions are manual repository management and are outside the
agent execution scope.

## Post-Implementation Closure

After the AI agent completes the technical implementation tasks, the agent MUST
automatically update the `Status` property in the related feature `spec.md` from
`Draft` to `Done`.

This update is independent of the developer's manual validations and tests and
MUST be performed systemically as the closure of the AI cycle.

## Governance

This constitution is the authoritative source for Organizando Tudo Web
architectural and development principles. Specifications, plans, tasks, code
changes, PR reviews, and documentation MUST be checked against these guidelines
before an implementation is considered complete.

The principles described here represent practices already evident in the
project codebase. Any new feature, architectural change, or code review MUST
adhere to these guidelines to avoid introducing architectural regressions,
domain inconsistencies, sensitive data exposure, or security failures.

Significant changes to these practices MUST be justified in versioning,
including the reason for the change, affected principles or sections, version
impact, and required updates to Spec Kit templates or project documentation.
Versioning follows semantic rules:

- MAJOR: incompatible governance changes or removal/redefinition of core
  principles.
- MINOR: new principles, new mandatory sections, or material expansion of
  guidance.
- PATCH: clarifications, wording improvements, and non-semantic corrections.

Compliance review MUST verify preservation of the BFF boundary, server-side
session ownership, i18n consistency, theme preferences, security rules, the
mandatory Spec Kit flow, manual quality, and documented validation gates.

**Version**: 1.2.0 | **Ratified**: 2026-05-23 | **Last Amended**: 2026-06-12
