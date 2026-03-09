# @frameless/eslint-config

## 1.1.2

### Patch Changes

- ecc501c: # Update default ignores in eslint config

## 1.1.1

### Patch Changes

- 290a15f: # ESLint Config: Dependencies Fix

  **Bug Fixes:**
  - Moved all ESLint plugins from devDependencies to dependencies
  - Added peerDependencies for eslint (^9.0.0) and typescript (^5.0.0)

## 1.1.0

### Minor Changes

- 4650852: # ESLint Config Update: New Custom Ignore Functions and Bug Fixes

  **Bug Fixes:**
  - Added missing `eslint-plugin-json` dependency
  - Removed duplicate config spreading in `react-internal.js`
  - Removed duplicate `import/order` rule definition
  - Fixed inconsistent rule value format
  - Removed `no-inner-declarations` rule (conflicts with TypeScript)
  - Improved `no-unused-vars` rule to support underscore prefix convention

  **New Features (Backward Compatible):**
  - Added `createConfig()` function for custom ignores
  - Added `createReactConfig()` function for custom ignores
  - Added `createNextConfig()` function for custom ignores
  - Exported `defaultIgnores` array
  - Added Jest globals for test files (`describe`, `it`, `expect`, `beforeEach`, etc.)
  - Added Node.js globals (`process`, `__dirname`, `__filename`, `global`)
  - Added browser globals for React projects (`React`, `EventListener`)
  - Added Strapi global for config files

  **Migration:** No changes required. Existing imports continue to work.

## 1.0.1

### Patch Changes

- 6cd9186: # Set package.json private to false to allow npm publishing

## 1.0.0

### Major Changes

- 1a25b5c: # Create eslint-config package
