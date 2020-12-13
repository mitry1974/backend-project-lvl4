import faker from 'faker';
import { initTestDatabse } from './lib/utils';
import getApp from '../server';
import {
  createUser, deleteUser, updateUser, getUser, getAllUsers, updatePassword,
} from './lib/testHelpers/users';
import { login } from './lib/testHelpers/sessions';
import { testLoginData } from './lib/testHelpers/testData';

const generateFakeUserRegisterData = (options) => {
  const password = faker.internet.password();
  const generated = {
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password,
    confirm: password,
    role: options.role,
  };

  return { ...generated, ...options };
};

describe('test users', () => {
  let app = null;

  beforeAll(async () => {
    app = await getApp();
    await app.listen();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await initTestDatabse(app);
  });

  describe('http', () => {
    test('Get new user page', async () => {
      const response = await app.inject({
        method: 'get',
        url: app.reverse('getRegisterUserForm'),
      });

      expect(response.statusCode).toBe(200);
    });

    test('Get edit user page', async () => {
      const { cookie } = await login({ app, formData: testLoginData.user2 });
      const response = await app.inject({
        method: 'get',
        url: app.reverse('getEditUserForm', { userId: testLoginData.user2.id }),
        cookies: cookie,
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('Create user tests', () => {
    test('Create new user with good data', async () => {
      const formData = generateFakeUserRegisterData({ role: 'user' });
      const { createResponse } = await createUser({ app, formData });
      expect(createResponse.statusCode).toBe(302);
      const createdUser = await app.db.models.User.findOne({ where: { email: formData.email } });
      expect(createdUser).not.toBeNull();
    });

    test('Create user with wrong email', async () => {
      const formData = generateFakeUserRegisterData({ role: 'user', email: 'wrong' });
      const { createResponse } = await createUser({ app, formData });
      expect(createResponse.statusCode).toBe(400);
      const createdUser = await app.db.models.User.findOne({ where: { email: formData.email } });
      expect(createdUser).toBeNull();
    });

    test('Create user with existing email', async () => {
      const formData = generateFakeUserRegisterData({ role: 'user', email: testLoginData.admin.email });
      const { createResponse } = await createUser({ app, formData });
      expect(createResponse.statusCode).toBe(400);
    });
  });

  describe('Read user tests', () => {
    test('Get all users', async () => {
      const { getResponse } = await getAllUsers({ app, cookies: {} });
      expect(getResponse.statusCode).toBe(200);
    });

    test('Get user data, not logged in', async () => {
      const { getResponse } = await getUser({ app, cookie: {}, userId: testLoginData.user2.id });
      expect(getResponse.statusCode).toBe(302);
    });

    test('Get user data, logged in', async () => {
      const { cookie } = await login({ app, formData: testLoginData.user1 });
      const { getResponse } = await getUser({ app, cookie, userId: testLoginData.user2.id });
      expect(getResponse.statusCode).toBe(302);
    });
  });

  describe('Update user tests', () => {
    const testUpdateSuccessData = [
      {
        loginData: testLoginData.admin,
        userIdToUpdate: testLoginData.user2.id,
        newData: generateFakeUserRegisterData({ role: 'user' }),
      },
      {
        loginData: testLoginData.admin,
        userIdToUpdate: testLoginData.admin.id,
        newData: generateFakeUserRegisterData({ role: 'admin' }),
      },
      {
        loginData: testLoginData.user2,
        userIdToUpdate: testLoginData.user2.id,
        newData: generateFakeUserRegisterData({ role: 'user' }),
      },
    ];

    test.each(testUpdateSuccessData)('Update test, should suceeded', async ({ userIdToUpdate, loginData, newData }) => {
      const { cookie } = await login({ app, formData: loginData });

      const { updateResponse } = await updateUser(
        {
          app, userIdToUpdate, formData: newData, cookie,
        },
      );
      expect(updateResponse.statusCode).toBe(302);

      const findedUser = await app.db.models.User.findOne({ where: { email: newData.email } });
      expect(findedUser).not.toBeNull();
      expect(findedUser.firstName).toEqual(newData.firstName);
      expect(findedUser.lastName).toEqual(newData.lastName);
      expect(findedUser.email).toEqual(newData.email);
    });

    test('Update user password', async () => {
      const loginData = testLoginData.user2;
      const { cookie } = await login({ app, formData: loginData });

      const { updateResponse } = await updatePassword(
        {
          app,
          userIdToUpdate: testLoginData.user2.id,
          formData: {
            oldPassword: testLoginData.user2.password,
            password: '1234',
            confirm: '1234',
          },
          cookies: cookie,
        },
      );
      expect(updateResponse.statusCode).toBe(302);
    });
  });

  describe('Delete user tests', () => {
    const succedData = [
      {
        loginData: testLoginData.admin,
        userIdToDelete: testLoginData.user2.id,
      }, {
        loginData: testLoginData.user3,
        userIdToDelete: testLoginData.user3.id,
      },
    ];

    test.each(succedData)('Delete user, testing succeded data', async ({ loginData, userIdToDelete }) => {
      const { cookie } = await login({ app, formData: loginData });

      const { deleteResponse } = await deleteUser({ app, userIdToDelete, cookie });
      expect(deleteResponse.statusCode).toBe(302);
      const user = await app.db.models.User.findByPk(userIdToDelete);
      expect(user).toBeFalsy();
    });

    test('Delete by not logged in user, should fail', async () => {
      const userIdToDelete = testLoginData.user5.id;
      const { deleteResponse } = await deleteUser({ app, userIdToDelete, cookie: {} });
      expect(deleteResponse.statusCode).toBe(302);
      const user = await app.db.models.User.findByPk(userIdToDelete);
      expect(user).toBeTruthy();
    });

    test('Delete with logged in user, user cant delete another user, fail', async () => {
      const { cookie } = await login({ app, formData: testLoginData.user3 });

      const userIdToDelete = testLoginData.user5.id;
      const { deleteResponse } = await deleteUser({ app, userIdToDelete, cookie });
      expect(deleteResponse.statusCode).toBe(302);
      const user = await app.db.models.User.findByPk(userIdToDelete);
      expect(user).toBeTruthy();
    });

    test('Delete user with wrong id', async () => {
      const { cookie } = await login({ app, formData: testLoginData.admin });

      const userIdToDelete = 1000;
      const { deleteResponse } = await deleteUser({ app, userIdToDelete, cookie });
      expect(deleteResponse.statusCode).toBe(302);
    });
  });
});
