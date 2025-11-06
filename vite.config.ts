import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // For aliases

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Matches tsconfig paths
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Your existing fix for Lucide HMR
  },
  css: {
    postcss: './postcss.config.js', // Ensures Tailwind works
  },
  server: {
    port: 3000,
    open: true, // Auto-open browser
  },
});