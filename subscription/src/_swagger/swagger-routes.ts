import express from 'express';
import * as swaggerUi from 'swagger-ui-express';

import swaggerDoc from './swagger.json';

const swaggerRoutes = () => {
  const router = express.Router();

  router.use('/', swaggerUi.serve);
  router.get('/', swaggerUi.setup(swaggerDoc));

  return router;
};

export default swaggerRoutes;
