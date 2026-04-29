---
"@frameless/strapi-tiptap-editor": patch
---

Fix missing styles in production builds.

Design tokens and component library CSS were not applied in production
because the Strapi Plugin SDK extracts CSS into a standalone
`dist/style.css` file without referencing it from the JS bundles. A
post-build script now embeds the extracted CSS directly into the compiled
bundles so styles are injected at runtime regardless of how the consuming
app loads the plugin.
