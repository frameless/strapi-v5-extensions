import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/build/main.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: false,
  outDir: 'dist',
});
