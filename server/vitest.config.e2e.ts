import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    include: ['./**/*.{e2e-test, e2e-spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    root: './',
  },
  plugins: [swc.vite()],
});