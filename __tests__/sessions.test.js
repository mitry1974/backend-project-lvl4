import { initTestDatabse } from './lib/utils';
import getApp from '../server';
import { login, logout } from './lib/testHelpers/sessions';
import { testLoginData } from './lib/testHelpers/testData';

describe('test sessions routes', () => {
  let app = null;

  beforeAll(async () => {
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
    const loginResponse = await login({ app, formData: testLoginData.user2 });
    expect(loginResponse.status).toBe(302);

    const { status, cookie } = await logout({ app });
    expect(status).toBe(302);
    expect(cookie.session).toBeFalsy();
  });

  test('get login form route', async () => {
    const getResponse = await app.inject({
      method: 'get',
      url: app.reverse('getLoginForm'),
    });

    expect(getResponse.statusCode).toBe(200);
  });
});
