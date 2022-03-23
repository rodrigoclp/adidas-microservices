// import from an external lib

import { Kafka, logLevel, Consumer } from 'kafkajs';

import { Config } from './config';

interface StreamConsumer {
  connectAndSubscribe: () => Promise<Consumer>
}
interface Stream {
  consumer: StreamConsumer;
}

const stream = (config: Config): Stream => {
  const { STREAM_BROKERS, STREAM_TOPIC } = config;

  const kafka = new Kafka({
    clientId: 'mailing-events',
    brokers: STREAM_BROKERS.split(','),
    logLevel: logLevel.ERROR
  });

  const consumer = kafka.consumer({ groupId: 'single' });

  return {
    consumer: {
      connectAndSubscribe: async () => {
        await consumer.connect();
        await Promise.all(STREAM_TOPIC.split(',').map((topic) => consumer.subscribe({ topic })));

        return consumer;
      }
    }
  };
};

export default stream;
