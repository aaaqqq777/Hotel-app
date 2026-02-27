import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://47.236.128.86:3000',
        changeOrigin: true,
      }
    }
  }
})