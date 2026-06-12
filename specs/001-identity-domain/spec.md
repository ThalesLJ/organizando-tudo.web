# Feature Specification: Identity Domain

**Feature Branch**: `001-identity-domain`

**Created**: 2026-06-12

**Status**: Done

**Input**: Retroactive specification for the Identity domain based on the Domain Map in `FEATURES_TEMP.md` and the current project implementation.

## User Scenarios & Verification *(mandatory)*

### User Story 1 - Enter the application with a valid session (Priority: P1)

As an authenticated user, I want the application root to send me directly to the private area so I can continue my organization workflow without visiting the login screen again.

**Why this priority**: The entry route decides whether the user enters the product or must authenticate. Without this decision, private areas are not reached predictably.

**Independent Verification**: With a valid session, accessing `/` must lead to `/dashboard`; without a valid session, accessing `/` must lead to `/login`.

**Acceptance Scenarios**:

1. **Given** a user with a valid `auth_token` cookie, **When** they access `/`, **Then** the application redirects to `/dashboard`.
2. **Given** a visitor without a valid session, **When** they access `/`, **Then** the application redirects to `/login`.

---

### User Story 2 - Authenticate with email or username (Priority: P1)

As a visitor, I want to provide a single identifier containing either email or username and my password so I can start a session without choosing the credential type first.

**Why this priority**: Login and session creation are the required entry point for all private workflows.

**Independent Verification**: The login screen must accept `identifier`, `password`, and `keepLoggedIn`, create an HttpOnly session when the external API authenticates, and redirect to `/dashboard`.

**Acceptance Scenarios**:

1. **Given** valid email credentials, **When** the user submits the login form, **Then** the application creates the session and opens `/dashboard`.
2. **Given** valid username credentials, **When** the user submits the login form, **Then** the application creates the session and opens `/dashboard`.
3. **Given** invalid credentials, **When** the user submits the form, **Then** the screen shows a localized error message without exposing sensitive details.

---

### User Story 3 - Create an account and recover a password (Priority: P2)

As a visitor, I want to create my account and recover my password through a verification code so I can obtain or restore access to the product.

**Why this priority**: Registration and recovery reduce access blockers and complete the basic account lifecycle.

**Independent Verification**: Registration must validate username, email, and password before forwarding to the external API; recovery must send a code to email and allow reset with a 6-digit code and confirmed new password.

**Acceptance Scenarios**:

1. **Given** valid registration data, **When** the visitor creates an account, **Then** the application confirms registration and routes to `/login`.
2. **Given** an email entered for recovery, **When** code sending succeeds, **Then** the screen switches to the verification step.
3. **Given** a 6-digit code and matching passwords, **When** the visitor resets the password, **Then** the application shows success and allows returning to login.

---

### User Story 4 - End session and protect routes (Priority: P1)

As an authenticated user, I want to log out and have private pages protected so my data remains accessible only during an active session.

**Why this priority**: Route protection and local session termination preserve confidentiality and access control.

**Independent Verification**: Without `auth_token`, private routes must redirect to `/login`; with `auth_token`, public authentication routes must redirect to `/dashboard`; logout must clear the local session even if the external API call fails.

**Acceptance Scenarios**:

1. **Given** a visitor without a session, **When** they access `/dashboard`, `/financial`, `/notes`, `/add-note`, `/edit-note`, or `/settings`, **Then** the application redirects to `/login`.
2. **Given** an authenticated user, **When** they access `/login`, `/register`, or `/recover`, **Then** the application redirects to `/dashboard`.
3. **Given** an authenticated user, **When** they trigger logout, **Then** the local cookie is cleared and the user returns to `/login`.

### Edge Cases

- A login identifier containing `@` is treated as email; one without `@` is treated as username.
- Invalid login returns a friendly error and does not create a session cookie.
- `keepLoggedIn` false creates an 8-hour session; `keepLoggedIn` true creates a 30-day session.
- Registration does not automatically authenticate the user after success.
- Recovery requires a code with exactly 6 digits and a password between 8 and 100 characters.
- Code sending uses generic success feedback so email existence is not revealed.
- Successful password reset shows a success message and does not automatically redirect to `/login`.
- Middleware protects by cookie presence, while the private layout reinforces protection by resolving the user server-side.
- A present cookie with an invalid token can pass middleware, but server-side validation in the private layout or BFF routes blocks the session.
- External logout failure does not prevent local session cleanup.
- The current login response includes the external API token in the success JSON, but the client must not store or depend on that value; the effective session is the HttpOnly cookie.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST route `/` to `/dashboard` when an authenticated user is resolved from cookies.
- **FR-002**: System MUST route `/` to `/login` when no authenticated user is resolved.
- **FR-003**: System MUST provide public authentication pages for login, registration, and password recovery.
- **FR-004**: System MUST redirect authenticated users away from `/login`, `/register`, and `/recover` to `/dashboard`.
- **FR-005**: System MUST redirect unauthenticated users away from private routes to `/login`.
- **FR-006**: System MUST validate login payloads with `identifier`, `password`, and optional `keepLoggedIn` before forwarding credentials.
- **FR-007**: System MUST choose email login when `identifier` contains `@` and username login otherwise.
- **FR-008**: System MUST store authentication tokens only in the HttpOnly `auth_token` cookie.
- **FR-009**: System MUST support default 8-hour sessions and 30-day sessions when `keepLoggedIn` is selected.
- **FR-010**: System MUST validate registration with username length 3-32, valid email, and password length 8-100.
- **FR-011**: System MUST keep registration and login as separate flows.
- **FR-012**: System MUST support two-step password recovery through email code sending and code verification.
- **FR-013**: System MUST clear the local auth cookie during logout regardless of external logout result.
- **FR-014**: System MUST resolve authenticated user data server-side before rendering the private shell.
- **FR-015**: System MUST keep authentication copy localized through the centralized message catalog.
- **FR-016**: System MUST use generic password recovery success feedback that does not reveal whether the email exists.

### Key Entities *(include if feature involves data)*

- **User**: Authenticated person represented by username, email, and optional preferences resolved from the external API.
- **Session**: Browser session represented by the HttpOnly `auth_token` cookie with expiration based on login choice.
- **Credentials**: Login input containing `identifier`, `password`, and `keepLoggedIn`.
- **RegistrationRequest**: Account creation data containing username, email, and password.
- **PasswordRecoveryRequest**: Recovery data containing email, verification code, and replacement password.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of private routes listed in the domain redirect unauthenticated visitors to `/login`.
- **SC-002**: 100% of public authentication routes redirect authenticated users to `/dashboard`.
- **SC-003**: A valid login completes with session creation and dashboard navigation in a single user action after submitting credentials.
- **SC-004**: Password recovery can be completed through exactly two visible steps: send code and verify code.
- **SC-005**: Logout always removes local access in one action, even when the external logout service is unavailable.

## Assumptions

- A valid session is determined by the server using `auth_token` and the external user endpoint.
- The external API remains the source of truth for credential validation, account creation, password recovery, and user profile data.
- Public authentication screens are available to unauthenticated visitors only.
- Manual QA validates these retroactive requirements in the current production-oriented quality process.
