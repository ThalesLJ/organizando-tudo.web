# Research: Notes Domain

## Objective

Record the decisions already resolved by the current Notes domain implementation, including private management, publishing, rich text editor, and public viewing.

## Resolved Decisions

### Notes data source

**Decision**: Notes are loaded and persisted by the external API through the BFF.

**Implemented basis**: `src/app/api/notes/route.ts` and `src/app/api/notes/[id]/route.ts` read `auth_token`, forward the Bearer token, and return normalized JSON.

**Rationale**: The browser does not access the external API directly and the session remains protected on the server.

### Client-side list with search, filters, and sorting

**Decision**: Search, filters, and sorting are derived in the client-side component after loading the notes collection.

**Implemented basis**: `src/components/notes-manager.tsx`.

**Rationale**: The user can reorganize the list without new requests for every filter or sorting change.

### Preview privacy

**Decision**: Private notes do not show real content in the preview; public notes render selectable HTML.

**Implemented basis**: `getPreviewContent()` in `notes-manager` and CSS rules in `src/app/globals.css`.

**Rationale**: The preview respects privacy and avoids accidental exposure of private content.

### Rich text editor

**Decision**: Creation and editing use the same TipTap component in client-only mode.

**Implemented basis**: `src/components/note-editor.tsx`.

**Rationale**: A single component reduces duplication and preserves title, content, visibility, and saving behavior.

### Saving

**Decision**: Creation uses `POST /api/notes`; editing uses `PUT /api/notes/:id`.

**Implemented basis**: `note-editor` calculates endpoint and method from `mode`.

**Rationale**: The contract follows the usual separation between resource creation and identifier-based update.

### Public viewing

**Decision**: `/view-note/:id` uses a standalone layout and fetches the note through an internal BFF route.

**Implemented basis**: `src/components/note-viewer.tsx`, `src/app/view-note/[id]/page.tsx`, and `src/app/api/notes/[id]/route.ts`.

**Rationale**: Public links can be opened outside the private area without exposing authenticated navigation.

### Authenticated fallback for reads by ID

**Decision**: The BFF route tries the external public endpoint first, then uses authenticated fallback when a token exists.

**Implemented basis**: `GET` in `src/app/api/notes/[id]/route.ts`.

**Rationale**: The same internal path serves public viewing and authenticated owner access while keeping the session rule for private content.

## Closed Ambiguities

- Server-side search is not implemented for notes.
- Pagination is not implemented for the notes list.
- Granular sharing permissions are not implemented; visibility is binary through `isPublic`.
- No additional frontend sanitization is documented beyond the current HTML rendering behavior.
- No automated test suite is configured for this domain.
