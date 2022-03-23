// import from an external lib

import { Kafka, logLevel, RecordMetadata } from 'kafkajs';

import { Deps } from '../app';
import { Config } from './config';

export interface Producer {
  connect: (deps: Deps) => Promise<void>
  send: (key: string, value: string | Buffer) => Promise<RecordMetadata[]>
}
interface Stream {
  producer: Producer;
}

const stream = (config: Config): Stream => {
  const { STREAM_BROKERS, STREAM_TOPIC } = config;

  const kafka = new Kafka({
    clientId: 'subscription-events',
    brokers: STREAM_BROKERS.split(','),
    logLevel: logLevel.ERROR
  });

  const producer = kafka.producer();

  return {
    producer: {
      connect: async ({ logger, metric }) => {
        return producer.connect().catch(() => {
          logger.error('Kafka connection error');
          metric.add('error.connection.kafka');
          process.exit(1);
        });
      },
      send: (key, value) =>
        producer.send({
          topic: STREAM_TOPIC,
          messages: [{
            key,
            value
          }]
        })
    }
  };
};

export default stream;
