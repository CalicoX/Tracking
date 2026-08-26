import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5175,
    strictPort: true,
  },
  // Vite 8 默认 lightningcss 会把成对的 backdrop-filter 收成最后一个。
  // 源码里 -webkit- 必须写在标准属性前面；cssTarget 再给 Safari 补前缀。
  build: {
    cssTarget: ['chrome87', 'safari14'],
  },
})
