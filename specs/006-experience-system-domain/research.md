# Research: Experience System Domain

## Objective

Record the decisions already resolved by the current Experience System domain implementation, including private layout, visual primitives, loading, feedback, and public authentication shell.

## Resolved Decisions

### Private layout

**Decision**: Private pages share a shell with header, username, localized navigation, and logout.

**Implemented basis**: `src/app/(private)/layout.tsx` and `src/components/logout-button.tsx`.

**Rationale**: The user keeps consistent context and access to the main domains.

### Theme application in private shell

**Decision**: Saved user colors are applied as CSS variables in the private shell during server-side rendering.

**Implemented basis**: `src/app/(private)/layout.tsx`.

**Rationale**: The private shell is born with user preferences when they exist.

### Shared visual system

**Decision**: `ui-*` classes and CSS variables define common visual primitives.

**Implemented basis**: `src/app/globals.css`.

**Rationale**: Cards, panels, inputs, buttons, and feedback remain coherent across domains.

### Floating pages

**Decision**: Pages with specific classes can remove the outer panel to use floating cards.

**Implemented basis**: `:has()` rules in `src/app/globals.css`.

**Rationale**: Some screens need a more open visual composition without leaving the global theme.

### Shared loading

**Decision**: `AppLoading` provides a common visual state for loading.

**Implemented basis**: `src/components/app-loading.tsx` and usage in Dashboard, Financial, Notes, Note Viewer, and Settings.

**Rationale**: Asynchronous loading keeps a consistent visual pattern.

### Request feedback

**Decision**: Interactive components follow a loading/saving, previous-error clearing, BFF call, JSON parse, and localized fallback pattern.

**Implemented basis**: Auth forms, financial manager, notes manager, note editor, and settings panel.

**Rationale**: The user receives predictable feedback even when the API returns an unexpected error.

### Public authentication shell

**Decision**: Login, registration, and recovery use a shared visual shell with social link support.

**Implemented basis**: `src/components/auth-page-shell.tsx`.

**Rationale**: The first public experience remains consistent without mixing real authentication with profile links.

## Closed Ambiguities

- There is no component library separate from the app.
- There is no design system published as a package.
- Social links do not implement social login.
- No automated test suite is configured for this domain.
