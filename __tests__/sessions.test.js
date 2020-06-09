import request from 'supertest';
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
    app = null;
  });

  test('Test login with good credentials', async () => {
    const formData = {
      email: 'coronavirus@2020.ru',
      password: '123456',
    };

    const unAuthGetResponse = await request(app.server)
      .get('/users');
    expect(unAuthGetResponse.status).toBe(403);

    const res = await request(app.server)
      .post('/session')
      .send({ formData });

    expect(res.status).toBe(302);

    const cookie = res.header['set-cookie'];
    expect(cookie.session).not.toBe('');

    const authGetResponse = await request(app.server)
      .get('/users')
      .set('Cookie', cookie);
    expect(authGetResponse.status).toBe(200);

    await request(app.server)
      .get('/session/logout');
    expect(authGetResponse.status).toBe(200);
  });

  test('Test login with wrong credentials', async () => {
    const formData = {
      email: 'wrong@email',
      password: '123456',
    };

    const res = await request(app.server)
      .post('/session')
      .send({ formData });
    expect(res.status).toBe(400);

    const unAuthGetResponse = await request(app.server)
      .get('/users');
    expect(unAuthGetResponse.status).toBe(403);
  });

  test('Test login with missing email', async () => {
    const formData = {
      email: 'missing@email.ru',
      password: '123456',
    };

    const res = await request(app.server)
      .post('/session')
      .send({ formData });
    expect(res.status).toBe(401);

    const unAuthGetResponse = await request(app.server)
      .get('/users');
    expect(unAuthGetResponse.status).toBe(403);
  });
  test('Test logout', async () => {
    const formData = {
      email: 'coronavirus@2020.ru',
      password: '123456',
    };

    const loginRes = await request(app.server)
      .post('/session')
      .send({ formData });
    expect(loginRes.status).toBe(302);

    const logoutRes = await request(app.server)
      .get('/session/logout');
    expect(logoutRes.status).toBe(302);
    const cookie = logoutRes.header['set-cookie'];
    expect(cookie.session).toBeFalsy();

    const unAuthResponse = await request(app.server)
      .get('/users')
      .set('Cookie', cookie);
    expect(unAuthResponse.status).toBe(403);
  });

  describe('Test logout route', () => {
  });
});
