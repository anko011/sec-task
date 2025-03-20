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
    server: {
        host: true,
        port: 3000,
        strictPort: true,
        watch: {
            usePolling: true
        }
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts'
    }
});
