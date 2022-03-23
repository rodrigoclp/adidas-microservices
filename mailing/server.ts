import * as http from 'http';

import app from './src/app';
import config from './src/config/config';
import logger from './src/lib/logger';
import metric from './src/lib/metric';

(async () => {
  const port = config.PORT;
  const server = http.createServer(await app());

  const onServerListening = () => {
    process.on('unhandledRejection', (reason, promise) => {
      logger.error(`Unhandled promise on the service: ${promise}. Reason: ${reason}`);
      throw reason;
    });

    process.on('uncaughtException', err => {
      logger.error(`Uncaught exception on the service: ${err}`);
      process.exit(1);
    });

    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(sig => {
      process.on(sig, () => {
        try {
          server.close();
          process.exit(0);
        } catch (err) {
          logger.error(`Error on try to gracefully quit the service: ${err}`);
          process.exit(1);
        }
      });
    });

    logger.info(`Service started on port ${port}`);
  };

  const onServerError = error => {
    metric.add('error.server');

    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        logger.error(`Port ${port} requires elevated privileges`);
        process.exit(1);

      case 'EADDRINUSE':
        logger.error(`Port ${port} is already in use`);
        process.exit(1);

      default:
        throw error;
    }
  };

  server.listen(port);
  server.on('error', onServerError);
  server.on('listening', onServerListening);
})();
