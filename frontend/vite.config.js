import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // дозволяє доступ не тільки з localhost
    port: 5000,
    origin: 'https://db2dacfba014.ngrok-free.app',
    proxy: {
      '/api': 'http://localhost:4000'
    },
  }
})
