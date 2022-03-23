// all of this is just a representation
// better to use a config service to have all of these data

import { sendMail } from './send-mail';

import { Deps } from '../app';

const subscriptionMail = (deps: Deps) => async ({ key, value }): Promise<void> => {
  const { logger, metric } = deps;
  const { email, firstName } = value;

  const templateId = {
    added: 'SubscriptionConfirmed',
    canceled: 'SubscriptionCanceled'
  }[key];

  try {
    await sendMail({ to: value.email }, templateId, { email, firstName });
  } catch (err) {
    logger.error(err.message);
    metric.add('error.sendMail');

    // re-produce the message on a retry mode ???
  }
};

export default subscriptionMail;
