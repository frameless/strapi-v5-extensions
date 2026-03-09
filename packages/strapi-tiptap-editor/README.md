# Strapi TipTap Custom Field Documentation (Strapi v5)

## Overview

This project provides a **custom rich-text editor field** for Strapi using TipTap.  
It replaces the default Strapi WYSIWYG editor with a modern, extensible editing experience and advanced structured content features.

The editor has been migrated from **Strapi v4 to Strapi v5**.  
All features remain the same as in Strapi v4, with internal code improvements and UI enhancements to align with Strapi v5 architecture and admin design.

---

## Migration Summary (v4 → v5)

### What Stayed the Same

All existing features from the Strapi v4 implementation remain unchanged:

- Same editor capabilities
- Same extensions
- Same output structure
- Same authoring experience
- Same stored content format

### Improvements in v5 Version

- Cleaner and improved codebase
- Updated to Strapi v5 plugin architecture
- UI refinements for better usability
- Improved performance and maintainability
- Better extension structure for future scalability

No feature functionality has been removed or altered.

---

## ⚠️ Breaking Change (Important)

When migrating a Strapi project from **v4 → v5** and using this custom TipTap field,  
you must update your collection/content-type schema JSON.

### Old (Strapi v4 default rich text)

```json
"content": {
  "type": "richtext",
  "required": true
}
```

### New (Strapi v5 TipTap custom field)

```json
"content": {
  "type": "customField",
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "customField": "plugin::strapi-tiptap-editor.strapi-tiptap-editor"
}
```

If this change is not applied, the editor will not load correctly in Strapi v5.

## Strapi 5 Custom Field Usage (Based on Official Strapi Documentation)

This custom editor is implemented using the Strapi v5 Custom Field API, which allows plugins to register reusable field types that can be used in content-types.

### Using the Custom Field in Content-Type Builder

Once the plugin is installed and registered:

1. Open Content-Type Builder
2. Edit or create a content type
3. Click Add another field
4. Go to Custom tab
5. Select TipTap Editor
6. Configure field (required, localized, etc.)
7. Save and rebuild admin panel

### Using the Field in Schema JSON

Strapi v5 stores custom fields in schema files.

Example:

```json
{
  "attributes": {
    "content": {
      "type": "customField",
      "customField": "plugin::strapi-tiptap-editor.strapi-tiptap-editor",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    }
  }
}
```

## Admin Settings Integration

Global editor configuration is available via:

**Strapi Admin → Settings → Strapi TipTap Editor**:

This allows runtime configuration without redeploy.

Possible settings:

- Enable/disable extensions
- Language options

## Key Features

### Core Editing

- Paragraph and lead paragraph
- Headings (H1–H6)
- Bold, italic, underline, strike, Code, Blockquote, Highlight
- Text alignment
- Ordered & unordered lists
- Horizontal rule
- Links
- Images
- YouTube
- Tables
- Word count

### Custom Extensions

#### Paragraph & Heading Selector

Dropdown allowing selection of:

- Paragraph
- Lead paragraph
- H1 → H6 headings

Used for semantic and structured content creation.

#### Price Widget Extension

Allows inserting product pricing dynamically.

**Behavior**:

- Connected to the price collection
- Appears when product pricing is available
- Inserts structured pricing component in

#### Language Attribute Extension

Allows assigning language metadata to selected text.

Example:

```html
<span lang="en" dir="ltr">Some Text</span>
```

Improves accessibility and multilingual SEO.

#### Table Support

The editor includes an advanced table extension that allows structured table creation and editing directly within the rich-text editor.

Tables are fully editable after insertion and provide multiple actions for managing structure and content.

##### Available Table Actions

The following table actions are available from the table toolbar/menu:

**Table**:

- Insert new table
- Insert table with caption
- Delete table
- Delete table with caption

**Rows**:

- Add row above
- Add row below
- Delete row

**Columns**:

- Add column before
- Add column after
- Delete column

**Header**:

- Toggle header row

**Captions**:

- Add table caption
- Edit caption text
- Remove caption
- Improve accessibility and semantics

**Cell**:

- Merge cells
- Split cells
- Edit cell content
- Cell formatting support
- Navigate between cells using keyboard

##### Keyboard Navigation

The table UI supports keyboard navigation:

- `↑ ↓ ← →` to navigate between cells
- `Enter` to select/apply actions
- `Esc` to close table action menu

##### Output Structure

Tables are stored as structured HTML and remain fully compatible with frontend rendering.

Example output:

```html
<figure>
  <figcaption>Caption</figcaption>
  <table>
    <colgroup>
      <col />
      <col />
      <col />
    </colgroup>
    <tbody>
      <tr>
        <th colspan="1" rowspan="1">
          <p>Head</p>
        </th>
        <th colspan="1" rowspan="1">
          <p>Head</p>
        </th>
        <th colspan="1" rowspan="1">
          <p>Head</p>
        </th>
      </tr>
      <tr>
        <td colspan="1" rowspan="1">
          <p>Body</p>
        </td>
        <td colspan="1" rowspan="1">
          <p>Body</p>
        </td>
        <td colspan="1" rowspan="1">
          <p>Body</p>
        </td>
      </tr>
      <tr>
        <td colspan="1" rowspan="1">
          <p>Body</p>
        </td>
        <td colspan="1" rowspan="1">
          <p>Body</p>
        </td>
        <td colspan="1" rowspan="1">
          <p>Bod</p>
        </td>
      </tr>
    </tbody>
  </table>
</figure>
```

#### Accordion Extension

Inserts semantic accordion blocks using `<details>` and `<summary>`.

Example:

```html
<details class="utrecht-details" open="">
  <summary class="utrecht-details__summary">Title</summary>
  <div class="utrecht-details__content" data-type="detailsContent">
    <p>Body</p>
  </div>
</details>
```

#### Media & Embed Support

- Images
- Insert YouTube Video
- Links

#### Custom Heading Anchor Extension

Generate ID for Headings & Copy Anchor Link

A custom extension automatically generates anchor IDs for headings and allows copying direct links.

**Features**:

- Automatically generates unique ID from heading text
- Ensures valid and SEO-friendly anchor format
- Allows copying anchor link directly
- Enables deep linking to content sections
- Supports table of contents navigation
