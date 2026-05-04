# @frameless/content-compliance-checker

## 1.0.1

### Patch Changes

- e9e3a89: fix: resolve TypeError on admin panel load caused by named export in lazy-loaded App component

  The `Component` loader in the plugin entry point was destructuring a named export `{ App }` from the page module, which failed in the production bundle. Converted `App` to a default export and simplified the lazy import to rely on the module's default export directly.

## 1.0.0

### Major Changes

- 24687d1: Migrate content-compliance-checker to Strapi v5
