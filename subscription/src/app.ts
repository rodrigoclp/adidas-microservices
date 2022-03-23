import express from 'express';
import { validate } from 'express-validation';

import db from './config/db';
import stream, { Producer } from './config/stream';
import config, { Config } from './config/config';
import model from './model';
import routes from './routes';
import controller, { Controller } from './controller';
import repository, { Repository } from './repository';
import logger, { Logger } from './lib/logger';
import metric, { Metric } from './lib/metric';
import errorHandler from './lib/middlewares/error-handler';
import ipCheck from './lib/middlewares/ip-check';

import swaggerRoutes from './_swagger/swagger-routes';

const BASE_URL = '/api/v1';
export interface Deps {
  config: Config
  repository: Repository
  controller: Controller
  router: express.Router
  validate: ({ }) => any
  producer: Producer
  logger: Logger
  metric: Metric
}

export default async () => {
  const app = express();
  const router = express.Router();
  const streamProducer = stream(config).producer;

  const deps = {
    config,
    repository: repository(model),
    controller,
    router,
    validate,
    producer: streamProducer,
    logger,
    metric
  };

  await db.connect(deps);
  await streamProducer.connect(deps);

  app.use(express.json());

  if (config.NODE_ENV === 'development') {
    app.use(`${BASE_URL}/doc`, swaggerRoutes());
  }

  app.use(BASE_URL, ipCheck(deps), routes(deps));
  app.get(`${BASE_URL}/health`, (req, res) => res.send('ok'));

  app.use('*', (req, res) => res.status(404).send({}));
  app.use(errorHandler(deps));

  return app;
};
