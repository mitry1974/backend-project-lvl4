import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import Models from '../server/db/models';
import { createTestApp } from './lib/utils';
import { generateFakeUserRegisterData } from './lib/fakeItemsGenerator';

describe('test users', () => {
  let app = null;
  beforeEach(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
    app = null;
  });

  test('Get new user page', async () => {
    const res = await request(app.server)
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });

  test('Create new user with good data', async () => {
    const formData = generateFakeUserRegisterData({ role: 'user' });
    const res = await request(app.server)
      .post('/users')
      .send({ formData });
    expect(res.status).toBe(302);
    const createdUser = await Models.User.findOne({ where: { email: formData.email } });
    expect(createdUser).not.toBeNull();
  });

  test('Create new user with wrong data', async () => {
    const formData = generateFakeUserRegisterData({ role: 'user', email: 'wrong@email' });
    const res = await request(app.server)
      .post('/users')
      .send({ formData });
    expect(res.status).toBe(400);
    const createdUser = await Models.User.findOne({ where: { email: formData.email } });
    expect(createdUser).toBeNull();
  });

  describe('Update user testing', () => {
    const testUpdateFailData = [
      {
        loginData: {
          email: 'coronavirus@2020.ru',
          password: '123456',
        },
        newData: generateFakeUserRegisterData({ role: 'admin' }),
      }, {
        loginData: {
          email: 'pittbull@fakedomain.com',
          password: '123456',
        },
        newData: generateFakeUserRegisterData({ role: 'user' }),
      },
    ];

    const testUpdateSuccessData = [
      {
        loginData: {
          email: 'coronavirus@2020.ru',
          password: '123456',
        },
        email: 'coronavirus@2020.ru',
        newData: generateFakeUserRegisterData({ role: 'admin' }),
      },
      {
        loginData: {
          email: 'pittbull@fakedomain.com',
          password: '123456',
        },
        email: 'pittbull@fakedomain.com',
        newData: generateFakeUserRegisterData({ role: 'admin' }),
      },
      {
        loginData: {
          email: 'coronavirus@2020.ru',
          password: '123456',
        },
        email: 'pittbull@fakedomain.com',
        newData: generateFakeUserRegisterData({ role: 'user' }),
      },
    ];

    test.each(testUpdateSuccessData)('Update test, should susseeded', async ({ loginData, email, newData }) => {
      const res = await request(app.server)
        .post('/session')
        .send({ formData: loginData });
      expect(res.status).toBe(302);

      const cookie = res.header['set-cookie'];

      const updateResponse = await request(app.server)
        .put(`/users/${email}`)
        .set('Cookie', cookie)
        .send({ formData: newData });
      expect(updateResponse.status).toBe(302);

      const findedUser = await Models.User.findOne({ where: { email: newData.email } });
      expect(findedUser).not.toBeNull();
      expect(findedUser.firstName).toEqual(newData.firstName);
      expect(findedUser.lastName).toEqual(newData.lastName);
      expect(findedUser.password).toEqual(newData.password);
      expect(findedUser.email).toEqual(newData.email);
    });

    test('Update wrong email, should fail with 400', async () => {
      const loginData = {
        email: 'coronavirus@2020.ru',
        password: '123456',
      };
      const res = await request(app.server)
        .post('/session')
        .send({ formData: loginData });
      expect(res.status).toBe(302);

      const cookie = res.header['set-cookie'];
      expect(cookie.session).not.toBe('');

      const email = 'wrong@email';
      const newData = generateFakeUserRegisterData({ role: 'user' });
      const updateResponse = await request(app.server)
        .put(`/users/${email}`)
        .set('Cookie', cookie)
        .send({ formData: newData });
      expect(updateResponse.status).toBe(400);
    });

    test('Update user with unknown email, should fail with 400', async () => {
      const loginData = {
        email: 'coronavirus@2020.ru',
        password: '123456',
      };
      const res = await request(app.server)
        .post('/session')
        .send({ formData: loginData });
      expect(res.status).toBe(302);

      const cookie = res.header['set-cookie'];
      expect(cookie.session).not.toBe('');

      const email = 'unknown@email.com';
      const newData = generateFakeUserRegisterData({ role: 'user' });
      const updateResponse = await request(app.server)
        .put(`/users/${email}`)
        .set('Cookie', cookie)
        .send({ formData: newData });
      expect(updateResponse.status).toBe(400);
    });

    test('Update user without login should fail with 403', async () => {
      const email = 'coronavirus@2020.ru';
      const newData = generateFakeUserRegisterData({ role: 'user' });
      const res = await request(app.server)
        .put(`/users/${email}`)
        .send({ formData: newData });
      expect(res.status).toBe(403);
    });

    test('Update foreign user with user role, should fail', async () => {
      const loginData = {
        email: 'pittbull@fakedomain.com',
        password: '123456',
      };
      const res = await request(app.server)
        .post('/session')
        .send({ formData: loginData });
      expect(res.status).toBe(302);

      const cookie = res.header['set-cookie'];
      expect(cookie.session).not.toBe('');

      const email = 'coronavirus@2020.ru';
      const newData = generateFakeUserRegisterData({ role: 'admin' });
      const updateResponse = await request(app.server)
        .put(`/users/${email}`)
        .set('Cookie', cookie)
        .send({ formData: newData });
      expect(updateResponse.status).toBe(403);
    });
  });

  describe('Delete user test', () => {
    test('Delete by not logged in user, should fail', async () => {
      const email = 'coronavirus@2020.ru';
      const res = await request(app.server)
        .delete(`/users/${email}`);
      expect(res.status).toBe(403);
    });

    test('Delete with logged in user, wrong email to delete, should fail', async () => {
      const loginData = {
        email: 'coronavirus@2020.ru',
        password: '123456',
      };
      const loginResult = await request(app.server)
        .post('/session')
        .send({ formData: loginData });
      expect(loginResult.status).toBe(302);

      const cookie = loginResult.header['set-cookie'];
      expect(cookie.session).not.toBe('');

      const email = 'coronavirus@2020.ru';
      const deleteResult = await request(app.server)
        .delete(`/users/${email}`)
        .set('cookie', cookie);
      expect(deleteResult.status).toBe(400);
    });

    test('Delete with logged in user, unknown email to delete, should fail', async () => {
      const loginData = {
        email: 'coronavirus@2020.ru',
        password: '123456',
      };
      const res = await request(app.server)
        .post('/session')
        .send({ formData: loginData });
      expect(res.status).toBe(302);

      const cookie = res.header['set-cookie'];
      expect(cookie.session).not.toBe('');

      const email = 'unknown@email.com';
      const updateResponse = await request(app.server)
        .delete(`/users/${email}`)
        .set('Cookie', cookie);
      expect(updateResponse.status).toBe(400);
    });

    test('Delete with logged in user, admin can delete every user, succeed', async () => {
      const loginData = {
        email: 'coronavirus@2020.ru',
        password: '123456',
      };
      const res = await request(app.server)
        .post('/session')
        .send({ formData: loginData });
      expect(res.status).toBe(302);

      const cookie = res.header['set-cookie'];
      expect(cookie.session).not.toBe('');

      const email = 'pittbull@fakedomain.com';
      const updateResponse = await request(app.server)
        .delete(`/users/${email}`)
        .set('Cookie', cookie);
      expect(updateResponse.status).toBe(302);
    });

    test('Delete with logged in user, user can delete only self, succeed', async () => {
      const loginData = {
        email: 'pittbull@fakedomain.com',
        password: '123456',
      };
      const res = await request(app.server)
        .post('/session')
        .send({ formData: loginData });
      expect(res.status).toBe(302);

      const cookie = res.header['set-cookie'];
      expect(cookie.session).not.toBe('');

      const email = 'pittbull@fakedomain.com';
      const updateResponse = await request(app.server)
        .delete(`/users/${email}`)
        .set('Cookie', cookie);
      expect(updateResponse.status).toBe(302);
    });

    test('Delete with logged in user, user can\'t delete foreign user, fail', async () => {
      const loginData = {
        email: 'pittbull@fakedomain.com',
        password: '123456',
      };
      const res = await request(app.server)
        .post('/session')
        .send({ formData: loginData });
      expect(res.status).toBe(302);

      const cookie = res.header['set-cookie'];
      expect(cookie.session).not.toBe('');

      const email = 'coronavirus@2020.ru';
      const updateResponse = await request(app.server)
        .delete(`/users/${email}`)
        .set('Cookie', cookie);
      expect(updateResponse.status).toBe(403);
    });
  });
});
