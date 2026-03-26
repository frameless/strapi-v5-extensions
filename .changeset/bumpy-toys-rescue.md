---
"@frameless/strapi-tiptap-editor": patch
---

Switch price widget from React context to a Zustand store for managing
product prices. This ensures NodeViews have reliable access to prices,
handling loading, success, and error states consistently.
