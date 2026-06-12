# Data Model: Preferences Domain

## Entities

### AppLocale

Represents an application-supported language.

**Values**:

- `en`: English.
- `pt`: Portuguese.
- `es`: Spanish.

**Validation Rules**:

- Values outside the list must be normalized to `en`.

### MessagesCatalog

Represents the centralized text dictionary by locale.

**Fields**:

- `nav`: Private navigation messages.
- `auth`: Login, registration, and recovery messages.
- `financial`: Financial dashboard and financial screen messages.
- `notes`: Notes list messages.
- `settings`: Settings screen messages.
- `editor`: Notes editor messages.
- `viewer`: Notes viewer messages.

**Relationships**:

- Is consumed by client-side components and server-side layouts.
- Depends on normalized `AppLocale`.

### UserPreferences

Represents persisted user preferences.

**Fields**:

- `language`: Preferred `AppLocale`.
- `colors`: Optional `ColorsPayload`.

**Relationships**:

- Belongs to `User`.
- Is loaded by `/api/user`.

### ColorsPayload

Represents the configurable interface color set.

**Fields**:

- `backgroundPrimary`
- `backgroundSecondary`
- `textPrimary`
- `textSecondary`
- `borderColor`
- `inputBackground`
- `headerBackground`
- `headerText`
- `primaryButtonBackground`
- `primaryButtonText`
- `secondaryButtonBackground`
- `secondaryButtonText`
- `languageSwitcherBackground`
- `languageSwitcherText`
- `languageSwitcherBorder`

**Relationships**:

- Is applied as global CSS variables.
- May come from saved preferences, defaults, or dark mode preset.

## State Transitions

- Selected locale updates `locale` cookie, `document.lang`, and change event.
- Authenticated user persists language through `PATCH /api/user/settings/language`.
- Settings loads preferences through `/api/user`.
- Saved colors are sent through `PATCH /api/user/settings/colors`.
- Reset applies `DEFAULT_COLORS`.
- Dark mode applies `DARK_MODE_COLORS`.
- Runtime applies loaded preferences or defaults when there is no user.
