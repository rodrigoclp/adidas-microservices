import { ValidationError } from 'express-validation';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { Deps } from '../../app';

const errorHandler = ({ metric }: Deps): ErrorRequestHandler =>
  (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
      metric.add('error', { type: 'validation' });
      return res.status(err.statusCode).json(err);
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
  };

export default errorHandler;
