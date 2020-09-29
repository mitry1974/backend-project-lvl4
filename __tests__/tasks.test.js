import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import faker from 'faker';
import Models from '../server/db/models';
import { createTestApp } from './lib/utils';
import { login } from './lib/testHelpers/sessions';
import { testLoginData } from './lib/testHelpers/testData';

const generateFakeTaskData = (options) => {
  const generated = {
    name: faker.lorem.word(),
    description: faker.lorem.sentences(),
    statusId: 0,
    creatorId: faker.random.number({ min: 0, max: 2 }),
    assignedToId: faker.random.number({ min: 0, max: 2 }),
  };

  return { ...generated, ...options };
};

describe('test users', () => {
  let app = null;

  beforeAll(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  afterAll(() => {
    app.close();
    app = null;
  });

  test('Create task not logged in user', async () => {
    const formData = generateFakeTaskData();
    const response = await request(app.server)
      .post('/tasks')
      .send({ formData });
    expect(response).toHaveHTTPStatus(302);
    const createdUser = await Models.Task.findOne({ where: { name: formData.name } });
    expect(createdUser).toBeNull();
  });

  test('Create task logged user, good data', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const taskData = generateFakeTaskData({ creatorId: 1 });
    const response = await request(app.server)
      .post('/tasks')
      .set('cookie', cookie)
      .send({ formData: taskData });
    expect(response).toHaveHTTPStatus(302);

    const createdTask = await Models.Task.findOne({ where: { name: taskData.name } });
    expect(createdTask).not.toBeNull();
  });

  test('Test all tasks page loading', async () => {
    const getAllResponse = await request(app.server)
      .get(app.reverse('getAllTasks'));
    expect(getAllResponse).toHaveHTTPStatus(200);
  });

  test('Get task wih id', async () => {
    const response = await request(app.server)
      .get(app.reverse('getTask', { id: 1 }));
    expect(response).toHaveHTTPStatus(200);
  });

  test('Update task', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const id = 1;
    const formData = generateFakeTaskData({ id, creatorId: 1 });
    const response = await request(app.server)
      .put(app.reverse('updateTask', { id, email: testLoginData.user2.email }))
      .set('cookie', cookie)
      .send({ formData });
    expect(response).toHaveHTTPStatus(302);
    const updatedTask = Models.Task.findOne({ where: { id } });
    expect(updatedTask).not.toBeNull();
  });

  test('Delete task', async () => {
    const id = 1;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const deleteResponse = await request(app.server)
      .delete(app.reverse('deleteTask', { id, email: testLoginData.user2.email }))
      .set('cookie', cookie);
    expect(deleteResponse).toHaveHTTPStatus(302);
    const deletedTask = await Models.Task.findOne({ where: { id } });
    expect(deletedTask).toBeNull();
  });
});
