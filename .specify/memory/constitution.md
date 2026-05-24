<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template principle 1 -> I. Thin Frontend and BFF Boundary
- Template principle 2 -> II. Typed, Explicit, Feature-Scoped Code
- Template principle 3 -> III. Internationalized and Preference-Aware UX
- Template principle 4 -> IV. Secure Session and Server-Side Integration
- Template principle 5 -> V. Consistent UI System and Runtime Performance
Added sections:
- Security Requirements
- Performance Requirements
- Development Workflow and Quality Gates
Removed sections:
- Template placeholder sections
Templates requiring updates:
- .specify/templates/plan-template.md: updated
- .specify/templates/spec-template.md: updated
- .specify/templates/tasks-template.md: updated
- .specify/templates/commands/*.md: not present
Follow-up TODOs: none
-->
# Organizando Tudo Web Constitution

## Core Principles

### I. Thin Frontend and BFF Boundary

The Next.js application MUST remain both the UI layer and the Backend for
Frontend boundary. Browser code MUST call only internal Next.js API routes for
application data. External API communication, token forwarding, request
normalization, and sensitive decisions MUST stay inside server-side route
handlers or shared server utilities.

The expected data path is:

```text
Client -> Next.js BFF -> External API -> Next.js BFF -> Client
```

Rationale: the implemented architecture protects credentials, centralizes
integration behavior, and keeps UI components focused on rendering and user
interaction instead of external service details.

### II. Typed, Explicit, Feature-Scoped Code

Source code MUST use TypeScript types, clear English naming, and explicit data
contracts at module boundaries. Feature behavior MUST stay close to its domain:
authentication, notes, financial data, user preferences, and shared utilities
MUST not be mixed into unrelated modules. Shared helpers are allowed only when
they reduce repeated protocol, validation, locale, HTTP, or authentication
logic.

Input parsing and request validation MUST be explicit. Zod schemas SHOULD be
used for authentication and other structured request bodies where the project
already has stable shape requirements. Manual validation is acceptable for
narrow BFF proxy payloads when the accepted fields are enumerated and trimmed
before forwarding.

Rationale: the current implementation relies on typed payloads, centralized
helpers, and feature-based components/routes to keep an 80 percent complete
frontend maintainable through the remaining work.

### III. Internationalized and Preference-Aware UX

User-facing text MUST be resolved through the centralized locale catalog when
the text belongs to shared application flows or persisted UX. Supported
languages are English, Portuguese, and Spanish. New language keys MUST preserve
the same structure across locales and default to English when a locale value is
missing or invalid.

User preferences for language and colors MUST remain first-class behavior.
Locale changes MUST update the `locale` cookie and authenticated user language
preferences when applicable. Color customization MUST continue to use CSS
variables so layouts, shared components, and runtime preference loading stay
consistent across public and private pages.

Rationale: multilingual navigation, auth flows, notes, financial screens, and
settings are already part of the product surface; future work must not regress
that consistency.

### IV. Secure Session and Server-Side Integration

Authentication tokens MUST be stored only in HttpOnly cookies and MUST NOT be
read from client-side code, persisted in localStorage, or exposed in rendered
payloads. Server-side routes MUST read the cookie, validate the session when
required, and forward the token to the external API as a Bearer token.

Private pages MUST remain protected by middleware and server-side user checks.
Public authentication pages MUST redirect authenticated users away from login,
registration, and recovery flows. Public note reads MAY attempt the public
external endpoint first, but private note access MUST require an active session.

Rationale: the project already separates session ownership from UI state; this
is mandatory to preserve confidentiality and predictable access control.

### V. Consistent UI System and Runtime Performance

UI work MUST preserve the existing shared visual system based on Tailwind CSS,
CSS variables, `ui-*` component classes, the peach/brown default theme, and
runtime user preferences. New pages and components MUST reuse established
loading, error, success, card, input, button, navigation, and floating-page
patterns unless a specification explicitly justifies a new pattern.

Client components MUST avoid unnecessary network waterfalls and stale state
updates. Related data needed together SHOULD be fetched in parallel. Async
effects MUST guard against updating unmounted components when the current
pattern already does so. Rich text rendering MUST preserve the current public
versus private note behavior, including selectable public content and protected
private placeholders.

Rationale: the implemented UI depends on a coherent, preference-aware runtime
theme and predictable loading states; fragmented styles or inefficient fetch
patterns would reduce perceived quality and maintainability.

## Security Requirements

- Sensitive environment values MUST NOT be exposed with `NEXT_PUBLIC_`.
- External API endpoints MUST be read server-side and MUST fail clearly when
  required configuration is missing.
- Secrets and tokens MUST NOT be hardcoded in source files or documentation.
- Internal API routes MUST return normalized JSON responses and avoid leaking
  raw external API details beyond user-meaningful error messages.
- Mutating routes MUST require an authenticated cookie when operating on
  protected resources.
- Cookie options MUST keep `httpOnly`, `sameSite: "lax"`, root path scope, and
  production-only secure mode unless a future security specification replaces
  the session model.
- Client-side components MUST NOT call external service URLs directly.

## Performance Requirements

- Route handlers and client fetches that depend on fresh user data MUST use
  no-store semantics or an equivalent freshness strategy.
- Related independent requests SHOULD be executed in parallel, as already done
  for budgets and expenses.
- Client-only rendering MUST be used for components that can create hydration
  mismatch risks, including locale switching, runtime preferences, and rich
  text editing.
- Shared loading states MUST avoid covering persistent navigation unless the
  whole page is intentionally public and standalone.
- Additional dependencies MUST be justified by user-facing value, bundle impact,
  and consistency with the current Next.js, React, Tailwind, TipTap, Zod, and
  React Icons stack.
- The production build and lint process MUST remain compatible with the scripts
  declared in `package.json`.

## Development Workflow and Quality Gates

Specification-Driven Development is the project workflow. New work MUST start
from a clear specification, plan, and task list before implementation unless the
change is a narrow documentation or configuration correction.

Every feature plan MUST pass these constitution gates before implementation:

- BFF boundary is preserved; client code does not call external APIs directly.
- Authentication and authorization behavior is identified for every private
  route or protected operation.
- Locale and user preference impact is documented for user-facing text, layout,
  or theme changes.
- Environment variable changes distinguish public values from server-only
  configuration.
- Security-sensitive behavior remains server-side and does not expose tokens.
- Performance impact is considered for new client effects, route handlers,
  dependencies, and data-fetching patterns.
- Frontend validation is documented through lint/build expectations and manual
  verification steps. Automated coverage thresholds are not mandated for this
  frontend project unless a future specification introduces a test suite.

Documentation that describes architecture, deployment, i18n, or theming MUST be
updated when a change modifies the documented behavior. Git-related actions are
manual repository management steps and are outside the agent execution scope.

## Governance

This constitution is the authoritative source for architectural and development
principles in Organizando Tudo Web. Specifications, plans, tasks, code changes,
and documentation updates MUST be checked against it before implementation is
considered complete.

Amendments MUST include the reason for the change, the affected principles or
sections, the version impact, and any required updates to Spec Kit templates or
project documentation. Versioning follows semantic rules:

- MAJOR: incompatible governance changes or removal/redefinition of core
  principles.
- MINOR: new principles, new mandatory sections, or materially expanded
  guidance.
- PATCH: clarifications, wording improvements, and non-semantic corrections.

Compliance review MUST verify that future work preserves the BFF boundary,
server-side session ownership, i18n consistency, theme preference behavior,
security rules, and documented validation gates.

**Version**: 1.0.0 | **Ratified**: 2026-05-23 | **Last Amended**: 2026-05-23
