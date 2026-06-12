# Feature Specification: Experience System Domain

**Feature Branch**: `006-experience-system-domain`

**Created**: 2026-06-12

**Status**: Done

**Input**: Retroactive specification for the Experience System domain based on the Domain Map in `FEATURES_TEMP.md` and the current project implementation.

## User Scenarios & Verification *(mandatory)*

### User Story 1 - Navigate the private area with shared layout (Priority: P1)

As an authenticated user, I want to use a consistent private layout with header, navigation, user identification, and logout so I can access Dashboard, Financial, Notes, and Settings with uniform visual context.

**Why this priority**: The private layout is the common base for the main functional domains of the product.

**Independent Verification**: Accessing private pages with a valid session must render a themed shell, username, localized links, and logout action.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they access `/dashboard`, **Then** they see a private header with username, navigation, and logout.
2. **Given** an authenticated user with saved colors, **When** the private layout renders, **Then** CSS variables reflect their preferences.
3. **Given** selected locale, **When** private navigation renders, **Then** labels use localized messages.

---

### User Story 2 - Reuse shared visual system (Priority: P1)

As a maintainer, I want shared visual primitives so pages, forms, cards, buttons, inputs, and feedback have coherent behavior and appearance.

**Why this priority**: Visual consistency reduces drift between domains and supports incremental evolution.

**Independent Verification**: Components must reuse classes such as `ui-shell`, `ui-panel`, `ui-card`, `ui-input`, `ui-button-primary`, `ui-button-secondary`, `ui-muted`, `ui-error`, and `ui-success`.

**Acceptance Scenarios**:

1. **Given** a form in any domain, **When** inputs and buttons appear, **Then** they use the same variable system and shared classes.
2. **Given** request error or success, **When** feedback is displayed, **Then** it uses shared visual patterns.
3. **Given** an autofilled input, **When** the browser applies autofill, **Then** styling remains coherent with the theme.

---

### User Story 3 - Show consistent loading and feedback (Priority: P1)

As a user, I want to see consistent loading, error, and success states so I can understand asynchronous operation state without losing page context.

**Why this priority**: Asynchronous operations exist in authentication, financial, notes, and settings; inconsistent feedback reduces trust.

**Independent Verification**: Interactive components must set loading or saving state, clear previous errors, call an internal route, parse JSON, and show localized fallback when needed.

**Acceptance Scenarios**:

1. **Given** a private page loading data, **When** loading is in progress, **Then** `AppLoading` appears inside the content area without covering the persistent header.
2. **Given** a public standalone page loading, **When** there is no private header, **Then** loading may occupy the full page area.
3. **Given** a failed request, **When** the error is captured, **Then** localized or normalized message is displayed to the user.

---

### User Story 4 - Present public authentication shell with social profile (Priority: P2)

As a visitor, I want to see authentication screens with consistent public layout and social links when applicable so I can recognize the product and access profile channels without affecting the authentication flow.

**Why this priority**: The authentication shell is the first public contact with the application and must preserve visual identity.

**Independent Verification**: Login, registration, and recovery must share visual shell, theme, and language switcher; social links appear in shells where the component is configured to show them.

**Acceptance Scenarios**:

1. **Given** a visitor on `/login`, **When** the page renders, **Then** form and public shell appear centered and responsive.
2. **Given** login or registration form with social links enabled, **When** the shell renders, **Then** LinkedIn and GitHub links appear with icons.
3. **Given** visitor changes language in the public shell, **When** the UI updates, **Then** form text uses the selected locale.

### Edge Cases

- Private pages with floating class remove the outer panel so cards can float directly on the theme.
- Loading on private pages must not cover persistent navigation.
- Public note content remains selectable; private note content remains non-selectable.
- Feedback should use localized fallback when the API returns unknown error.
- Input autofill should keep colors coherent with the theme.
- Social links belong to the public shell and do not replace real authentication.
- Social links are hardcoded in the current public shell and do not represent social login.
- During logout in progress, the button displays `"..."` as fixed state.
- Visual panel removal in floating pages depends on modern CSS `:has()` support.
- Error and success feedback share similar visual structure and differ mainly by text.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide shared private layout for authenticated pages.
- **FR-002**: System MUST show authenticated username in the private header.
- **FR-003**: System MUST provide localized private navigation links for Dashboard, Financial, Notes, and Settings.
- **FR-004**: System MUST provide logout action in the private header.
- **FR-005**: System MUST apply user color preferences to the private shell when available.
- **FR-006**: System MUST maintain shared UI classes for shell, panel, card, input, buttons, muted text, error, and success.
- **FR-007**: System MUST use CSS variables as the source of visual theme values.
- **FR-008**: System MUST provide shared `AppLoading` behavior for async loading states.
- **FR-009**: System MUST keep private loading inside content area when navigation persists.
- **FR-010**: System MUST provide consistent request feedback patterns for loading, saving, error, and success states.
- **FR-011**: System MUST provide shared public authentication shell for login, registration, and recovery.
- **FR-012**: System MAY display LinkedIn and GitHub social links in authentication shells where `showSocialLinks` is enabled.
- **FR-013**: System MUST preserve public note text selection and private note content protection through global styles.
- **FR-014**: System MUST keep social links separate from authentication behavior.

### Key Entities *(include if feature involves data)*

- **PrivateShell**: Authenticated layout with header, navigation, username, logout, and content panel.
- **UiPrimitive**: Shared visual class based on CSS variables.
- **LoadingState**: Shared visual state for asynchronous loading.
- **FeedbackState**: Error, success, saving, or loading state shown to the user.
- **AuthPageShell**: Public shell reused by authentication screens.
- **SocialLink**: Visual link to an external profile shown in the public shell.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of main private pages render inside the shared authenticated layout.
- **SC-002**: 100% of components that display error or success use shared visual patterns.
- **SC-003**: Private page loading preserves visible navigation.
- **SC-004**: `ui-*` classes cover cards, inputs, buttons, feedback, and shared panels.
- **SC-005**: Public authentication screens share visual shell and language support.

## Assumptions

- The visual experience is driven by Tailwind CSS and CSS variables.
- The private layout depends on the Identity domain to resolve the authenticated user.
- Theme preferences depend on the Preferences domain.
- Retroactive validation is performed manually, without creating automated tests.
