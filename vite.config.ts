import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Extract base URL from VITE_API_URL (e.g., http://localhost:8000/api/v1 -> http://localhost:8000)
  const apiUrl = env.VITE_API_URL || 'http://localhost:8000/api/v1'
  const apiBaseUrl = apiUrl.replace(/\/api\/v1$/, '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true, // Listen on all addresses (0.0.0.0)
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
