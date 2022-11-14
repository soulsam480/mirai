declare namespace NodeJS {
  interface ProcessEnv {
    ONBOARDING_SECRET: string
    REDIS_PORT: string
    NODE_ENV: 'development' | 'production'
    REFRESH_TOKEN_SECRET: string
    ACCESS_TOKEN_SECRET: string
  }
}
