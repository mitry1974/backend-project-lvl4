import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { createTestApp } from './lib/utils';
import { login } from './lib/testHelpers';

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

    expect(status).toBe(401);
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
    const loginData = {
      email: 'coronavirus@2020.ru',
      password: '123456',
    };
    const { status } = await login({ app, formData: loginData });

    expect(status).toBe(302);
  });

  test('Test logout', async () => {
    const { status } = await login({ app, formData: { email: 'coronavirus@2020.ru', password: '123456' } });
    expect(status).toBe(302);

    const logoutResponse = await request(app.server)
      .get('/session/logout');
    expect(logoutResponse.status).toBe(302);
    const cookie = logoutResponse.header['set-cookie'];
    expect(cookie.session).toBeFalsy();
  });

  describe('Test logout route', () => {
  });
});
