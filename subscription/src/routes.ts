import { Request, Response, Router } from 'express';

import schema from './schema';
import { Deps } from './app';

const routes = (deps: Deps): Router => {
  const { router, controller, validate } = deps;
  const { create, readAll, readOne, cancel } = controller(deps);

  router.post(
    '/',
    validate(schema.subscription),
    async (req, res) => {
      const result = await create(req.body);

      if (!result) { return res.status(409).json({}); }
      res.json(result._id);
    }
  );

  router.get('/', async (req: Request, res: Response) => res.json(await readAll()));

  router.get(
    '/:email/:newsletterId',
    validate(schema.unique),
    async (req: Request, res: Response) => {
      const { email, newsletterId } = req.params || {};
      res.json(await readOne({ email, newsletterId }));
    }
  );

  router.delete(
    '/:email/:newsletterId',
    validate(schema.unique),
    async (req: Request, res: Response) => {
      const { email, newsletterId } = req.params || {};

      const result = await cancel({ email, newsletterId });

      if (!result) { return res.status(404).json({}); }
      res.json({});
    }
  );

  return router;
};

export default routes;
