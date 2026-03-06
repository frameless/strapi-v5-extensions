# `@frameless/eslint-config`

Shared ESLint configurations for Frameless projects with support for TypeScript, React, and Next.js.

## Installation

```bash
npm install --save-dev @frameless/eslint-config eslint
```

## Usage

### Base Configuration

For TypeScript/JavaScript projects:

```js
// eslint.config.js
import { config } from '@frameless/eslint-config/base';

export default config;
```

### React Configuration

For React projects:

```js
// eslint.config.js
import { reactConfig } from '@frameless/eslint-config/react-internal';

export default reactConfig;
```

### Next.js Configuration

For Next.js projects:

```js
// eslint.config.js
import { nextJsConfig } from '@frameless/eslint-config/next-js';

export default nextJsConfig;
```

## Extending with Custom Ignores

You can extend the default ignore patterns using the `createConfig` functions:

```js
// eslint.config.js
import { createConfig } from '@frameless/eslint-config/base';
// or import { createReactConfig } from '@frameless/eslint-config/react-internal';
// or import { createNextConfig } from '@frameless/eslint-config/next-js';

export default createConfig([
  '*.config.js',
  'scripts/**',
  'public/**'
]);
```

## Default Ignore Patterns

The base configuration ignores the following patterns by default:

- `dist/**`
- `.strapi/**`
- `node_modules/**`
- `build/**`
- `coverage/**`
- `.tmp/**`
- `.turbo/**`
- `.next/**`
- `types/generated/**`
- `src/types/**`

## Features

- ✅ TypeScript support with `typescript-eslint`
- ✅ Prettier integration
- ✅ Import ordering and validation
- ✅ Turbo monorepo support
- ✅ React and React Hooks rules
- ✅ Next.js specific rules
- ✅ JSON file linting
- ✅ All errors converted to warnings
- ✅ Jest globals for test files
- ✅ Node.js and browser globals configured

## License

EUPL-1.2
