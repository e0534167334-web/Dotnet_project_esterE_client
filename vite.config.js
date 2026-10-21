import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// הפורט 5173 מוגדר ב-CORS של השרת (Cors:AllowedOrigins ב-appsettings.json)
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
