import { Router, Response, Request, NextFunction } from 'express';

import subscriptionLoader from '../loaders/subscription-loader';
import { Deps } from '../app';

const subscriptionRoutes = (deps: Deps): Router => {
  const { router } = deps;
  const loaders = subscriptionLoader(deps);

  router.use('/', async (req: Request, res: Response, next: NextFunction) => {
    const { method, body, path } = req;

    try {
      const result = await loaders.mainRoute({ method, body, path });
      res.status(result.status).send(await result.json());
    } catch (err) {
      next(err);
    }
  });

  return router;
};

export default subscriptionRoutes;
