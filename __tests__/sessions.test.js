import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { initTestDatabse } from './lib/utils';
import getApp from '../server';
import { login, logout } from './lib/testHelpers/sessions';
import { testLoginData } from './lib/testHelpers/testData';

describe('test sessions routes', () => {
  let app = null;

  beforeAll(async () => {
    expect.extend(matchers);
    app = await getApp();
    await app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await initTestDatabse(app);
  });

  test('Login with missing email', async () => {
    const loginData = {
      email: 'missing@email.ru',
      password: '123456',
    };
    const { status } = await login({ app, formData: loginData });
    expect(status).toBe(302);
  });

  test('Login with invalid email', async () => {
    const loginData = {
      email: 'wrong@email',
      password: '123456',
    };
    const { status } = await login({ app, formData: loginData });
    expect(status).toBe(302);
  });

  test('Login with valid login data', async () => {
    const { status } = await login({ app, formData: testLoginData.admin });

    expect(status).toBe(302);
  });

  test('Logout', async () => {
    const { status } = await login({ app, formData: testLoginData.user1 });
    expect(status).toBe(302);

    const logoutResponse = await logout({ app });
    expect(logoutResponse.status).toBe(302);
    const cookie = logoutResponse.header['set-cookie'];
    expect(cookie.session).toBeFalsy();
  });

  test('Logout route', async () => {
    const getResponse = await request(app.server)
      .get('/session/new');
    expect(getResponse.status).toBe(200);
  });
});
