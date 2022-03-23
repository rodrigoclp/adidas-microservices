import ipCheck from './ip-check';

describe('ipCheck middleware', () => {
  let defaultDeps;
  let req = ({ headers: { ['x-forwarded-for']: '8.8.8' } })
  const resStatusSpy = jest.fn();
  const nextSpy = jest.fn();
  const res = { status: null, json: null };
  res.status = () => { resStatusSpy(); return res; };
  res.json = () => res;

  beforeEach(() => {
    nextSpy.mockReset();
    resStatusSpy.mockReset();

    defaultDeps = {
      metric: { add: () => { } },
      config: {
        ALLOWED_IPS: '1.2.3,4.5.6,6.7.8',
        NODE_ENV: 'production'
      }
    };
  });

  it('Should not pass if in production and a wrong IP', () => {
    ipCheck(defaultDeps)(req, res, nextSpy)
    expect(resStatusSpy).toBeCalled();
  });

  it('Should pass if in production and a correct IP', () => {
    req = ({ headers: { ['x-forwarded-for']: '4.5.6' } })

    ipCheck(defaultDeps)(req, res, nextSpy)
    expect(nextSpy).toBeCalled();
  });

  it('Should pass if not in production', () => {
    const deps = {
      ...defaultDeps,
      config: {
        ...defaultDeps.config,
        NODE_ENV: 'development'
      }
    };

    ipCheck(deps)(req, res, nextSpy)
    expect(nextSpy).toBeCalled();
  });
}); 
