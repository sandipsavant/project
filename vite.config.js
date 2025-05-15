import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',        // Ensure output goes here
    emptyOutDir: true,     // Clean before building
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Optional alias
    },
  },
});
