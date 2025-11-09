import process from 'node:process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number.parseInt(process.env.FRONTEND_PORT ?? '5173', 10),
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: Number.parseInt(process.env.FRONTEND_PORT ?? '4173', 10)
  }
});
