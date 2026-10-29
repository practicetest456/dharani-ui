import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: UI on :5173, calls to /api go to Spring Boot on :8080 (no CORS needed).
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8080' } },
});
