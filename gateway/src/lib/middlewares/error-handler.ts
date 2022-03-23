import { FetchError } from 'node-fetch';
import { Request, Response, ErrorRequestHandler } from 'express';

import { Deps } from '../../app';

const errorHandler = ({ metric }: Deps): ErrorRequestHandler => (
  (err: any, req: Request, res: Response, next) => {
    if (err instanceof FetchError) {     
      metric.add('error.fetch', { type: err.type });
      return res.status(500).json({ message: 'An error has occurred' });
    }

    if (err.status) {
      metric.add('error', { type: err.name });
      return res.status(err.status).json({
        type: err.name,
        message: err.message,
        errors: err.errors
      });
    }

    metric.add('error', { type: 'generic' });
    res.status(500).json({ message: 'An error has occurred' });
  }
);

export default errorHandler;
