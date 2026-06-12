# Research: Platform Domain

## Objective

Record the decisions already resolved by the current Platform domain implementation, including BFF, external configuration, health check, metadata, and deployment.

## Resolved Decisions

### BFF as mandatory boundary

**Decision**: Browser code calls only internal `/api/*` routes; external calls stay in server-side route handlers.

**Implemented basis**: `src/app/api/**/route.ts`, `src/lib/http.ts`, `src/lib/external-api.ts`, and `src/lib/auth.ts`.

**Rationale**: The boundary protects tokens, avoids exposing external URLs to the client, and centralizes response normalization.

### Common JSON helpers

**Decision**: Common responses use shared helpers.

**Implemented basis**: `okJson`, `badRequest`, `unauthorized`, `serverError`, and `parseJsonBody` in `src/lib/http.ts`.

**Rationale**: The UI receives a predictable format and routes reduce duplicated HTTP handling.

### External API resolution

**Decision**: `EXTERNAL_USER_API_URL` is the central configuration for fetching the user and deriving other external routes.

**Implemented basis**: `src/lib/external-api.ts`.

**Rationale**: A single server-side variable supports user, auth, notes, budgets, expenses, and settings endpoints.

### Public health check

**Decision**: `/api/health` returns simple operational status.

**Implemented basis**: `src/app/api/health/route.ts` and `docs/deploy-web.md`.

**Rationale**: Deployment and basic monitoring need a public unauthenticated route to validate availability.

### Metadata base

**Decision**: `metadataBase` uses `NEXT_PUBLIC_SITE_URL` without trailing slash or a local fallback.

**Implemented basis**: `src/app/layout.tsx`.

**Rationale**: The application needs a consistent base URL in published environments and local development.

### Single-version deployment

**Decision**: Documented deployment uses GitHub Actions, a self-hosted runner, PM2, and a single active version.

**Implemented basis**: `.github/workflows/deploy.yml` and `docs/deploy-web.md`.

**Rationale**: The operational flow reduces release complexity and validates the published application through the health endpoint.

## Closed Ambiguities

- There is no direct browser -> external API communication for application data.
- There are no multiple active versions in the documented deployment model.
- There is no authenticated health check.
- There is no `dotnet` dependency for web validation.
- No automated test suite is configured for this domain.
