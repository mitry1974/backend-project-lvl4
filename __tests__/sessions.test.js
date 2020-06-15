import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { createTestApp } from './lib/utils';
import { login } from './lib/testHelpers';

describe('test sessions routes', () => {
  let app = null;

  beforeEach(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });
  const loginTestData = [
    {
      loginData: {
        email: 'coronavirus@2020.ru',
        password: '123456',
      },
      loginStatus: 302,
    },
    {
      loginData: {
        email: 'wrong@email',
        password: '123456',
      },
      loginStatus: 400,
    },
    {
      loginData: {
        email: 'missing@email.ru',
        password: '123456',
      },
      loginStatus: 401,
    },
  ];
  test.each(loginTestData)('Test login with different login data and status', async ({ loginData, loginStatus }) => {
    const { status } = await login({ app, formData: loginData });

    expect(status).toBe(loginStatus);
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
