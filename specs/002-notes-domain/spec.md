# Feature Specification: Notes Domain

**Feature Branch**: `002-notes-domain`

**Created**: 2026-06-12

**Status**: Done

**Input**: Retroactive specification for the Notes domain based on the Domain Map in `FEATURES_TEMP.md` and the current project implementation.

## User Scenarios & Verification *(mandatory)*

### User Story 1 - Manage private and public notes list (Priority: P1)

As an authenticated user, I want to view my notes with search, filters, sorting, and management actions so I can quickly find and administer content.

**Why this priority**: The notes list is the main surface of the domain and centralizes navigation, privacy, edit, and delete actions.

**Independent Verification**: Accessing `/notes` with a valid session must load notes through the BFF, allow search by title or content, filter by visibility, and sort by date or title.

**Acceptance Scenarios**:

1. **Given** an authenticated user with existing notes, **When** they access `/notes`, **Then** the list displays note cards with title, date, status, and actions.
2. **Given** public and private notes, **When** the user chooses a visibility filter, **Then** the list shows only matching notes.
3. **Given** a search term, **When** the user types in the search field, **Then** the list considers note title and text extracted from note HTML.

---

### User Story 2 - Create and edit rich text notes (Priority: P1)

As an authenticated user, I want to create and edit notes with rich text formatting so I can record structured content with title, body, and visibility.

**Why this priority**: Creation and editing are the central content production workflows in the Notes domain.

**Independent Verification**: Accessing `/add-note/new` or `/edit-note/:id` must show an editor with title, rich text content, visibility control, and save actions.

**Acceptance Scenarios**:

1. **Given** an authenticated user creating a note, **When** they enter title and content and save, **Then** the note is created through `/api/notes`.
2. **Given** an authenticated user editing an existing note, **When** they change title or content and save, **Then** the note is updated through `/api/notes/:id`.
3. **Given** an editor with no changes or an empty title, **When** the user attempts to save, **Then** the save action remains unavailable.

---

### User Story 3 - Control privacy and sharing (Priority: P1)

As an authenticated user, I want to switch notes between private and public so I can control which content can be shared outside the private area.

**Why this priority**: Note visibility defines data exposure and must be treated as central security and privacy behavior.

**Independent Verification**: In the list and editor, the `isPublic` property must control previews, direct access, and public viewing.

**Acceptance Scenarios**:

1. **Given** a private note, **When** it appears in the list, **Then** the preview shows a protected placeholder without selectable content.
2. **Given** a public note, **When** it appears in the list, **Then** the preview renders HTML content and allows text selection.
3. **Given** a user toggling visibility, **When** the action succeeds, **Then** the note status is updated in the list.

---

### User Story 4 - View a public note (Priority: P2)

As a visitor or authenticated user, I want to open a public note by link so I can read shared content without navigating through the private area.

**Why this priority**: Public viewing enables content sharing while keeping public and private notes separated.

**Independent Verification**: Accessing `/view-note/:id` must fetch the note through an internal route, try the public endpoint first, and render the note in a standalone layout when it is public.

**Acceptance Scenarios**:

1. **Given** an existing public note, **When** someone accesses `/view-note/:id`, **Then** the title and HTML content are shown without private navbar.
2. **Given** a private note and a user without session, **When** someone accesses `/view-note/:id`, **Then** access is denied because there is no active session.
3. **Given** a public note unavailable from the public endpoint and an authenticated user, **When** they access the link, **Then** the BFF may try authenticated fallback.

### Edge Cases

- Empty list shows a localized no-notes message.
- Loading errors show localized feedback without breaking the page.
- Delete requires browser confirmation.
- Private note HTML content is not shown in the list preview.
- Empty public note content shows a no-content placeholder.
- Search ignores HTML tags when comparing content.
- Editor edit mode loads current content before allowing save.
- Public view does not render the private layout.
- The public viewer back action points to `/notes`.
- `/add-note` redirects to `/add-note/new`; creation uses the `new` identifier as the page entry.
- Some editor text is still fixed in the component, while the list and main actions use the centralized catalog.
- `<p></p>` content is treated as empty for editor enablement, but the BFF validates content by trimming the received HTML.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST list authenticated user notes through the internal `/api/notes` route.
- **FR-002**: System MUST require an authenticated session for private notes listing, creation, update, and deletion.
- **FR-003**: System MUST support search by title and plain text extracted from note HTML content.
- **FR-004**: System MUST support visibility filters for all, public, and private notes.
- **FR-005**: System MUST support sorting by updated date descending, updated date ascending, title ascending, and title descending.
- **FR-006**: System MUST hide private note content in list previews.
- **FR-007**: System MUST render public note previews as selectable HTML content.
- **FR-008**: System MUST allow authenticated users to create notes with title, content, and `isPublic`.
- **FR-009**: System MUST allow authenticated users to edit existing notes by ID.
- **FR-010**: System MUST allow authenticated users to delete notes after confirmation.
- **FR-011**: System MUST allow authenticated users to toggle note visibility.
- **FR-012**: System MUST provide rich text controls for bold, italic, underline, bullet list, ordered list, paragraph, and text alignment.
- **FR-013**: System MUST expose public note viewing through `/view-note/:id`.
- **FR-014**: System MUST attempt the external public note endpoint before authenticated fallback for note reads by ID.
- **FR-015**: System MUST keep Notes UI copy localized through the centralized message catalog.
- **FR-016**: System MUST keep the current public viewer back action pointing to `/notes`.

### Key Entities *(include if feature involves data)*

- **Note**: User content with `id`, `title`, `content`, `isPublic`, `createdAt`, and `updatedAt`.
- **NoteVisibility**: Public or private state defined by `isPublic`.
- **NoteFilterState**: Client-side state composed of search, visibility filter, and sorting.
- **RichTextContent**: HTML body produced by the rich text editor.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated user can list, search, filter, and sort notes without reloading the page.
- **SC-002**: 100% of private note previews hide the real content in the list.
- **SC-003**: 100% of public notes can render selectable content when displayed as public.
- **SC-004**: Note creation and editing require a filled title before saving.
- **SC-005**: Public note viewing uses a standalone layout without the private navbar.

## Assumptions

- The external API is the source of truth for note persistence.
- The BFF is responsible for forwarding tokens and normalizing responses.
- Rich text content is stored as HTML.
- Retroactive validation is performed manually, without creating automated tests.
