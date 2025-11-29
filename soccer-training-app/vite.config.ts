import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use '/soccer-training-app/' for GitHub Pages, '/' for local preview
  base: command === 'build' && process.env.GITHUB_PAGES ? '/soccer-training-app/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    port: 3000,
    strictPort: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
}));
