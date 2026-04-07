/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: ['ds2.lv.csdgy.cn', 'localhost'],
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://testapi.youtinggsq.com/youtingh5api',
          changeOrigin: true,
        }
      }
    }
  }
})
