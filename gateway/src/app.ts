import express from 'express';
import fetch from 'node-fetch';
import helmet from 'helmet';

import config, { Config } from './config/config';
import logger, { Logger } from './lib/logger';
import metric, { Metric } from './lib/metric';
import errorHandler from './lib/middlewares/error-handler';

import subscriptionRoutes from './routes/subscription-routes';

export interface Deps {
  config: Config
  logger: Logger
  metric: Metric
  router: express.Router
  fetch
}

export default async () => {
  const app = express();
  const router = express.Router();

  const deps = {
    config,
    fetch,
    router,
    logger,
    metric
  };

  app.use(helmet());
  app.use(express.json());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.DOMAIN);
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept', 'X-Requested-With');

    if (req.method === 'OPTIONS') {
      res.status(204).send();
      return;
    }
    next();
  });

  app.use('/subscription', subscriptionRoutes(deps));
  app.get('/health', (req, res) => res.send('ok'));
  
  app.use('*', (req, res) => res.status(404).send({}));
  app.use(errorHandler(deps));

  return app;
};
