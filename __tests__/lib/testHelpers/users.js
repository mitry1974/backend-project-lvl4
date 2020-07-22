import request from 'supertest';

const createUser = async ({ app, formData }) => {
  const createResponse = await request(app.server)
    .post('/users')
    .send({ formData });
  return { createResponse };
};

const deleteUser = async ({ app, emailToDelete, cookie }) => {
  const deleteResponse = await request(app.server)
    .delete(`/users/${emailToDelete}`)
    .set('Cookie', cookie);
  return { deleteResponse };
};

const updateUser = async (
  {
    app, emailToUpdate, formData, cookie,
  },
) => {
  const updateResponse = await request(app.server)
    .put(`/users/${emailToUpdate}`)
    .set('cookie', cookie)
    .send({ formData });

  return { updateResponse };
};

const getUser = async ({ app, cookie, email }) => {
  const getResponse = await request(app.server)
    .get(app.reverse('getUser', { email }))
    .set('cookie', cookie);

  return { getResponse };
};

const getAllUsers = async ({ app, cookie }) => {
  const getResponse = await request(app.server)
    .get(app.reverse('getAllUsers'))
    .set('cookie', cookie);
  return { getResponse };
};

export {
  createUser, deleteUser, updateUser, getUser, getAllUsers,
};
