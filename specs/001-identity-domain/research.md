# Research: Identity Domain

## Objective

Record the decisions already resolved by the current Identity domain implementation, without leaving open questions for future planning.

## Resolved Decisions

### Application entry

**Decision**: The `/` route works as an entry router.

**Implemented basis**: `src/app/page.tsx` resolves the authenticated user from cookies and redirects to `/dashboard` or `/login`.

**Rationale**: The product is private by default. The root route does not need to render a landing page while the main workflow depends on authentication.

### Session model

**Decision**: The session is represented by the HttpOnly `auth_token` cookie.

**Implemented basis**: `src/lib/auth.ts` centralizes cookie creation, cleanup, and authenticated user resolution. The cookie uses `httpOnly`, `sameSite: "lax"`, `path: "/"`, and `secure` only in production.

**Rationale**: The token is not available to client-side JavaScript and the BFF remains responsible for forwarding the Bearer token to the external API.

### Single identifier login

**Decision**: The `identifier` field accepts either email or username.

**Implemented basis**: `src/app/api/auth/login/route.ts` validates the payload with `loginSchema` and chooses the external payload format by checking for `@`.

**Rationale**: The user does not need to choose a credential type; the interface stays simple and the BFF normalizes the contract with the external API.

### Session duration

**Decision**: The default session lasts 8 hours; the persistent session lasts 30 days.

**Implemented basis**: `keepLoggedIn` defines cookie `maxAge` during login.

**Rationale**: The behavior balances secure defaults with optional convenience.

### Registration separated from login

**Decision**: Successful registration redirects to login and does not authenticate automatically.

**Implemented basis**: `src/components/register-form.tsx` and `src/app/api/auth/register/route.ts`.

**Rationale**: Account creation and session start remain separate flows, reducing coupling between registration and session handling.

### Password recovery

**Decision**: Recovery happens in two steps: send a code by email and verify the code with a new password.

**Implemented basis**: `src/components/recover-form.tsx`, `src/app/api/auth/send-code/route.ts`, and `src/app/api/auth/verify-code/route.ts`.

**Rationale**: The UI presents clear sending, reset, success, and error states while keeping password confirmation validation on the client.

### Route protection

**Decision**: Middleware provides the first cookie-based protection layer and the private layout reinforces validation by resolving the user server-side.

**Implemented basis**: `src/middleware.ts`, `src/app/(private)/layout.tsx`, and `src/lib/require-auth.ts`.

**Rationale**: Cookie presence drives quick navigation decisions, while server-side resolution protects against invalid or expired cookies.

## Closed Ambiguities

- OAuth, SSO, and social login are not implemented.
- Automatic authentication after registration is not implemented.
- Client-side token storage is not implemented.
- No automated test suite is configured for this domain.
