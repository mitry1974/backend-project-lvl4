import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import Models from '../server/db/models';
import { createTestApp } from './lib/utils';
import generateFakeUserRegisterData from './lib/fakeItemsGenerator';
import {
  createUser, deleteUser, updateUser, getUser, getAllUsers,
} from './lib/testHelpers/users';
import { login } from './lib/testHelpers/sessions';
import { testLoginData } from './lib/testHelpers/testData';

describe('test users', () => {
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
      const { createResponse } = await createUser({ app, formData });
      expect(createResponse.status).toBe(302);
      const createdUser = await Models.User.findOne({ where: { email: formData.email } });
      expect(createdUser).not.toBeNull();
    });

    test('Create user with wrong email', async () => {
      const formData = generateFakeUserRegisterData({ role: 'user', email: 'wrong@email' });
      const { createResponse } = await createUser({ app, formData });
      expect(createResponse.status).toBe(400);
      const createdUser = await Models.User.findOne({ where: { email: formData.email } });
      expect(createdUser).toBeNull();
    });

    test('Create user with existing email', async () => {
      const formData = generateFakeUserRegisterData({ role: 'user', email: testLoginData.admin.email });
      const { createResponse } = await createUser({ app, formData });
      expect(createResponse.status).toBe(400);
    });
  });

  describe('Read user tests', () => {
    test('Get all users not logged in, should fail', async () => {
      const { getResponse } = await getAllUsers({ app, cookie: '' });
      expect(getResponse.status).toBe(403);
    });

    const getAllUsersTestData = [
      {
        loginData: testLoginData.user1,
        statusCode: 403,
      },
      {
        loginData: testLoginData.admin,
        statusCode: 200,
      },
    ];

    test.each(getAllUsersTestData)(' test getAllUsers', async ({ loginData, statusCode }) => {
      const { cookie } = await login({ app, formData: loginData });

      const { getResponse } = await getAllUsers({ app, cookie });
      expect(getResponse.status).toBe(statusCode);
    });

    test('Get user data not logged in, should fail', async () => {
      const { getResponse } = await getUser({ app, cookie: '', email: testLoginData.user1.email });
      expect(getResponse.status).toBe(403);
    });

    const getUserTestData = [
      {
        loginData: testLoginData.admin,
        emailToGet: 'wrong@email',
        statusCode: 404,
      },
      {
        loginData: testLoginData.admin,
        emailToGet: 'unknown@email.com',
        statusCode: 404,
      },
      {
        loginData: testLoginData.user1,
        emailToGet: testLoginData.user2.email,
        statusCode: 403,
      },
      {
        loginData: testLoginData.admin,
        emailToGet: testLoginData.user1.email,
        statusCode: 200,
      },
      {
        loginData: testLoginData.user1,
        emailToGet: testLoginData.user1.email,
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
        emailToUpdate: testLoginData.admin.email,
        loginData: testLoginData.admin,
        newData: generateFakeUserRegisterData({ role: 'admin' }),
      },
      {
        emailToUpdate: testLoginData.user1.email,
        loginData: testLoginData.user1,
        newData: generateFakeUserRegisterData({ role: 'admin' }),
      },
      {
        emailToUpdate: testLoginData.user1.email,
        loginData: testLoginData.admin,
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
        emailWhoDelete: testLoginData.admin.email,
        emailToDelete: testLoginData.user1.email,
      }, {
        emailWhoDelete: testLoginData.user1.email,
        emailToDelete: testLoginData.user1.email,
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
      const emailToDelete = testLoginData.admin.email;
      const { deleteResponse } = await deleteUser({ app, emailToDelete, cookie: '' });
      expect(deleteResponse.status).toBe(403);
      const user = await Models.User.findOne({ where: { email: emailToDelete } });
      expect(user).toBeTruthy();
    });

    test('Delete with logged in user, user can\'t delete foreign user, fail', async () => {
      const { cookie } = await login({ app, formData: testLoginData.user1 });

      const emailToDelete = testLoginData.admin.email;
      const { deleteResponse } = await deleteUser({ app, email: emailToDelete, cookie });
      expect(deleteResponse.status).toBe(403);
      const user = await Models.User.findOne({ where: { email: emailToDelete } });
      expect(user).toBeTruthy();
    });
  });
});
