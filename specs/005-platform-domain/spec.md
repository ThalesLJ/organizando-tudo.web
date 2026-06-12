# Feature Specification: Platform Domain

**Feature Branch**: `005-platform-domain`

**Created**: 2026-06-12

**Status**: Done

**Input**: Retroactive specification for the Platform domain based on the Domain Map in `FEATURES_TEMP.md` and the current project implementation.

## User Scenarios & Verification *(mandatory)*

### User Story 1 - Communicate with the external API through BFF (Priority: P1)

As a web application, I want to centralize external integrations in internal routes so tokens are protected, responses are normalized, and direct browser calls to the external API are prevented.

**Why this priority**: The BFF is the central architectural boundary of the project and supports Identity, Notes, Financial, and Preferences.

**Independent Verification**: Client-side flows must call only internal `/api/*` routes, while route handlers resolve the external URL, read the cookie, and forward the Bearer token when needed.

**Acceptance Scenarios**:

1. **Given** an authenticated operation, **When** the browser calls an internal route, **Then** the BFF reads `auth_token` and forwards the Bearer token server-side.
2. **Given** a request without session for a protected resource, **When** the BFF executes, **Then** it returns a normalized unauthorized response.
3. **Given** an external response with error, **When** the BFF receives the error, **Then** it returns normalized JSON without exposing unnecessary sensitive details.

---

### User Story 2 - Resolve external API configuration (Priority: P1)

As a system operator, I want to configure the external URL by environment so the application uses the correct origin without hardcoding.

**Why this priority**: Every integration depends on `EXTERNAL_USER_API_URL` resolved server-side.

**Independent Verification**: The application must accept `EXTERNAL_USER_API_URL` as either a full user endpoint or API base URL and fail clearly when the variable is missing.

**Acceptance Scenarios**:

1. **Given** `EXTERNAL_USER_API_URL` points to an API base, **When** the application resolves the current user, **Then** the final URL uses `/api/users/me`.
2. **Given** `EXTERNAL_USER_API_URL` points to a full endpoint, **When** the application resolves the current user, **Then** it uses the provided endpoint.
3. **Given** the variable is missing, **When** a server-side integration attempts to resolve the URL, **Then** an explicit configuration failure occurs.

---

### User Story 3 - Validate web operational health (Priority: P2)

As an operator, I want a public health check endpoint so I can confirm the web application is responding after deployment.

**Why this priority**: Deployment and operation need a simple public availability signal.

**Independent Verification**: Accessing `/api/health` must return JSON with `status`, `service`, and `timestamp`.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** `/api/health` is called, **Then** it returns `status: "ok"` and `service: "web"`.
2. **Given** deployment completed, **When** external validation calls the public endpoint, **Then** it receives the expected JSON response.

---

### User Story 4 - Support metadata and documented deployment (Priority: P2)

As an operator and maintainer, I want metadata base and deployment documentation defined so the application can be published with the correct URL and a repeatable operational flow.

**Why this priority**: Metadata and deployment are not end-user flows, but they support publishing, basic observability, and product operation.

**Independent Verification**: The root layout must resolve `metadataBase` from `NEXT_PUBLIC_SITE_URL` with local fallback; deployment documentation must describe GitHub Actions, self-hosted runner, PM2, and health check.

**Acceptance Scenarios**:

1. **Given** `NEXT_PUBLIC_SITE_URL` is defined, **When** metadata is mounted, **Then** the base URL uses the value without trailing slash.
2. **Given** the variable is missing, **When** metadata is mounted, **Then** the base URL uses local fallback.
3. **Given** the documented deployment process, **When** the operator follows the flow, **Then** the application is published as a single active version managed by PM2.

### Edge Cases

- External URL without path automatically resolves to `/api/users/me`.
- Missing external URL fails explicitly in a server-side helper.
- Protected routes return unauthorized when the cookie does not exist.
- Health check does not depend on session.
- Metadata removes trailing slash from `NEXT_PUBLIC_SITE_URL`.
- Deployment uses repository variables and an external environment file without hardcoded secrets.
- `NEXT_PUBLIC_APP_URL` appears in environment documentation but is not referenced by the current implementation in `src/`.
- Public deployment validation uses a fixed production URL for `/api/health`.
- `next.config.ts` does not define rewrites or proxy for the external API.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST keep browser-to-external-API communication blocked by using internal BFF routes.
- **FR-002**: System MUST centralize common JSON helpers for success, bad request, unauthorized, and server error responses.
- **FR-003**: System MUST parse JSON request bodies safely in BFF routes.
- **FR-004**: System MUST read `auth_token` server-side for protected external API calls.
- **FR-005**: System MUST resolve external API routes from server-only configuration.
- **FR-006**: System MUST support `EXTERNAL_USER_API_URL` as either full user endpoint or API base URL.
- **FR-007**: System MUST fail clearly when `EXTERNAL_USER_API_URL` is missing.
- **FR-008**: System MUST expose public `/api/health` returning service status and timestamp.
- **FR-009**: System MUST configure metadata base from `NEXT_PUBLIC_SITE_URL` with local fallback.
- **FR-010**: System MUST document deployment as a single active web version managed by PM2.
- **FR-011**: System MUST keep deployment validation based on public health endpoint.
- **FR-012**: System MUST keep external API access out of `next.config.ts` rewrites and inside server-side BFF routes.

### Key Entities *(include if feature involves data)*

- **BffRoute**: Internal API route that normalizes requests and responses.
- **ExternalApiConfig**: Server-side configuration used to resolve external URLs.
- **HealthResponse**: Public operational payload with status, service, and timestamp.
- **DeployConfiguration**: Repository variables and environment file paths needed by deployment.
- **MetadataConfig**: Base URL used by application metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of application data flows go through internal routes before the external API.
- **SC-002**: Protected resource without cookie receives normalized unauthorized response.
- **SC-003**: `/api/health` returns a valid payload without requiring authentication.
- **SC-004**: Missing external API configuration fails explicitly in server-side environment.
- **SC-005**: Documented deployment includes external validation of the health endpoint.

## Assumptions

- The external API remains the source of user, authentication, notes, and financial data.
- The web BFF does not replace the external API; it protects and normalizes integrations.
- The deployment flow is operated manually by the developer when needed and must not become an automatic Spec Kit task.
- Retroactive validation is performed manually, without creating automated tests.
