import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // дозволяє доступ не тільки з localhost
    port: 5000,
    origin: 'https://2db879b29b1f.ngrok-free.app' // домен через який відкриваєш
  }
})
