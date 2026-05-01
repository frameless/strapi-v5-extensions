---
"@frameless/content-compliance-checker": patch
---

fix: resolve TypeError on admin panel load caused by named export in lazy-loaded App component

The `Component` loader in the plugin entry point was destructuring a named export `{ App }` from the page module, which failed in the production bundle. Converted `App` to a default export and simplified the lazy import to rely on the module's default export directly.
