import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  splitting: false,
  clean: false,
  loader: {
    '.json': 'json',
  },
});
