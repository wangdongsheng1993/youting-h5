/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_BASE_URL || 'http://testapi.youtinggsq.com/youtingh5api',
        changeOrigin: true,
      }
    }
  }
})
