declare namespace NodeJS {
  interface ProcessEnv {
    HASH: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
  }
}