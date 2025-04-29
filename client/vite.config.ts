/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src')
        }
    },

    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts'
    }
});
