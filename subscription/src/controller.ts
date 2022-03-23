import { Subscription, Filter, SubscriptionDoc } from './model';
import { Deps } from './app';

export interface Controller {
  (deps: Deps): {
    create: (body: Subscription) => Promise<SubscriptionDoc>
    readAll: () => Promise<SubscriptionDoc[] | []>
    readOne: (filter: Filter) => Promise<SubscriptionDoc[] | []>
    cancel: (filter: Filter) => Promise<boolean>
  }
}

const controller: Controller = ({ repository, producer, metric }: Deps) => {
  const create = async (body: Subscription) => {
    const { email, newsletterId } = body;

    if (await repository.exists({ email, newsletterId })) { return null; }

    const result = await repository.upsert({ email, newsletterId }, body);

    producer.send('added', JSON.stringify(body));

    return result;
  };

  const readAll = () => repository.read();

  const readOne = (filter: Filter) => repository.read(filter);

  const cancel = async (filter: Filter) => {
    if (!filter || !await repository.exists(filter)) { return null; }

    const count = await repository.destroy(filter);

    if (!count) { return false; }

    producer.send('canceled', JSON.stringify(filter));
    metric.add('subscription.canceled', { newsletterId: filter.newsletterId });
    return true;
  };

  return { create, readAll, readOne, cancel };
};

export default controller;
