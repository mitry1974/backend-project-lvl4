import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import faker from 'faker';
import Models from '../server/db/models';
import { createTestApp } from './lib/utils';
import { login } from './lib/testHelpers/sessions';
import { testLoginData, testTaskData } from './lib/testHelpers/testData';

const generateFakeTaskData = (options) => {
  const generated = {
    name: `Task - ${faker.lorem.word}`,
    description: faker.lorem.sentences(),
    statusId: 0,
    creatorId: faker.random.number({ min: 1, max: 6 }),
    assignedToId: faker.random.number({ min: 1, max: 6 }),
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

  describe('Create task test', () => {
    test('Create task not logged in user', async () => {
      const formData = generateFakeTaskData();
      const response = await request(app.server)
        .post('/tasks')
        .send({ formData });
      expect(response).toHaveHTTPStatus(403);
    });

    test('Create task logged user, good data', async () => {
      const formData = generateFakeTaskData();
      const { cookie } = login({ formData: testLoginData.user1 });
      const response = await request(app.server)
        .post('/tasks')
        .set('cookie', cookie)
        .send({ formData });
      expect(response).toHaveHTTPStatus(302);

      const createdTask = await Models.Task.findOne({ where: { name: testTaskData.task1.name } });
      expect(createdTask).not.toBeNull();
    });
  });

  describe('Read task tests', () => {
    test('Test all tasks page loading', async () => {
      const { getAllResponse } = request(app.server)
        .get('/tests');
      expect(getAllResponse).toHaveHTTPStatus(302);
    });

    test('Get task wih id', async () => {
      const response = await request(app.server)
        .get(app.reverse('getTask', { id: 1 }));
      expect(response).toHaveHTTPStatus(302);
    });

    test('Get task with wrong id', async () => {
      const response = request(app.server)
        .get(app.reverse('getTask', 1000));
      expect(response).toHaveHTTPStatus(404);
    });
  });

  describe('Update task test', () => {
    test('Update task with wrong id', async () => {
      const formData = generateFakeTaskData({ id: 100 });
      const response = await request(app.server)
        .put(app.reverse('updateTask', 100))
        .send(formData);
      expect(response).toHaveHTTPStatus(404);
    });

    test('Update task with good id', async () => {
      const id = 1;
      const formData = generateFakeTaskData({ id });
      const response = await request(app.server)
        .put(app.reverse('updateTask', id))
        .send(formData);
      expect(response).toHaveHTTPStatus(302);
      const updatedTask = Models.Task.findOne({ where: { id } });
      expect(updatedTask).not.toBeNull();
    });
  });

  describe('Delete task test', () => {
    test('Delete task with wrond id', async () => {
      const response = request(app.server)
        .delete(app.reverse('deleteTask', 1000));
      expect(response).toHaveHTTPStatus(404);
    });

    test('Delete task with good id', async () => {
      const id = 1;
      const response = await request(app.server)
        .delete(app.reverse('deleteTask', id));
      expect(response).toHaveHTTPStatus(302);
      const deletedTask = await Models.findOne({ where: { id } });
      expect(deletedTask).toBeNull();
    });
  });
});
