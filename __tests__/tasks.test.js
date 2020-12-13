import faker from 'faker';
import { initTestDatabse } from './lib/utils';
import getApp from '../server';
import { login } from './lib/testHelpers/sessions';
import { testLoginData } from './lib/testHelpers/testData';

const generateFakeTaskData = (options) => {
  const generated = {
    name: faker.lorem.word(),
    description: faker.lorem.sentences(),
    statusId: 1,
    creatorId: faker.random.number({ min: 1, max: 2 }),
    assignedToId: faker.random.number({ min: 1, max: 2 }),
  };

  return { ...generated, ...options };
};

describe('test tasks', () => {
  let app = null;

  beforeAll(async () => {
    app = await getApp();
    await app.listen();
  });

  afterAll(async () => {
    await app.close();
    app = null;
  });

  beforeEach(async () => {
    await initTestDatabse(app);
  });

  test('Create task not logged in user', async () => {
    const formData = generateFakeTaskData();
    const response = await app.inject({
      method: 'post',
      url: app.reverse('createTask'),
      payload: { formData },
    });

    expect(response.statusCode).toBe(302);
    const createdUser = await app.db.models.Task.findOne({ where: { name: formData.name } });
    expect(createdUser).toBeNull();
  });

  test('Create task logged user, good data', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const taskData = generateFakeTaskData({ creatorId: testLoginData.user2.id });
    const response = await app.inject({
      method: 'post',
      url: app.reverse('createTask'),
      cookies: cookie,
      payload: { formData: taskData },
    });

    expect(response.statusCode).toBe(302);

    const createdTask = await app.db.models.Task.findOne({ where: { name: taskData.name } });
    expect(createdTask).not.toBeNull();
  });

  test('Tasks page loading', async () => {
    const getAllResponse = await app.inject({
      method: 'get',
      url: app.reverse('getAllTasks'),
    });

    expect(getAllResponse.statusCode).toBe(200);
  });

  test('Get task wih id', async () => {
    const response = await app.inject({
      method: 'get',
      url: app.reverse('getTask', { id: 1 }),
    });

    expect(response.statusCode).toBe(200);
  });

  test('Update task', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const id = 2;
    const formData = generateFakeTaskData({ id, creatorId: 1 });
    const response = await app.inject({
      method: 'put',
      url: app.reverse('updateTask', { id, userId: testLoginData.user2.id }),
      cookies: cookie,
      payload: { formData },
    });

    expect(response.statusCode).toBe(302);
    const updatedTask = await app.db.models.Task.findOne({ where: { id } });
    expect(updatedTask).not.toBeNull();
    expect(updatedTask.name).toBe(formData.name);
  });

  test('Delete task', async () => {
    const id = 1;
    const { cookie } = await login({ app, formData: testLoginData.admin });
    const deleteResponse = await app.inject({
      method: 'delete',
      url: app.reverse('deleteTask', { id: testLoginData.admin.id, userId: testLoginData.user2.id }),
      cookies: cookie,
    });

    expect(deleteResponse.statusCode).toBe(302);
    const deletedTask = await app.db.models.Task.findOne({ where: { id } });
    expect(deletedTask).toBeNull();
  });
});
