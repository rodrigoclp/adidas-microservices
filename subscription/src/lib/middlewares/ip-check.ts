import { Deps } from 'app';

const ipCheck = ({ metric, config }: Deps) => (req, res, next) => {
  const { NODE_ENV, ALLOWED_IPS } = config;

  if (NODE_ENV !== 'production') {
    return next();
  }

  const ip: string = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (ALLOWED_IPS.split(',').includes(ip)) {
    return next();
  }

  metric.add('unauthorizedIP', { ip });
  res.status(401).json({});
};

export default ipCheck;
