import { Response } from 'node-fetch';

import requestHeaders from '../lib/utils/request-headers';

import { Deps } from '../app';
import { RequestOptions } from './loader';

const subscriptionLoaders = (deps: Deps) => {
  const { config, fetch } = deps;
  const { URL_SUBSCRIPTION_SERVICE: url } = config;

  const mainRoute = (options: RequestOptions): Promise<Response> => (
    fetch(`${url}${options.path}`, requestHeaders(options))
  );

  return { mainRoute };
};

export default subscriptionLoaders;
