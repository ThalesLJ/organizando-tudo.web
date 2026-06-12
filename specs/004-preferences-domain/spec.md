# Feature Specification: Preferences Domain

**Feature Branch**: `004-preferences-domain`

**Created**: 2026-06-12

**Status**: Done

**Input**: Retroactive specification for the Preferences domain based on the Domain Map in `FEATURES_TEMP.md` and the current project implementation.

## User Scenarios & Verification *(mandatory)*

### User Story 1 - Change application language (Priority: P1)

As a user, I want to select the interface language between English, Portuguese, and Spanish so I can use the system in my preferred language.

**Why this priority**: Language affects all navigation, authentication, notes, financial, settings, and feedback screens.

**Independent Verification**: The language switcher must update local state, the `locale` cookie, the `lang` attribute, visible messages, and, when authenticated, persist the preference through the BFF.

**Acceptance Scenarios**:

1. **Given** a user on any page, **When** they select `pt`, `en`, or `es`, **Then** the interface starts using messages for the selected language.
2. **Given** an authenticated user, **When** they change language, **Then** the preference is sent to `/api/user/settings/language`.
3. **Given** an unauthenticated visitor, **When** they change language, **Then** the local cookie is updated even if external persistence does not happen.

---

### User Story 2 - Use centralized translation catalog (Priority: P1)

As a product, I want visible text centralized in a locale catalog so pages remain consistent and translation drift is reduced.

**Why this priority**: The application is multilingual and needs coherent keys for shared flows.

**Independent Verification**: Components must consume messages through centralized helpers and locales must share the same key structure.

**Acceptance Scenarios**:

1. **Given** locale `en`, **When** the UI renders, **Then** English messages are used.
2. **Given** locale `pt`, **When** the UI renders, **Then** Portuguese messages are used.
3. **Given** locale `es`, **When** the UI renders, **Then** Spanish messages are used.
4. **Given** missing or invalid locale, **When** messages are resolved, **Then** the fallback is English.

---

### User Story 3 - Customize interface colors (Priority: P1)

As an authenticated user, I want to adjust interface colors, reset to defaults, or apply a dark theme preset so I can personalize my visual experience.

**Why this priority**: Custom colors affect the global experience and must be applied consistently across public and private pages.

**Independent Verification**: The `/settings` screen must load user preferences, apply defaults when needed, allow saving colors, reset colors, and apply the dark mode preset.

**Acceptance Scenarios**:

1. **Given** an authenticated user with saved colors, **When** they access `/settings`, **Then** fields show the loaded preferences.
2. **Given** a user changes colors, **When** they save, **Then** colors are persisted through `/api/user/settings/colors` and applied immediately.
3. **Given** a user triggers reset, **When** the action succeeds, **Then** default colors are restored and applied.
4. **Given** a user triggers dark mode, **When** the action succeeds, **Then** the dark preset is applied and saved.

---

### User Story 4 - Load preferences at runtime (Priority: P2)

As a user, I want my preferences applied when the application starts so language and theme appear correctly without manual setup on every access.

**Why this priority**: Global preferences need to load early to avoid inconsistent experience between public and private layouts.

**Independent Verification**: The root layout must include runtime preference loading, apply colors to the document, and normalize language.

**Acceptance Scenarios**:

1. **Given** a user with saved preferences, **When** the application starts, **Then** language and colors are applied at runtime.
2. **Given** unavailable user data or request failure, **When** runtime executes, **Then** default colors are applied.
3. **Given** invalid locale, **When** the application normalizes language, **Then** English is used as fallback.

### Edge Cases

- Missing or invalid locale is normalized to `en`.
- Language persistence may fail for visitors without a session, but the local cookie still changes.
- Incomplete color preferences use defaults per field.
- Saving colors updates CSS variables immediately before refresh.
- Private layout injects colors server-side when the authenticated user has preferences.
- Root layout defines `lang` from the normalized cookie.
- After login, runtime loading may overwrite the local cookie with `preferences.language` from the external API.
- The language BFF validates `en`, `pt`, and `es`; the colors BFF accepts a JSON color payload without hexadecimal format validation.
- The `/settings` screen reloads preferences when settings messages change after locale switching.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support locales `en`, `pt`, and `es`.
- **FR-002**: System MUST normalize unsupported locales to `en`.
- **FR-003**: System MUST store selected locale in the `locale` cookie.
- **FR-004**: System MUST update the document language when locale changes.
- **FR-005**: System MUST attempt authenticated language persistence through `/api/user/settings/language`.
- **FR-006**: System MUST centralize visible application messages in a shared catalog.
- **FR-007**: System MUST provide settings UI for editable color preferences.
- **FR-008**: System MUST persist color preferences through `/api/user/settings/colors`.
- **FR-009**: System MUST apply color preferences through CSS variables.
- **FR-010**: System MUST provide default colors and dark mode preset.
- **FR-011**: System MUST load user preferences at runtime from `/api/user`.
- **FR-012**: System MUST apply default colors when user preferences cannot be loaded.
- **FR-013**: System MUST refresh rendered state after successful preference persistence when needed.
- **FR-014**: System MUST treat dark mode as a persisted color preset, not as a separate theme mode.

### Key Entities *(include if feature involves data)*

- **AppLocale**: Application-supported language: `en`, `pt`, or `es`.
- **MessagesCatalog**: Centralized dictionary of text by locale.
- **UserPreferences**: User preferences with optional language and colors.
- **ColorsPayload**: Set of configurable colors applied as CSS variables.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of supported locales resolve messages for navigation, authentication, notes, financial, and settings.
- **SC-002**: Invalid locale always falls back to `en`.
- **SC-003**: Language changes reflect in the UI without requiring logout.
- **SC-004**: Saving colors applies the new theme immediately on the current page.
- **SC-005**: Preference loading failure does not prevent applying default colors.

## Assumptions

- Persisted preferences belong to the authenticated user in the external API.
- Visitors can use local language through cookies even without server-side persistence.
- Colors are applied through global CSS variables.
- Retroactive validation is performed manually, without creating automated tests.
