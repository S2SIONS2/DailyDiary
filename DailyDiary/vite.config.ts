import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/book': {
        target: 'https://openapi.naver.com/v1/search',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 경로 재작성
      }
    }
  }
})