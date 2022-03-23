import express from 'express';
import request from 'supertest';

import routes from './routes';

describe.only('Routes', () => {
  let app;
  let defaultDeps;

  beforeEach(() => {
    app = express();

    defaultDeps = {
      router: express.Router(),
      controller: () => ({
        create: () => ({ _id: 'fake-id' }),
        readAll: () => ([{ data: 'mock-read-all-response' }]),
        readOne: () => ([{ data: 'mock-read-one-response' }]),
        cancel: () => ({ data: 'mock-cancel-response' })
      }),
      validate: () => (req, res, next) => next(),
      schema: {
        subscription: 'mock-schema-subscription',
        unique: 'mock-schema-unique'
      }
    };
  });

  describe('POST /subscription', () => {
    it('Should respond with content', async () => {
      app.use('/subscription', routes(defaultDeps));
      const response = await request(app)
        .post('/subscription')
        .send({ data: 'fake' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBe('fake-id');
    });

    it('Should respond 409 if the subscription is already registered', async () => {
      const deps = {
        ...defaultDeps,
        controller: () => ({
          ...defaultDeps.controller,
          create: () => null
        })
      };

      app.use('/subscription', routes(deps));
      await request(app)
        .post('/subscription')
        .send({ data: 'fake' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(409);
    });
  });

  describe('GET /subscription', () => {
    it('Should respond 200 with content', async () => {
      app.use('/subscription', routes(defaultDeps));
      const result = await request(app)
        .get('/subscription')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(result.body).toStrictEqual([{ data: 'mock-read-all-response' }]);
    });
  });

  describe('GET /subscription/:email/:newsletterId', () => {
    it('Should respond 200 with content', async () => {
      app.use('/subscription', routes(defaultDeps));
      const result = await request(app)
        .get('/subscription/aa@bb.com/123')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(result.body).toStrictEqual([{ data: 'mock-read-one-response' }]);
    });
  });

  describe('DELETE /subscription/:email/:newsletterId', () => {
    it('Should respond 200 if the subscription exists', async () => {
      app.use('/subscription', routes(defaultDeps));
      const result = await request(app)
        .delete('/subscription/aa@bb.com/123')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(result.body).toStrictEqual({});
    });

    it('Should respond 409 if the subscription does not exist', async () => {
      const deps = {
        ...defaultDeps,
        controller: () => ({
          ...defaultDeps.controller,
          cancel: () => null
        })
      };

      app.use('/subscription', routes(deps));
      await request(app)
        .delete('/subscription/aa@bb.com/123')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });
}); 
