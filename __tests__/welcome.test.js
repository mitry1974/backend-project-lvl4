import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import getApp from '../server';
import { initTestDatabse } from './lib/utils';

describe('test welcome route', () => {
  let app = null;

  beforeAll(async () => {
    expect.extend(matchers);
    app = await getApp();
    await app.listen();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await initTestDatabse(app);
  });

  test('Testing server start', async () => {
    const res = await request(app.server)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  test('Testing server about page', async () => {
    const res = await request(app.server)
      .get('/about');
    expect(res).toHaveHTTPStatus(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
