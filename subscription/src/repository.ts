import { Subscription, Filter, SubscriptionDoc } from './model';
export interface Repository {
  read: (filter?: Filter) => Promise<SubscriptionDoc[] | []>
  upsert: (filter: Filter, body: Subscription) => Promise<SubscriptionDoc>
  update: (filter: Filter, body: Subscription) => Promise<SubscriptionDoc>
  destroy: (filter: Filter) => Promise<{ deleteCount: number }>
  exists: (filter: Filter) => Promise<boolean>
}

const repository = (model): Repository => {
  const read = (filter?: Filter) => model.find(filter);

  const upsert = (filter: Filter, body: Subscription) => (
    model.findOneAndUpdate(
      filter,
      body,
      { upsert: true, overwrite: true, returnOriginal: false }
    )
  );

  const update = (filter: Filter, body: Subscription) => model.findOneAndUpdate(filter, body);

  const destroy = (filter: Filter) => model.deleteOne(filter);

  const exists = (filter: Filter) => model.exists(filter);

  return { read, upsert, update, destroy, exists };
};

export default repository;
