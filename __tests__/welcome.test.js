import getApp from '../server';
import { initTestDatabse } from './lib/utils';

describe('test welcome route', () => {
  let app = null;

  beforeAll(async () => {
    app = await getApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await initTestDatabse(app);
  });

  test('Testing server start', async () => {
    const response = await app.inject({
      method: 'get',
      url: '/',
    });
    expect(response.statusCode).toBe(200);
  });

  test('Testing server about page', async () => {
    const response = await app.inject({
      method: 'get',
      url: '/about',
    });
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
