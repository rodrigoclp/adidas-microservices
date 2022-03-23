export interface Config {
  PORT: string
  NODE_ENV: string
  DOMAIN: string
  URL_SUBSCRIPTION_SERVICE: string
}

const config: Config = {
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DOMAIN: process.env.DOMAIN || 'localhost',
  URL_SUBSCRIPTION_SERVICE: process.env.URL_SUBSCRIPTION_SERVICE || 'http://localhost:4001'
};

export default config;
