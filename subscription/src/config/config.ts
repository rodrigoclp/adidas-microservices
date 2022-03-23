export interface Config {
  PORT: string
  NODE_ENV: string
  ALLOWED_IPS: string
  DB_URL: string
  DB_USER: string
  DB_PASS: string
  STREAM_BROKERS: string
  STREAM_TOPIC: string
}

const config: Config = {
  PORT: process.env.PORT || '4001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_IPS: process.env.ALLOWED_IPS || '',
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/subscription',
  DB_USER: process.env.DB_USER || 'user-adidas',
  DB_PASS: process.env.DB_PASS || 'pass-adidas',
  STREAM_BROKERS: process.env.STREAM_BROKERS || 'localhost:9092',
  STREAM_TOPIC: 'subscription'
};

export default config;
