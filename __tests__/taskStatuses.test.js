import faker from 'faker';
import { initTestDatabse } from './lib/utils';
import getApp from '../server';
import {
  createTaskStatus, getAllTaskStatuses, deleteTaskStatus, updateTaskStatus,
} from './lib/testHelpers/taskStatuses';
import { login } from './lib/testHelpers/sessions';
import { testLoginData, testTaskStatusData } from './lib/testHelpers/testData';

describe('test TaskStatus route', () => {
  let app = null;

  beforeAll(async () => {
    app = await getApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await initTestDatabse(app);
  });

  test('Get new taskStatus form', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const getResponse = await app.inject({
      method: 'get',
      url: app.reverse('getNewTaskStatusForm'),
      cookies: cookie,
    });

    expect(getResponse.statusCode).toBe(200);
  });

  test('Get edit taskstatus form', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const getResponse = await app.inject({
      method: 'get',
      url: app.reverse('getEditTaskStatusForm', { id: testTaskStatusData.taskStatus1.id }),
      cookies: cookie,
    });

    expect(getResponse.statusCode).toBe(200);
  });

  test('Create new TaskStatus', async () => {
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const newStatus = faker.lorem.word();
    const formData = { name: newStatus };
    const { createResponse } = await createTaskStatus({ app, formData, cookie });
    expect(createResponse.statusCode).toBe(302);
    const ts = app.db.models.TaskStatus.findOne({ where: { name: formData.name } });
    expect(ts).not.toBeNull();
  });

  test('Get all TaskStatuses', async () => {
    const { getAllResponse } = await getAllTaskStatuses({ app });
    expect(getAllResponse.statusCode).toBe(200);
  });

  test('Update TaskStatus', async () => {
    const { id } = testTaskStatusData.taskStatus1;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const { updateResponse } = await updateTaskStatus({
      app, id, formData: { name: 'updated' }, cookie,
    });
    expect(updateResponse.statusCode).toBe(302);
    const ts = await app.db.models.TaskStatus.findOne({ where: { id } });
    expect(ts.name).toBe('updated');
  });

  test('Delete TaskSatus', async () => {
    const { id } = testTaskStatusData.taskStatus2;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const { deleteResponse } = await deleteTaskStatus({ app, id, cookie });
    expect(deleteResponse.statusCode).toBe(302);
    const ts = await app.db.models.TaskStatus.findOne({ where: { id } });
    expect(ts).toBeNull();
  });

  test('Delete TaskStatus wrong id', async () => {
    const id = 2000;
    const { cookie } = await login({ app, formData: testLoginData.user2 });
    const { deleteResponse } = await deleteTaskStatus({ app, id, cookie });
    expect(deleteResponse.statusCode).toBe(302);
  });
});
