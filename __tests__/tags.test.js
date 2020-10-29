import matchers from 'jest-supertest-matchers';
import request from 'supertest';
import { initTestDatabse } from './lib/utils';
import getApp from '../server';
import { login } from './lib/testHelpers/sessions';
import { testLoginData } from './lib/testHelpers/testData';

describe('test TaskStatus route', () => {
  let app = null;

  beforeAll(async () => {
    expect.extend(matchers);
    app = await getApp();
    await app.listen();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await initTestDatabse(app);
  });

  test('Get new tag form', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const getResponse = await request(app.server)
      .get(app.reverse('getNewTagForm'))
      .set('cookie', cookie);
    expect(getResponse.status).toBe(200);
  });

  test('Get edit tag form', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const getResponse = await request(app.server)
      .get(app.reverse('getEditTagForm', { id: 1 }))
      .set('cookie', cookie);
    expect(getResponse.status).toBe(200);
  });

  test('Create new tag', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const formData = { name: 'tag4' };
    const createResponse = await request(app.server)
      .post(app.reverse('createTag'))
      .set('cookie', cookie)
      .send({ formData });
    expect(createResponse.status).toBe(302);
    const tag = app.db.models.TaskStatus.findOne({ where: { name: formData.name } });
    expect(tag).not.toBeNull();
  });

  test('Get all Tags', async () => {
    const getAllResponse = await request(app.server)
      .get(app.reverse('getAllTags'));
    expect(getAllResponse.status).toBe(200);
  });

  test('Update tag', async () => {
    const id = 1;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const formData = { name: 'updated' };
    const updateResponse = await request(app.server)
      .put(app.reverse('updateTag', { id }))
      .set('cookie', cookie)
      .send({ formData });
    expect(updateResponse.status).toBe(302);
    const tag = await app.db.models.Tag.findOne({ where: { id } });
    expect(tag.name).toBe(formData.name);
  });

  test('Delete Tag', async () => {
    const id = 2;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const deleteResponse = await request(app.server)
      .delete(app.reverse('deleteTag', { id }))
      .set('cookie', cookie);
    expect(deleteResponse.status).toBe(302);
    const tag = await app.db.models.Tag.findOne({ where: { id } });
    expect(tag).toBeNull();
  });

  test('Delete Tag, wrong id', async () => {
    const id = 200;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const deleteResponse = await request(app.server)
      .delete(app.reverse('deleteTag', { id }))
      .set('cookie', cookie);
    expect(deleteResponse.status).toBe(302);
  });
});
