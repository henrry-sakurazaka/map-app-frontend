/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_SECRET?: string
  readonly VITE_LINE_CLIENT_ID?: string
  readonly VITE_LINE_CLIENT_SECRET?: string
  // 必要な環境変数をここに追加
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
