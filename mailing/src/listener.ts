import subscriptionMail from './service/subscription-mail';

import { Deps } from './app';

const listener = (deps: Deps) => {
  const { consumer } = deps;

  consumer.run({
    eachMessage: async ({ topic, message: { key, value } }) => {
      const eventHandler = {
        subscription: subscriptionMail
      }[topic];

      eventHandler(deps)({
        key: key.toString(),
        value: JSON.parse(value.toString())
      });
    }
  });
};

export default listener;
