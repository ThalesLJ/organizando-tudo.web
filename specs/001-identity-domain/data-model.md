# Data Model: Identity Domain

## Entities

### User

Represents the authenticated user resolved by the external API.

**Fields**:

- `username`: Public username.
- `email`: Email associated with the account.
- `preferences`: Optional preferences used by other domains.

**Relationships**:

- Has an active `Session` when authenticated.
- May have language and color preferences consumed by the Preferences domain.

### Session

Represents local browser authentication.

**Fields**:

- `authToken`: Token received from the external API and stored only in the HttpOnly `auth_token` cookie.
- `maxAge`: Session duration in seconds.
- `sameSite`: `lax` policy.
- `path`: `/` scope.
- `secure`: Enabled only in production.

**Relationships**:

- Belongs to an authenticated `User`.
- Is consumed by BFF route handlers for protected calls.

### LoginCredentials

Represents the data submitted by a visitor to authenticate.

**Fields**:

- `identifier`: Email or username.
- `password`: User password.
- `keepLoggedIn`: Optional long-session preference.

**Validation Rules**:

- `identifier` must have at least 3 characters.
- `password` must have between 8 and 100 characters.
- `keepLoggedIn` defaults to `false` when omitted.

### RegistrationRequest

Represents account creation.

**Fields**:

- `username`: Username.
- `email`: Valid email.
- `password`: Initial password.

**Validation Rules**:

- `username` must have between 3 and 32 characters.
- `email` must be valid.
- `password` must have between 8 and 100 characters.

### PasswordRecovery

Represents the password recovery flow.

**Fields**:

- `email`: Email that receives the code.
- `code`: 6-digit verification code.
- `password`: New password.

**Validation Rules**:

- `email` must be valid.
- `code` must have exactly 6 characters.
- `password` must have between 8 and 100 characters.

## State Transitions

- Visitor without session accesses `/` and goes to `/login`.
- Authenticated user accesses `/` and goes to `/dashboard`.
- Valid login creates `Session`.
- Logout clears `Session`.
- Valid registration creates an external account but does not create `Session`.
- Valid recovery resets the password without creating `Session`.
