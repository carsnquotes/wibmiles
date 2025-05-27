/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_WEBHOOK_URL: string;
  // другие переменные окружения...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
