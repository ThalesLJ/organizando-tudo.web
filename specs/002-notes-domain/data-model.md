# Data Model: Notes Domain

## Entities

### Note

Represents a note that belongs to an authenticated user.

**Fields**:

- `id`: Unique note identifier.
- `title`: Title shown in the list, editor, and viewer.
- `content`: HTML content produced by the rich text editor.
- `isPublic`: Defines whether the note can be viewed publicly.
- `createdAt`: Creation date.
- `updatedAt`: Last update date.

**Relationships**:

- Belongs to a `User`.
- May be displayed as `NoteListItem`.
- May be opened as `PublicNoteView` when `isPublic` is true.

### NoteListState

Represents local note list management state.

**Fields**:

- `notes`: Collection loaded through the BFF.
- `search`: Search term entered by the user.
- `visibilityFilter`: `all`, `public`, or `private`.
- `sortBy`: `date-desc`, `date-asc`, `title-asc`, or `title-desc`.
- `isLoading`: Initial loading state.
- `isDeleting`: Deletion state.
- `updatingVisibilityId`: Identifier of the note whose visibility is updating.
- `error`: Error message shown to the user.

### NoteEditorState

Represents note creation or editing state.

**Fields**:

- `mode`: `create` or `edit`.
- `noteId`: Identifier used during editing.
- `title`: Current title.
- `content`: Current HTML content.
- `originalTitle`: Title initially loaded during editing.
- `originalContent`: Content initially loaded during editing.
- `isPublic`: Selected visibility.
- `isLoading`: Existing note loading.
- `isSaving`: Save in progress.
- `error`: Error message shown to the user.

### PublicNoteView

Represents standalone reading of a note by ID.

**Fields**:

- `id`: Identifier read from the route.
- `title`: Displayed title.
- `content`: Rendered HTML content.
- `isPublic`: Indicator used by the external contract.

## State Transitions

- List loads authenticated notes through `/api/notes`.
- Search, filter, and sorting transform the loaded collection without a new call.
- Creation saves note through `POST /api/notes`.
- Editing loads through `GET /api/notes/:id` and saves through `PUT /api/notes/:id`.
- Visibility toggle updates `isPublic` through `PUT /api/notes/:id`.
- Deletion removes note through `DELETE /api/notes/:id` after confirmation.
- Public viewer tries public read and, when needed and possible, authenticated fallback.
