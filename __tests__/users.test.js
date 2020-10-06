import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import faker from 'faker';
import Models from '../server/db/models';
import { createTestApp } from './lib/utils';
import {
  createUser, deleteUser, updateUser, getUser, getAllUsers,
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
        .get(app.reverse('getRegisterUserForm'));
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
      const formData = generateFakeUserRegisterData({ role: 'user', email: 'wrong' });
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
    test('Get all users', async () => {
      const { getResponse } = await getAllUsers({ app, cookie: '' });
      expect(getResponse.status).toBe(200);
    });

    test('Get user data', async () => {
      const { getResponse } = await getUser({ app, cookie: '', email: testLoginData.user1.email });
      expect(getResponse.status).toBe(302);
    });
  });

  describe('Update user tests', () => {
    const testUpdateSuccessData = [
      {
        loginData: testLoginData.admin,
        emailToUpdate: testLoginData.user1.email,
        newData: generateFakeUserRegisterData({ role: 'user' }),
      },
      {
        loginData: testLoginData.admin,
        emailToUpdate: testLoginData.admin.email,
        newData: generateFakeUserRegisterData({ role: 'admin' }),
      },
      {
        loginData: testLoginData.user2,
        emailToUpdate: testLoginData.user2.email,
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
        emailWhoDelete: testLoginData.user2.email,
        emailToDelete: testLoginData.user2.email,
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
      expect(deleteResponse.status).toBe(302);
      const user = await Models.User.findOne({ where: { email: emailToDelete } });
      expect(user).toBeTruthy();
    });

    test('Delete with logged in user, user cant delete foreign user, fail', async () => {
      const { cookie } = await login({ app, formData: testLoginData.user1 });

      const emailToDelete = testLoginData.admin.email;
      const { deleteResponse } = await deleteUser({ app, email: emailToDelete, cookie });
      expect(deleteResponse.status).toBe(302);
      const user = await Models.User.findOne({ where: { email: emailToDelete } });
      expect(user).toBeTruthy();
    });
  });
});
