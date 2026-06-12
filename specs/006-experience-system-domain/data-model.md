# Data Model: Experience System Domain

## Entities

### PrivateShell

Represents the shared layout for authenticated pages.

**Fields**:

- `username`: Name displayed in the header.
- `navigationLinks`: Links to Dashboard, Financial, Notes, and Settings.
- `logoutAction`: Session termination action.
- `themeVariables`: CSS variables applied from user preferences.
- `contentPanel`: Area where private pages render content.

**Relationships**:

- Depends on `User` resolved by the Identity domain.
- Consumes `MessagesCatalog` and `ColorsPayload` from the Preferences domain.

### UiPrimitive

Represents a shared visual class.

**Values**:

- `ui-shell`
- `ui-panel`
- `ui-card`
- `ui-input`
- `ui-button-primary`
- `ui-button-secondary`
- `ui-muted`
- `ui-error`
- `ui-success`

**Relationships**:

- Uses `ThemeVariable`.
- Is consumed by Identity, Notes, Financial, and Preferences components.

### ThemeVariable

Represents a visual value applied globally.

**Fields**:

- `--bg-primary`
- `--bg-secondary`
- `--text-primary`
- `--text-secondary`
- `--border-color`
- `--input-background`
- `--header-background`
- `--header-text`
- `--primary-button-background`
- `--primary-button-text`
- `--secondary-button-background`
- `--secondary-button-text`
- `--language-switcher-background`
- `--language-switcher-text`
- `--language-switcher-border`

### LoadingState

Represents visual loading state.

**Fields**:

- `label`: Text displayed to the user.
- `scope`: Visual context, private or standalone.

**Relationships**:

- Uses localized messages.
- May remove the outer panel on private pages when rendered as content overlay.

### FeedbackState

Represents feedback for interactive operations.

**Fields**:

- `isLoading`: Loading in progress.
- `isSaving`: Saving in progress.
- `error`: Error message.
- `success`: Success message.

### AuthPageShell

Represents the public shell of authentication pages.

**Fields**:

- `title`: Displayed title or brand.
- `formContent`: Rendered form.
- `socialLinks`: Optional links to external profiles.
- `localeSupport`: Support for the global language switcher.

### SocialLink

Represents a visual external profile link.

**Fields**:

- `provider`: Provider name, such as LinkedIn or GitHub.
- `href`: External URL.
- `icon`: Visual icon.

## State Transitions

- Authenticated user enters private route and `PrivateShell` renders.
- Color preferences are converted into `ThemeVariable`.
- Components use `UiPrimitive` for consistent appearance.
- Asynchronous operation activates `LoadingState` or `FeedbackState`.
- Public authentication pages render `AuthPageShell`.
- Social links open external profiles without authenticating the user.
