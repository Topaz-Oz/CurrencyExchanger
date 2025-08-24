export const envConfig = {
  EXCHANGERATE_API_KEY: process.env.EXCHANGERATE_API_KEY || 'your_api_key_here',
  PORT: process.env.PORT || 3001,
  API_GLOBAL_PREFIX: process.env.API_GLOBAL_PREFIX || 'api',
  SWAGGER_PATH: process.env.SWAGGER_PATH || 'docs',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
