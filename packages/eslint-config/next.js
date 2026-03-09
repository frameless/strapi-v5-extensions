import pluginNext from '@next/eslint-plugin-next';
import { config as baseConfig, defaultIgnores } from './base.js';
import { reactConfig } from './react-internal.js';
/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextJsConfig = [
  ...baseConfig,
  ...reactConfig,
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

/**
 * Create a custom Next.js ESLint configuration with additional ignores.
 *
 * @param {string[]} additionalIgnores - Additional patterns to ignore
 * @returns {import("eslint").Linter.Config[]}
 */
export function createNextConfig(additionalIgnores = []) {
  return nextJsConfig.map((cfg) =>
    cfg.ignores ? { ...cfg, ignores: [...defaultIgnores, ...additionalIgnores] } : cfg,
  );
}
