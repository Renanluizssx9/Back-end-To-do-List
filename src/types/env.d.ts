declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    MONGO_URI: string;
    PORT?: string;
  }
}
