import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { createTestApp } from './lib/utils';
import { login, logout } from './lib/testHelpers/sessions';
import { testLoginData } from './lib/testHelpers/testData';

describe('test sessions routes', () => {
  let app = null;

  beforeAll(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  afterAll(() => {
    app.close();
  });

  test('Test login with missing email', async () => {
    const loginData = {
      email: 'missing@email.ru',
      password: '123456',
    };
    const { status } = await login({ app, formData: loginData });
    expect(status).toBe(302);
  });

  test('Test login with invalid email', async () => {
    const loginData = {
      email: 'wrong@email',
      password: '123456',
    };
    const { status } = await login({ app, formData: loginData });
    expect(status).toBe(400);
  });

  test('Test login with valid login data', async () => {
    const { status } = await login({ app, formData: testLoginData.admin });

    expect(status).toBe(302);
  });

  test('Test logout', async () => {
    const { status } = await login({ app, formData: testLoginData.user1 });
    expect(status).toBe(302);

    const logoutResponse = await logout({ app });
    expect(logoutResponse.status).toBe(302);
    const cookie = logoutResponse.header['set-cookie'];
    expect(cookie.session).toBeFalsy();
  });

  test('Test logout route', async () => {
    const getResponse = await request(app.server)
      .get('/session/new');
    expect(getResponse.status).toBe(200);
  });
});
