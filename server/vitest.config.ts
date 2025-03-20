import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    include: ['./**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
  },
  plugins: [swc.vite()],
});