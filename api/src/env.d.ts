// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />

interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    ONBOARDING_SECRET: string
    REDIS_PORT: string
    NODE_ENV: 'development' | 'production'
    REFRESH_TOKEN_SECRET: string
  }
}
