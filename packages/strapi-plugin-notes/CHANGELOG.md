# @frameless/strapi-plugin-notes

## 1.1.0

### Minor Changes

- 7960439: # Improvements to the notes plugin
  - Added a preview button on each note to view its content in a read-only dialog without entering edit mode
  - Added a confirmation dialog before deleting a note to prevent accidental data loss
  - Widened the note dialog (max-width: 900px) to better accommodate longer content
  - Increased the content textarea height for a more comfortable writing experience
  - Added missing English and Dutch translations for the preview button, close action, and delete confirmation dialog

## 1.0.1

### Patch Changes

- b5a1322: # Security updates
  - Upgraded @strapi/strapi to 5.46.0 (validated in dashboard)
  - Fixed critical security vulnerabilities in Strapi core and dependencies
  - Ensured consistent dependency alignment across monorepo plugins

## 1.0.0

### Major Changes

- 8cca1b8: # Custom Strapi Plugin Notes

  Implement a custom Strapi plugin to enable users to create, manage, and organize notes within the Strapi admin interface.
