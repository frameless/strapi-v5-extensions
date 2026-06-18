# @frameless/content-compliance-checker

## 1.0.3

### Patch Changes

- 5a248e3: Update NL Design System packages
  - `@utrecht/component-library-css` 9.0.0 → 9.0.12 (7.2.2 → 9.0.12 for content-compliance-checker)
  - `@utrecht/component-library-react` 12.0.0 → 14.0.1 (10.2.0 → 14.0.1 for content-compliance-checker)
  - `@utrecht/design-tokens` 5.0.1 → 6.2.1 (3.2.0 → 6.2.1 for content-compliance-checker)

## 1.0.2

### Patch Changes

- 19d92e5: # Translate labels
  - Translate Strapi dashboard labels from English to Dutch

- b5a1322: # Security updates
  - Upgraded @strapi/strapi to 5.46.0 (validated in dashboard)
  - Fixed critical security vulnerabilities in Strapi core and dependencies
  - Ensured consistent dependency alignment across monorepo plugins

## 1.0.1

### Patch Changes

- e9e3a89: fix: resolve TypeError on admin panel load caused by named export in lazy-loaded App component

  The `Component` loader in the plugin entry point was destructuring a named export `{ App }` from the page module, which failed in the production bundle. Converted `App` to a default export and simplified the lazy import to rely on the module's default export directly.

## 1.0.0

### Major Changes

- 24687d1: Migrate content-compliance-checker to Strapi v5
