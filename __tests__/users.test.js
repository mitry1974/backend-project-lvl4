import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import Models from '../server/db/models';
import { createTestApp } from './lib/utils';
import generateFakeUserRegisterData from './lib/fakeItemsGenerator';
import {
  login, deleteUser, updateUser, getUser, getAllUsers,
} from './lib/testHelpers';

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

  afterEach(() => {
    app.close();
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
    });
  });

  describe('Read user tests', () => {
    test('Get all users not logged in, should fail', async () => {
      const { getResponse } = await getAllUsers({ app, cookie: '' });
      expect(getResponse.status).toBe(403);
    });

    const getAllUsersTestData = [
      {
        loginData: { email: testData.user1.email, password: '123456' },
        statusCode: 403,
      },
      {
        loginData: { email: testData.admin.email, password: '123456' },
        statusCode: 200,
      },
    ];

    test.each(getAllUsersTestData)(' test getAllUsers', async ({ loginData, statusCode }) => {
      const { cookie } = await login({ app, formData: loginData });

      const { getResponse } = await getAllUsers({ app, cookie });
      expect(getResponse.status).toBe(statusCode);
    });

    test('Get user data not logged in, should fail', async () => {
      const { getResponse } = await getUser({ app, cookie: '', email: testData.user1.email });
      expect(getResponse.status).toBe(403);
    });

    const getUserTestData = [
      {
        loginData: { email: testData.admin.email, password: '123456' },
        emailToGet: 'wrong@email',
        statusCode: 404,
      },
      {
        loginData: { email: testData.admin.email, password: '123456' },
        emailToGet: 'unknown@email.com',
        statusCode: 404,
      },
      {
        loginData: { email: testData.user1.email, password: '123456' },
        emailToGet: testData.user2.email,
        statusCode: 403,
      },
      {
        loginData: { email: testData.admin.email, password: '123456' },
        emailToGet: testData.user1.email,
        statusCode: 200,
      },
      {
        loginData: { email: testData.user1.email, password: '123456' },
        emailToGet: testData.user1.email,
        statusCode: 200,
      },
    ];

    test.each(getUserTestData)('Test getUser api with different data', async ({ loginData, emailToGet, statusCode }) => {
      const { cookie } = await login({ app, formData: loginData });
      const { getResponse } = await getUser({ app, email: emailToGet, cookie });
      expect(getResponse.status).toBe(statusCode);
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

    test.each(testUpdateSuccessData)('Update test, should suceeded', async ({ emailToUpdate, loginData, newData }) => {
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
      expect(findedUser.email).toEqual(newData.email);
    });
  });

  describe('Delete user tests', () => {
    const succedData = [
      {
        emailWhoDelete: testData.admin.email,
        emailToDelete: testData.user1.email,
      }, {
        emailWhoDelete: testData.user1.email,
        emailToDelete: testData.user1.email,
      },
    ];

    test.each(succedData)('Testing succeded data', async ({ emailWhoDelete, emailToDelete }) => {
      const { cookie } = await login({ app, formData: { email: emailWhoDelete, password: '123456' } });

      const { deleteResponse } = await deleteUser({ app, emailToDelete, cookie });
      expect(deleteResponse.status).toBe(302);
      const user = await Models.User.findOne({ where: { email: emailToDelete } });
      expect(user).toBeFalsy();
    });

    test('Delete by not logged in user, should fail', async () => {
      const emailToDelete = testData.admin.email;
      const { deleteResponse } = await deleteUser({ app, emailToDelete, cookie: '' });
      expect(deleteResponse.status).toBe(403);
      const user = await Models.User.findOne({ where: { email: emailToDelete } });
      expect(user).toBeTruthy();
    });

    test('Delete with logged in user, user can\'t delete foreign user, fail', async () => {
      const { cookie } = await login({ app, formData: { email: testData.user1.email, password: '123456' } });

      const emailToDelete = testData.admin.email;
      const { deleteResponse } = await deleteUser({ app, email: emailToDelete, cookie });
      expect(deleteResponse.status).toBe(403);
      const user = await Models.User.findOne({ where: { email: emailToDelete } });
      expect(user).toBeTruthy();
    });
  });
});
