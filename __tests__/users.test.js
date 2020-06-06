import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import Models from '../server/db/models';
import { createTestApp } from './lib/utils';
import { generateFakeUserRegisterData } from './lib/fakeItemsGenerator';

describe('test root', () => {
  let app = null;

  beforeAll(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  test('Get all users unauthorised access', async () => {
    const res = await request(app.server)
      .get('/users');
    expect(res).toHaveHTTPStatus(401);
  });

  test('Get new user page', async () => {
    const res = await request(app.server)
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });

  test('Create new user', async () => {
    const newUserData = generateFakeUserRegisterData({ role: 'user' });
    console.log(`Generated register user data: ${JSON.stringify(newUserData)}`);
    const res = await request(app.server)
      .post('/users')
      .send({ registeruserdto: newUserData });
    expect(res).toHaveHTTPStatus(302);
    const createdUser = await Models.User.findOne({ where: { email: newUserData.email } });
    expect(createdUser).not.toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
