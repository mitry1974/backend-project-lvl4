import request from 'supertest';
import cookieParser from 'cookie';
import matchers from 'jest-supertest-matchers';
import { createTestApp } from './lib/utils';

describe('test sessions routes', () => {
  let app = null;

  beforeEach(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  test('Test login with good credentials', async () => {
    const formData = {
      email: 'coronavirus@2020.ru',
      password: '123456',
    };

    const loginResponse = await request(app.server)
      .post('/session')
      .send({ formData });

    expect(loginResponse.status).toBe(302);
  });

  test('Test login with wrong credentials', async () => {
    const formData = {
      email: 'wrong@email',
      password: '123456',
    };

    const loginResponse = await request(app.server)
      .post('/session')
      .send({ formData });

    expect(loginResponse.status).toBe(400);
  });

  test('Test login with missing email', async () => {
    const formData = {
      email: 'missing@email.ru',
      password: '123456',
    };

    const loginResponse = await request(app.server)
      .post('/session')
      .send({ formData });
    expect(loginResponse.status).toBe(401);
  });

  test('Test logout', async () => {
    const formData = {
      email: 'coronavirus@2020.ru',
      password: '123456',
    };

    const loginResponse = await request(app.server)
      .post('/session')
      .send({ formData });
    expect(loginResponse.status).toBe(302);

    const logoutResponse = await request(app.server)
      .get('/session/logout');
    expect(logoutResponse.status).toBe(302);
    const cookie = logoutResponse.header['set-cookie'];
    expect(cookie.session).toBeFalsy();
  });

  describe('Test logout route', () => {
  });
});
