import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'c2ba-182-5-132-245.ngrok-free.app'
    ]
  },
  build: {
    outDir: 'build',
  }
})