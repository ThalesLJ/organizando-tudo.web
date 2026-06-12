# Data Model: Platform Domain

## Entities

### BffRoute

Represents an internal application route used as boundary for the external API.

**Fields**:

- `path`: Internal `/api/*` path.
- `method`: Accepted HTTP method.
- `requiresAuth`: Indicates whether the route needs `auth_token`.
- `externalPath`: External path called server-side when applicable.
- `responseShape`: Normalized JSON format.

**Relationships**:

- May depend on `ExternalApiConfig`.
- May depend on `Session`.
- Returns `NormalizedJsonResponse`.

### ExternalApiConfig

Represents server-side configuration for the external API.

**Fields**:

- `EXTERNAL_USER_API_URL`: Base URL or full user endpoint.
- `externalUserApiUrl`: Final URL used for `/api/users/me`.
- `externalApiBaseUrl`: Derived origin for other external routes.

**Validation Rules**:

- `EXTERNAL_USER_API_URL` must exist.
- URL without specific path must resolve to `/api/users/me`.

### NormalizedJsonResponse

Represents the standardized response returned by the BFF.

**Fields**:

- `success`: Indicates success or failure.
- `data`: Success payload when applicable.
- `user`: User payload when applicable.
- `error`: Normalized error message or object.
- `status`: Corresponding HTTP status.

### HealthResponse

Represents the public health response.

**Fields**:

- `status`: Expected value `ok`.
- `service`: Expected value `web`.
- `timestamp`: Current server date and time as ISO string.

### MetadataConfig

Represents application metadata configuration.

**Fields**:

- `siteUrl`: `NEXT_PUBLIC_SITE_URL` value without trailing slash or local fallback.
- `metadataBase`: Base URL used by the framework.
- `title`: Default title and template configuration.

### DeployConfiguration

Represents operational data documented for deployment.

**Fields**:

- `WEB_DEPLOY_BASE_DIR`: Base directory on the server.
- `WEB_ENV_FILE`: Environment file path.
- `WEB_PM2_APP_NAME`: Application name in PM2.
- `healthEndpoint`: Public validation endpoint.

## State Transitions

- Route handler receives an internal browser call.
- BFF validates payload, session, and configuration.
- BFF calls external API server-side when applicable.
- BFF returns normalized JSON.
- Health endpoint returns public payload without session.
- Metadata resolves base URL during layout mounting.
- Deployment publishes a single version and validates `/api/health`.
