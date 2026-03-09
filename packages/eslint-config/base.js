import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import onlyWarn from 'eslint-plugin-only-warn';
import importPlugin from 'eslint-plugin-import';
import { jsRules } from './javascript-rules.js';
import json from 'eslint-plugin-json';

export const defaultIgnores = [
  // Build outputs
  '**/dist/**',
  '**/build/**',

  // Dependencies
  '**/node_modules/**',

  // Generated types & code
  '**/types/generated/**',
  '**/generated/**',
  'src/types/**', // keep if intentionally scoped to root src/
  'lib/types/**', // keep if intentionally scoped to root lib/

  // Framework / tool caches
  '**/.next/**',
  '**/.strapi/**',
  '**/.turbo/**',
  '**/.tmp/**',
  '**/.cache/**',
  '**/.rollup.cache/**',

  // Coverage & test output
  '**/coverage/**',

  // Minified files
  '**/*.min.js',

  // Misc
  '**/patches/**',
  '**/sample/**',
  '**/.strapi-updater.json',
];
/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    files: ['**/*.json'],
    ...json.configs['recommended'],
  },
  {
    ignores: defaultIgnores,
  },
  // --- Import Plugin Integration ---
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    // DO NOT redefine the "import" plugin here
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      ...jsRules,
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/no-named-as-default': 'off',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    files: [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/tests/**/*.{ts,tsx,js,jsx}',
      '**/setupTests.{ts,js}',
    ],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        global: 'readonly',
      },
    },
  },
  {
    files: [
      '**/config/**/*.{ts,tsx,js,jsx}',
      '**/src/index.{ts,js}',
      '**/lib/**/*.{ts,tsx,js,jsx}',
      '**/app/**/*.{ts,tsx,js,jsx}',
      '**/*.config.{ts,js}',
    ],
    languageOptions: {
      globals: {
        process: 'readonly',
        strapi: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
];

/**
 * Create a custom ESLint configuration with additional ignores.
 *
 * @param {string[]} additionalIgnores - Additional patterns to ignore
 * @returns {import("eslint").Linter.Config[]}
 */
export function createConfig(additionalIgnores = []) {
  return config.map((cfg) => (cfg.ignores ? { ...cfg, ignores: [...defaultIgnores, ...additionalIgnores] } : cfg));
}
