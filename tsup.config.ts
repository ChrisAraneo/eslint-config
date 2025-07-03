import { defineConfig } from 'tsup';

export default defineConfig({
  platform: 'node',
  target: 'node18',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: {
    resolve: true,
    entry: './index.ts',
  },
  format: ['cjs', 'esm'],
});
