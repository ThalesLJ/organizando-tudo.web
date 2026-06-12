# Research: Preferences Domain

## Objective

Record the decisions already resolved by the current Preferences domain implementation, including language, message catalog, colors, and runtime loading.

## Resolved Decisions

### Supported locales

**Decision**: The application supports `en`, `pt`, and `es`.

**Implemented basis**: `src/lib/messages.ts` defines `AppLocale`, catalogs, and `normalizeLocale()`.

**Rationale**: The three languages already cover the main screens and provide predictable fallback to English.

### Centralized catalog

**Decision**: Shared text lives in `messages`.

**Implemented basis**: `src/lib/messages.ts` and `src/lib/locale-client.ts`.

**Rationale**: Components consume messages through helpers, reducing drift across pages and domains.

### Language persistence

**Decision**: Language changes update the local cookie and attempt persistence for the authenticated user.

**Implemented basis**: `src/components/language-switcher.tsx` and `src/app/api/user/settings/language/route.ts`.

**Rationale**: Visitors receive local cookie-based experience; authenticated users preserve preference in the external API.

### Color preferences

**Decision**: Colors are represented by explicit fields and applied as CSS variables.

**Implemented basis**: `src/components/settings-panel.tsx`, `src/components/user-preferences-runtime.tsx`, and `src/app/globals.css`.

**Rationale**: CSS variables allow shared components to reflect the theme without duplicating styles per page.

### Color presets

**Decision**: The UI offers default colors and a dark mode preset.

**Implemented basis**: `DEFAULT_COLORS` and `DARK_MODE_COLORS` in `settings-panel`.

**Rationale**: The user can revert customizations or apply a dark theme in one action.

### Server-side and runtime application

**Decision**: The private layout injects colors server-side when available, and the root layout loads preferences at runtime.

**Implemented basis**: `src/app/(private)/layout.tsx`, `src/app/layout.tsx`, and `UserPreferencesRuntime`.

**Rationale**: Preferences appear early in the private shell and are also normalized globally during application loading.

## Closed Ambiguities

- No locales beyond `en`, `pt`, and `es` are implemented.
- Operating-system theme detection is not implemented.
- No advanced visual theme editor exists beyond color inputs and presets.
- No automated test suite is configured for this domain.
