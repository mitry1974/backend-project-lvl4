import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import Models from '../server/db/models';
import { createTestApp } from './lib/utils';
import { generateFakeUserRegisterData } from './lib/fakeItemsGenerator';

describe('test users', () => {
  let app = null;

  beforeAll(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  describe('get all users', () => {
    test('Get all users unauthorised access', async () => {
      const res = await request(app.server)
        .get('/users');
      expect(res).toHaveHTTPStatus(401);
    });

    test('Get all users authorisid access', async () => {

    });
  });

  describe('Create new user', () => {
    test('Create new user with good data', async () => {
      const newUserData = generateFakeUserRegisterData({ role: 'user' });
      const res = await request(app.server)
        .post('/users')
        .send({ registeruserdto: newUserData });
      expect(res).toHaveHTTPStatus(302);
      const createdUser = await Models.User.findOne({ where: { email: newUserData.email } });
      expect(createdUser).not.toBeNull();
    });

    test('Create new user with wrong data', async () => {

    });
  });

  describe('Update user', () => {

  });

  describe('Delete user', () => {

  });

  test('Get new user page', async () => {
    const res = await request(app.server)
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });


  afterAll(async () => {
    await app.close();
  });
});
