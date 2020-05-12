import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { createTestApp } from './utils';

describe('test welcome route', () => {
  let app = null;

  beforeAll(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  test('Testing server start', async () => {
    const res = await request(app.server)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
