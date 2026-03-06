



import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
const isProd = process.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: '0.0.0.0', // 使服务器可通过局域网访问
    port: 3001,      // 可以自定义端口
       proxy: {
      '/api': {
        target: 'https://api.kuaiyi.info',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    drop: isProd ? ['console', 'debugger'] : [], // 生产环境删掉，开发环境保留
  },
})
