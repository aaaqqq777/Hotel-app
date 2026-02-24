import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config'

// https://vite.dev/config/
export default mergeConfig(
  defineConfig({
    plugins: [react()],
  }),
  defineTestConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      globals: true,
    },
  })
)