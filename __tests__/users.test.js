import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import Models from '../server/db/models';
import { createTestApp } from './lib/utils';
import { generateFakeUserRegisterData } from './lib/fakeItemsGenerator';
import { login, deleteUser, updateUser, getUser, getAllUsers } from './lib/testHelpers';

describe('test users', () => {
  const testData = {
    admin: {
      email: 'coronavirus@2020.ru',
      password: '123456',
    },
    user1: {
      email: 'pittbull@fakedomain.com',
      password: '123456',
    },
    user2: {
      email: 'zaratustra@fakedomain.com',
      password: '123456',
    },
  };

  let app = null;
  beforeEach(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
    app = null;
  });

  describe('http', () => {
    test('Get new user page', async () => {
      const res = await request(app.server)
        .get('/users/new');
      expect(res).toHaveHTTPStatus(200);
    });
  });

  describe('Create user tests', () => {
    test('Create new user with good data', async () => {
      const formData = generateFakeUserRegisterData({ role: 'user' });
      const res = await request(app.server)
        .post('/users')
        .send({ formData });
      expect(res.status).toBe(302);
      const createdUser = await Models.User.findOne({ where: { email: formData.email } });
      expect(createdUser).not.toBeNull();
    });

    test('Create user with wrong email', async () => {
      const formData = generateFakeUserRegisterData({ role: 'user', email: 'wrong@email' });
      const res = await request(app.server)
        .post('/users')
        .send({ formData });
      expect(res.status).toBe(400);
      const createdUser = await Models.User.findOne({ where: { email: formData.email } });
      expect(createdUser).toBeNull();
    });

    test('Create user with existing email', async () => {
      const formData = generateFakeUserRegisterData({ role: 'user', email: testData.admin.email });
      const res = await request(app.server)
        .post('/users')
        .send({ formData });
      expect(res.status).toBe(400);
      const createdUser = await Models.User.findOne({ where: { email: formData.email } });
      expect(createdUser).toBeNull();
    });
  });

  describe('Read user tests', () => {
    test('Get all users test not logged in, should fail', async () => {
      const { readResponse } = getAllUsers({ app, email: testData.admin.email, cookie: '' });
      expect(readResponse.status).toBe(401);
    });

    test('Get all users test logged in with user role, should fail', async () => {
      const { cookie } = login({ app, formData: { email: testData.user1.email, password: '123456' } });
      const { readResponse } = getAllUsers({ app, cookie });
      expect(readResponse.status).toBe(403);
    });

    test('Get all users test logged in with admin role, should succed', async () => {
      const { cookie } = login({ app, formData: { email: testData.admin.email, password: '123456' } });
      const { readResponse } = getAllUsers({ app, cookie });
      expect(readResponse.status).toBe(302);
    });

    test('Get user data not logged in, should fail', async () => {
      const { getResponse } = getUser({ app, email: testData.user.email, cookie: '' });
      expect(getResponse.status).toBe(401);
    });

    test('Get user data, user email wrong, 400', async () => {
      const { cookie } = login({ app, formData: { email: testData.admin.email, password: '123456' } });
      const { getResponse } = getUser({ app, email: 'wrong@email', cookie });
      expect(getResponse.status).toBe(400);
    });

    test('Get user data, user email not in database, 400', async () => {
      const { cookie } = login({ app, formData: { email: testData.admin.email, password: '123456' } });
      const { getResponse } = getUser({ app, email: 'unknown@email.com', cookie });
      expect(getResponse.status).toBe(400);
    });

    test('Get user data, admin role, 302', async () => {
      const { cookie } = login({ app, formData: { email: testData.admin.email, password: '123456' } });
      const { getResponse } = getUser({ app, email: testData.user1.email, cookie });
      expect(getResponse.status).toBe(302);
    });

    test('Get user data, user role, 403', async () => {
      const { cookie } = login({ app, formData: { email: testData.user1.email, password: '123456' } });
      const { getResponse } = getUser({ app, email: testData.user2.email, cookie });
      expect(getResponse.status).toBe(403);
    });

    test('Get user own data, user role, 302', async () => {
      const { cookie } = login({ app, formData: { email: testData.user1.email, password: '123456' } });
      const { getResponse } = getUser({ app, email: testData.user1.email, cookie });
      expect(getResponse.status).toBe(403);
    });
  });

  describe('Update user tests', () => {
    const testUpdateSuccessData = [
      {
        emailToUpdate: testData.admin.email,
        loginData: {
          email: testData.admin.email,
          password: '123456',
        },
        newData: generateFakeUserRegisterData({ role: 'admin' }),
      },
      {
        emailToUpdate: testData.user1.email,
        loginData: {
          email: testData.user1.email,
          password: '123456',
        },
        newData: generateFakeUserRegisterData({ role: 'admin' }),
      },
      {
        emailToUpdate: testData.user1.email,
        loginData: {
          email: testData.admin.email,
          password: '123456',
        },
        newData: generateFakeUserRegisterData({ role: 'user' }),
      },
    ];

    test.each(testUpdateSuccessData)('Update test, should susseeded', async ({ emailToUpdate, loginData, newData }) => {
      const { cookie } = await login({ app, formData: loginData });

      const { updateResponse } = await updateUser(
        {
          app, emailToUpdate, formData: newData, cookie,
        },
      );
      expect(updateResponse.status).toBe(302);

      const findedUser = await Models.User.findOne({ where: { email: newData.email } });
      expect(findedUser).not.toBeNull();
      expect(findedUser.firstName).toEqual(newData.firstName);
      expect(findedUser.lastName).toEqual(newData.lastName);
      expect(findedUser.password).toEqual(newData.password);
      expect(findedUser.email).toEqual(newData.email);
    });

    const validationErrorsData = [
      {
        emailToUpdate: 'wrong@email',
      }, {
        emailToUpdate: 'unknown@email.com',
      },
    ];

    test.each(validationErrorsData)('testing validation emailToUpdate errors', async ({ emailToUpdate }) => {
      const { cookie } = await login({ app, formData: { email: 'coronavirus@2020.ru', password: '123456' } });

      const newData = generateFakeUserRegisterData({ role: 'user' });
      const { updateResponse } = await updateUser(
        {
          app, emailToUpdate, formData: newData, cookie,
        },
      );
      expect(updateResponse.status).toBe(400);
    });

    test('Update foreign user with user role, should fail', async () => {
      const { cookie } = await login({ app, formData: { email: 'pittbull@fakedomain.com', password: '123456' } });

      const newData = generateFakeUserRegisterData({ role: 'admin' });
      const { updateResponse } = await updateUser(
        {
          app, email: 'coronavirus@2020.ru', formData: newData, cookie,
        },
      );
      expect(updateResponse.status).toBe(403);
    });
  });

  describe('Delete user tests', () => {
    const validationErrorsData = [
      {
        emailToDelete: 'wrong@email',
      }, {
        emailToDelete: 'unknown@email.com',
      },
    ];

    test.each(validationErrorsData)('Testing emailToDelete validation', async ({ emailToDelete }) => {
      const { cookie } = await login({ app, formData: { email: testData.admin.email, password: '123456' } });

      const { deleteResponse } = await deleteUser({ app, emailToDelete, cookie });
      expect(deleteResponse.status).toBe(400);
    });

    const succedData = [
      {
        emailWhoDelete: testData.admin.email,
        emailToDelete: testData.user.email,
      }, {
        emailWhoDelete: testData.user.email,
        emailToDelete: testData.user.email,
      },
    ];

    test.each(succedData)('Testing succeded data', async ({ emailWhoDelete, emailToDelete }) => {
      const { cookie } = await login({ app, formData: { email: emailWhoDelete, password: '123456' } });

      const { deleteResponse } = deleteUser({ app, emailToDelete, cookie });
      expect(deleteResponse.status).toBe(302);
      const user = Models.User.findOne({ where: { emailToDelete } });
      expect(user).toBeFalsy();
    });

    test('Delete by not logged in user, should fail', async () => {
      const emailToDelete = testData.admin.email;
      const { deleteResponse } = deleteUser({ app, emailToDelete, cookie: '' });
      expect(deleteResponse.status).toBe(403);
      const user = Models.User.findOne({ where: { emailToDelete } });
      expect(user).toBeTruthy();
    });

    test('Delete with logged in user, user can\'t delete foreign user, fail', async () => {
      const { cookie } = await login({ app, formData: { email: testData.user1.email, password: '123456' } });

      const emailToDelete = testData.admin.email;
      const { deleteResponse } = deleteUser({ app, emailToDelete, cookie });
      expect(deleteResponse.status).toBe(403);
      const user = Models.User.findOne({ where: { emailToDelete } });
      expect(user).toBeTruthy();
    });
  });
});
