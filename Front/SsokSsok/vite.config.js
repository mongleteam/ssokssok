import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 외부 IP에서 접근 가능하도록 설정
    port: 5080, // 원하는 포트 번호 (예: 4000)
    strictPort: true,
    allowedHosts: ['j12e201.p.ssafy.io']
  },
  publicDir: 'public',
  assetsInclude: ['**/*.ttf'],
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
})
