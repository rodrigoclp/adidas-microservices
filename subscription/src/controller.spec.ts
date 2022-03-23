import { mockedBody, mockedFilter } from './_mock/data';
import controller from './controller';

describe('Controller', () => {
  let defaultDeps;

  beforeEach(() => {
    defaultDeps = {
      repository: {
        exists: () => false,
        upsert: () => 'mock-result',
        read: jest.fn(),
        destroy: () => 1
      },
      producer: { send: jest.fn() },
      metric: {
        add: jest.fn()
      }
    };
  });

  it('Should insert a new subscription', async () => {
    const result = await controller(defaultDeps).create(mockedBody);
    expect(result).toBe('mock-result');
  });

  it('Should not insert a new subscription', async () => {
    const deps = {
      ...defaultDeps,
      repository: {
        ...defaultDeps.repository,
        exists: () => true
      }
    };

    const result = await controller(deps).create(mockedBody);
    expect(result).toBeNull();
  });

  it('Should send data to a stream service if inserted a new subscription', async () => {
    await controller(defaultDeps).create(mockedBody);
    expect(defaultDeps.producer.send.mock.calls[0][0]).toBe('added');
  });

  it('Should read all subscriptions', async () => {
    await controller(defaultDeps).readAll();
    expect(defaultDeps.repository.read.mock.calls[0][0]).toBeUndefined();
  });

  it('Should read one subscription passing a filter parameter', async () => {
    await controller(defaultDeps).readOne(mockedFilter);
    expect(defaultDeps.repository.read.mock.calls[0][0]).toBe(mockedFilter);
  });

  it('Should not cancel if there is no subscription', async () => {
    const result = await controller(defaultDeps).cancel(mockedFilter);
    expect(result).toBeFalsy();
  });

  it('Should cancel if there is a subscription', async () => {
    const deps = {
      ...defaultDeps,
      repository: {
        ...defaultDeps.repository,
        exists: () => true
      }
    };

    const result = await controller(deps).cancel(mockedFilter);
    expect(result).toBeTruthy();
  });

  it('Should send data to a stream and metric services if canceled a subscription', async () => {
    const deps = {
      ...defaultDeps,
      repository: {
        ...defaultDeps.repository,
        exists: () => true
      }
    };

    await controller(deps).cancel(mockedFilter);
    expect(deps.producer.send.mock.calls[0][0]).toBe('canceled');
    expect(deps.metric.add.mock.calls[0][0]).toBe('subscription.canceled');
  });
}); 
