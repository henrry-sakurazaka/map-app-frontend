// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 以下の server オプションを追加または修正します
  server: {
    port: 3000, // 開発サーバーのポートを 3000 に固定
  },
   build: {
    sourcemap: false, // ソースマップを生成しない
  },
})