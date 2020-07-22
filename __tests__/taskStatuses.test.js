import matchers from 'jest-supertest-matchers';
import { createTestApp } from './lib/utils';
import {
  createTaskStatus, getAllTaskStatuses, deleteTaskStatus, updateTaskStatus,
} from './lib/testHelpers/taskStatuses';
import testTaskStatusData from './lib/testHelpers/testData';
import Models from '../server/db/models';

describe('test TaskStatus route', () => {
  let app = null;

  beforeEach(async () => {
    expect.extend(matchers);
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  test('Test create new TaskStatus', async () => {
    const formData = { name: 'status4' };
    const { createResponse } = await createTaskStatus({ app, formData });
    expect(createResponse.status).toBe(302);
    const ts = Models.TaskStatus.findOne({ where: { name: formData.name } });
    expect(ts).not.toBeNull();
  });

  test('get all TaskStatuses', async () => {
    const { getAllResponse } = await getAllTaskStatuses({ app });
    expect(getAllResponse.status).toBe(200);
  });

  test('Test update TaskStatus', async () => {
    const id = 1;
    const { updateResponse } = await updateTaskStatus({ app, id, formData: { name: 'updated' } });
    expect(updateResponse.status).toBe(302);
    const ts = await Models.TaskStatus.findOne({ where: { id } });
    expect(ts.name).toBe('updated');
  });

  test('Test delete TaskSatus', async () => {
    const id = 1;
    const { deleteResponse } = await deleteTaskStatus({ app, id });
    expect(deleteResponse.status).toBe(302);
    const ts = await Models.TaskStatus.findOne({ where: { id } });
    expect(ts).toBeNull();
  });
});
