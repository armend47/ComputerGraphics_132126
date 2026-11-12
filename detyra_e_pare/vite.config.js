import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'models',
  base: './',
  build: { chunkSizeWarningLimit: 700 },
});
