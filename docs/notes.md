# Notes Page Specification

This document defines the behavior of the notes feature.

---

## 1) Data Model

Example:

```json
{
  "_id": "ObjectId",
  "title": "encrypted_string",
  "content": "encrypted_string",
  "isPublic": true,
  "userId": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

MongoDB collection name: `Notes`

---

## 2) Page Behavior

The notes module must use dedicated pages:

- `/notes`: list page with search, visibility filters, and sorting
- `/add-note/:id`: create page
- `/edit-note/:id`: edit page
- `/view-note/:id`: read-only public page with formatted HTML output

Each list item must show:

- Title (decrypted)
- Updated date
- Quick actions (View, Edit, Delete)

---

## 3) Available Actions

User must be able to:

- Create note
- Edit note
- Delete note
- View note

---

## 4) UI Requirements

- Listing style must follow the legacy card layout
- Create button must open a dedicated page (`/add-note/:id`)
- Edit must navigate to `/edit-note/:id`
- View must navigate to `/view-note/:id`
- Editing interface must use a robust rich text editor

---

## 5) Create Note

POST /api/notes

Fields:

- title
- content
- isPublic

In Next.js BFF, the internal route is:

- POST /api/notes

Create page action buttons:

- `Salvar`: saves the note and keeps the user on the editor flow
- No secondary save button is allowed on create page

---

## 6) Edit Note

PUT /api/notes/:id

In Next.js BFF, the internal route is:

- PUT /api/notes/:id

Edit page action buttons:

- `Salvar`: saves and keeps user on edit page
- `Salvar e Sair`: saves and returns to notes list page

---

## 7) Delete Note

DELETE /api/notes/:id

In Next.js BFF, the internal route is:

- DELETE /api/notes/:id

---

## 8) View Note

GET /api/notes/:id

Public endpoint:

- GET /api/notes/public/:id

List endpoint:

- GET /api/notes

The view page must render stored note content as formatted HTML.
The view page must render the note title before the content.
The view page must not render the private top navbar.
The view page must keep language selector and a back arrow to `/login`.
The back arrow must stay in the top-left corner.

---

## 9) Security Rules

- Private notes:
  - only authenticated owner can access
  - if there is no active session, note is not shown
- Public notes:
  - must be visible for anyone with the link
  - must not depend on active session

---

## 10) Rich Text Editor

- Notes content must support rich-text formatting
- Current frontend editor library: TipTap (`@tiptap/react` + StarterKit)

---

## 11) Encryption

- Title and content are stored encrypted
- Backend handles encryption/decryption
- ENCRYPTION_KEY is required for notes encryption
- The encryption key is derived with scrypt using fixed salt `salt`
- AAD `additional-data` must be used in encryption and decryption

Encrypted format:

- Current format: iv:authTag:cipherText (hex)

---

## 12) Empty State

If no notes:

- Show message:
  "No notes found"