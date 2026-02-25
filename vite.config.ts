import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config'


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


// // https://vite.dev/config/
// export default mergeConfig(
//   defineConfig({
//     plugins: [react()],
//     server: {
//       proxy: {
//         '/api': {
//           target: 'http://localhost:3000', // 假设后端运行在3000端口

//           changeOrigin: true,
//           rewrite: (path) => path.replace(/^\/api/, ''),
//         },
//         '/hotels': {
//           target: 'http://localhost:3000', // 代理酒店相关API
//           changeOrigin: true,
//         },
//       },
//     },
//   }),
//   defineTestConfig({
//     test: {
//       environment: 'jsdom',
//       setupFiles: ['./vitest.setup.ts'],
//       globals: true,
//     },
//   })
// )