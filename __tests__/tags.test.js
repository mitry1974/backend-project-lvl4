import { initTestDatabse } from './lib/utils';
import getApp from '../server';
import { login } from './lib/testHelpers/sessions';
import { testLoginData } from './lib/testHelpers/testData';

describe('test tags routes', () => {
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

  test('Get new tag form', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const getResponse = await app.inject({
      method: 'get',
      url: app.reverse('getNewTagForm'),
      cookies: cookie,
    });

    expect(getResponse.statusCode).toBe(200);
  });

  test('Get edit tag form', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const getResponse = await app.inject({
      method: 'get',
      url: app.reverse('getEditTagForm', { id: 1 }),
      cookies: cookie,
    });

    expect(getResponse.statusCode).toBe(200);
  });

  test('Create new tag', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const formData = { name: 'tag4' };
    const createResponse = await app.inject({
      method: 'post',
      url: app.reverse('createTag'),
      cookies: cookie,
      payload: { formData },
    });
    expect(createResponse.statusCode).toBe(302);
    const tag = app.db.models.TaskStatus.findOne({ where: { name: formData.name } });
    expect(tag).not.toBeNull();
  });

  test('Get all Tags', async () => {
    const getAllResponse = await app.inject({
      method: 'get',
      url: app.reverse('getAllTags'),
    });

    expect(getAllResponse.statusCode).toBe(200);
  });

  test('Update tag', async () => {
    const id = 1;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const formData = { name: 'updated' };
    const updateResponse = await app.inject({
      method: 'put',
      url: app.reverse('updateTag', { id }),
      cookies: cookie,
      payload: { formData },
    });

    expect(updateResponse.statusCode).toBe(302);
    const tag = await app.db.models.Tag.findOne({ where: { id } });
    expect(tag.name).toBe(formData.name);
  });

  test('Delete Tag', async () => {
    const id = 2;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const deleteResponse = await app.inject({
      method: 'delete',
      url: app.reverse('deleteTag', { id }),
      cookies: cookie,
    });

    expect(deleteResponse.statusCode).toBe(302);
    const tag = await app.db.models.Tag.findOne({ where: { id } });
    expect(tag).toBeNull();
  });

  test('Delete Tag, wrong id', async () => {
    const id = 200;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const deleteResponse = await app.inject({
      method: 'delete',
      url: app.reverse('deleteTag', { id }),
      cookies: cookie,
    });

    expect(deleteResponse.statusCode).toBe(302);
  });
});
