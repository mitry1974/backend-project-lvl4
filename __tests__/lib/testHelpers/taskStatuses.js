import request from 'supertest';

const createTaskStatus = async ({ app, formData }) => {
  const createResponse = await request(app.server)
    .post(app.reverse('createTaskStatus'))
    .send({ formData });
  return { createResponse };
};

const getAllTaskStatuses = async ({ app }) => {
  const getAllResponse = await request(app.server)
    .get(app.reverse('getAllTaskStatuses'));
  return { getAllResponse };
};

const updateTaskStatus = async ({ app, id, formData }) => {
  const updateResponse = await request(app.server)
    .put(app.reverse('updateTaskStatus', { id }))
    .send({ formData });

  return { updateResponse };
};

const deleteTaskStatus = async ({ app, id }) => {
  const deleteResponse = await request(app.server)
    .delete(app.reverse('deleteTaskStatus', { id }));
  return { deleteResponse };
};

export {
  createTaskStatus, getAllTaskStatuses, updateTaskStatus, deleteTaskStatus,
};
