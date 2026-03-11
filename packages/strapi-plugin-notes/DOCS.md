# strapi-plugin-entity-notes

A Strapi v5 plugin that attaches freeform notes to any content type entry. Built with backwards compatibility for data migrated from Strapi v4.

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [API](#api)
- [Frontend Hook](#frontend-hook)
- [Legacy Data Support](#legacy-data-support)
- [Testing](#testing)

---

## Overview

Entity Notes lets editors attach titled notes to any document in the Strapi admin — articles, products, pages, or any custom content type. Notes are stored in their own collection (`plugin::entity-notes.note`) and linked to their parent document via two fields:

| Field        | Type             | Purpose                                                   |
| ------------ | ---------------- | --------------------------------------------------------- |
| `entitySlug` | string           | The UID of the content type, e.g. `api::articles.article` |
| `entityId`   | string \| number | The ID of the specific document                           |

The `entityId` field intentionally accepts both types. This is the core of the legacy compatibility story — see [Legacy Data Support](#legacy-data-support).

---

## How It Works

### Data flow

```shall
Admin UI
  └── useNotes hook (React Query)
        └── GET /entity-notes/notes/by-document?entitySlug=…&documentId=…
              └── noteController.findByDocument
                    ├── strapi.db.query(entitySlug).findOne({ where: { documentId } })
                    │     → resolves the document's legacy numeric id (if any)
                    └── strapi.db.query('plugin::entity-notes.note').findMany({
                          where: {
                            entitySlug: { $eq: entitySlug },
                            entityId: { $in: [documentId, legacyId, String(legacyId)] }
                          }
                        })
```

The server does all the heavy lifting. The client sends a single `documentId` (the Strapi v5 UUID) and the server resolves any legacy IDs before querying notes, ensuring notes created in v4 are always returned alongside notes created in v5.

---

## API

### `GET /entity-notes/notes/by-document`

Returns all notes attached to a specific document.

**Query parameters**:

| Parameter    | Required | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| `entitySlug` | yes      | Content type UID, e.g. `api::articles.article` |
| `documentId` | yes      | The Strapi v5 `documentId` (UUID string)       |

**Success response** `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "note-doc-abc",
      "title": "Editorial note",
      "content": "Check the intro paragraph before publishing.",
      "entitySlug": "api::articles.article",
      "entityId": "ohbcziti8lrm1lloobxaaxnv",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error responses**:

| Status | Condition                            |
| ------ | ------------------------------------ |
| `400`  | `entitySlug` or `documentId` missing |
| `500`  | Notes database query failed          |

**Notes are sorted by `title` ascending.**

---

### `POST /entity-notes/notes`

Creates a new note.

```json
{
  "data": {
    "title": "My note",
    "content": "Some text.",
    "entitySlug": "api::articles.article",
    "entityId": "ohbcziti8lrm1lloobxaaxnv"
  }
}
```

### `PUT /entity-notes/notes/:documentId`

Updates title and content of an existing note.

```json
{
  "data": {
    "title": "Updated title",
    "content": "Updated content."
  }
}
```

### `DELETE /entity-notes/notes/:id`

Deletes a note by its ID (numeric or documentId string).

---

## Frontend Hook

```ts
import { useNotes } from "./hooks/useNotes";

const { notes, createNote, updateNote, deleteNote } = useNotes({
  entitySlug: "api::articles.article",
  documentId: entry.documentId,
});
```

The hook is disabled automatically when either `entitySlug` or `documentId` is falsy, so it is safe to call unconditionally before the entry has loaded.

### Return value

| Property     | Type                        | Description                                                 |
| ------------ | --------------------------- | ----------------------------------------------------------- |
| `notes`      | `UseQueryResult<Notes[]>`   | React Query result with `data`, `isLoading`, `isError` etc. |
| `createNote` | `(input) => Promise<Notes>` | Creates a note and invalidates cache                        |
| `updateNote` | `(input) => Promise<Notes>` | Updates a note and invalidates cache                        |
| `deleteNote` | `(id) => Promise<void>`     | Deletes a note and invalidates cache                        |

All three mutations show a success or warning notification automatically via Strapi's `useNotification`.

---

## Legacy Data Support

This is the most important section for anyone maintaining or debugging this plugin.

### Background

Strapi v4 identified content entries with **auto-incrementing numeric IDs** (e.g. `44`). Notes created in v4 stored that number directly in `entityId`:

```json
{ "entityId": 44, "entitySlug": "api::articles.article" }
```

Strapi v5 replaced numeric IDs with **UUID-based `documentId` strings** (e.g. `"ohbcziti8lrm1lloobxaaxnv"`). Notes created in v5 store the UUID:

```json
{ "entityId": "ohbcziti8lrm1lloobxaaxnv", "entitySlug": "api::articles.article" }
```

After a v4 → v5 migration, a single document has **both** identifiers: a numeric `id` (preserved in the database row) and a new `documentId` UUID. Notes attached to that document before migration still reference the old numeric ID.

### How the controller bridges both worlds

When `findByDocument` is called with a `documentId`, it runs two queries:

**Step 1 — Resolve the legacy numeric ID**:

```ts
const document = await strapi.db.query(entitySlug).findOne({
  where: { documentId },
});
const legacyId = document?.id; // e.g. 44, or null for new documents
```

If this lookup fails for any reason (the content type doesn't exist yet, permissions, etc.) the error is silently swallowed and the controller continues with `legacyId = null`. Notes are still fetched — you just won't get legacy ones. This is an intentional trade-off to keep the happy path working even in degraded states.

**Step 2 — Build an inclusive ID filter**:

```ts
const entityIdFilters = [documentId]; // always include the UUID
if (legacyId) {
  entityIdFilters.push(legacyId, String(legacyId)); // add both numeric and string forms
}
```

Three forms are included because `entityId` could have been stored as a JS number (`44`), a numeric string (`"44"`), or a UUID string (`"ohbcziti8lrm1lloobxaaxnv"`) depending on when and how the note was created.

**Step 3 — Single server-side filtered query**:

```ts
const notes = await strapi.db.query("plugin::entity-notes.note").findMany({
  where: {
    entitySlug: { $eq: entitySlug },
    entityId: { $in: entityIdFilters },
  },
  orderBy: { title: "asc" },
});
```

This is a single database query with `WHERE entityId IN (...)`. Filtering happens at the database level — the plugin never fetches all notes and filters in memory.

### Decision summary

| Scenario                            | `entityIdFilters` value | Notes returned                                             |
| ----------------------------------- | ----------------------- | ---------------------------------------------------------- |
| New v5 document, no legacy data     | `["uuid"]`              | Only v5 notes                                              |
| Migrated document with legacy notes | `["uuid", 44, "44"]`    | Both v4 and v5 notes                                       |
| Document lookup fails               | `["uuid"]`              | Only v5 notes (graceful degradation)                       |
| Document not found (`null`)         | `["uuid"]`              | Only v5 notes                                              |
| Document with `id: 0` (falsy)       | `["uuid"]`              | Only v5 notes (0 is excluded by the `if (legacyId)` check) |

### What this means when writing new notes

New notes should always store the Strapi v5 `documentId` (UUID) as `entityId`. The numeric ID is only needed for reading legacy data — it should never be written into new notes.

---

## Testing

Tests are split across two files.

### `server/controllers/__tests__/note-controller.test.ts`

Pure unit tests for the controller. `@strapi/strapi` is fully mocked so the Strapi runtime never loads. Key scenarios covered:

- Input validation (missing `entitySlug` / `documentId`)
- Legacy ID resolution and inclusive `$in` filter construction
- Graceful degradation when document lookup fails or returns `null`
- Exactly 2 database queries per request
- Server-side filtering (not client-side)
- `id: 0` edge case (falsy, excluded from filters)

### `admin/hooks/__tests__/useNotes.test.tsx`

React hook tests using `@testing-library/react` and React Query. `@strapi/strapi/admin` is mocked. Key scenarios covered:

- Query disabled when `documentId` or `entitySlug` is absent
- Correct URL construction with encoded `entitySlug`
- `select()` unwrapping — `notes.data` is always a flat `Notes[]`
- Cache invalidation after `createNote`, `updateNote`, and `deleteNote`
- Success and warning notifications
- Error state when the API call fails

### Running tests

```bash
pnpm test
# or a single file
pnpm test note-controller
pnpm test useNotes
```
