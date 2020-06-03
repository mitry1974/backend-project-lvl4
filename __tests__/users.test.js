import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import Models from '../server/db/models';
import { createTestApp } from './utils';

describe('test root', () => {
  let app = null;

  const newUserData = {
    firstname: 'Sarah',
    lastname: 'O\'Connor',
    email: 'sarahoconnor@fakedomain.com',
    password: '12345',
  };

  beforeAll(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  test('Get all users', async () => {
    const res = await request(app.server)
      .get('/users');
    expect(res).toHaveHTTPStatus(200);
  });

  test('Get new user page', async () => {
    const res = await request(app.server)
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });

  test('Create new user', async () => {
    const res = await request(app.server)
      .post('/users')
      .send({ user: newUserData });
    expect(res).toHaveHTTPStatus(302);
    const createdUser = await Models.User.findOne({ where:{ email: newUserData.email } });
    expect(createdUser).not.toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
