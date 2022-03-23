export interface Config {
  PORT: string
  NODE_ENV: string
  STREAM_BROKERS: string
  STREAM_TOPIC: string
}

const config: Config = {
  PORT: process.env.PORT || '4002',
  NODE_ENV: process.env.NODE_ENV || 'development',
  STREAM_BROKERS: process.env.STREAM_BROKERS || 'localhost:9092',
  STREAM_TOPIC: 'subscription'
};

export default config;
