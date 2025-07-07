import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: {
    entry: './index.ts',
    resolve: true,
  },
  format: ['cjs', 'esm'],
  platform: 'node',
  sourcemap: true,
  splitting: false,
  target: 'node18',
});
