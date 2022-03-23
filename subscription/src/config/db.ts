import mongoose from 'mongoose';

import { Deps } from '../app';

const connect = ({ config, logger, metric }: Deps) => (
  mongoose.connect(config.DB_URL, { user: config.DB_USER, pass: config.DB_PASS }).catch(() => {
    logger.error('MongoDB connection error');
    metric.add('error.connection.mongo');
    process.exit(1);
  })
);

export default { connect };
