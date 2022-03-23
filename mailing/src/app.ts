import * as express from 'express';
import { Consumer } from 'kafkajs';

import stream from './config/stream';
import config, { Config } from './config/config';
import listener from './listener';
import logger, { Logger } from './lib/logger';
import metric, { Metric } from './lib/metric';

export interface Deps {
  config: Config
  consumer: Consumer
  logger: Logger
  metric: Metric
}

export default async () => {
  const app = express();
  const consumer = await stream(config).consumer.connectAndSubscribe();

  const deps = {
    config,
    consumer,
    logger,
    metric
  };

  listener(deps);

  app.get('/health', (req, res) => res.send('ok'));
  app.use('*', (req, res) => res.status(404).send({}));

  return app;
};
