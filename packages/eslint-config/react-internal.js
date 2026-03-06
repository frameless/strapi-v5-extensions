import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import { config as baseConfig, defaultIgnores } from './base.js';
import { reactRules } from './react-rules.js';
/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const reactConfig = [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      ...reactRules.rules,
    },
  },
];

/**
 * Create a custom React ESLint configuration with additional ignores.
 *
 * @param {string[]} additionalIgnores - Additional patterns to ignore
 * @returns {import("eslint").Linter.Config[]}
 */
export function createReactConfig(additionalIgnores = []) {
  return reactConfig.map(cfg => 
    cfg.ignores ? { ...cfg, ignores: [...defaultIgnores, ...additionalIgnores] } : cfg
  );
}
