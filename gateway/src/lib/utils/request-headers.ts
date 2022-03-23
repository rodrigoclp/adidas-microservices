import { RequestOptions } from '../../loaders/loader';

const requestHeaders = ({ method, body }: RequestOptions): RequestOptions => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (['POST'].includes(method)) {
    return {
      ...options,
      body: JSON.stringify(body)
    };
  }

  return options;
};

export default requestHeaders;
