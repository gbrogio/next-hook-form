import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entryPoints: ['./src/hooks/next-hook-form.ts'],
  outDir: './dist',
  tsconfig: './tsconfig-package.json',
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
});