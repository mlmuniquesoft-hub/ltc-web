import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'https://www.osmartbd.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
