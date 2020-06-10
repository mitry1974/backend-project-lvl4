import request from 'supertest';

const login = async ({ app, formData }) => {
  const loginResponse = await request(app.server)
    .post('/session')
    .send({ formData });

  const cookie = loginResponse.header['set-cookie'];
  return { cookie };
};

const deleteUser = async ({ app, emailToDelete, cookie }) => {
  const deleteResponse = await request(app.server)
    .delete(`/users/${emailToDelete}`)
    .set('Cookie', cookie);
  return { deleteResponse };
};

const updateUser = async (
  {
    app, emailToUpdate, formData, cookie = '',
  },
) => {
  const updateResponse = await request(app.server)
    .put(`/users/${emailToUpdate}`)
    .set('cookie', cookie)
    .send({ formData });

  return { updateResponse };
};

const getUser = async ({ app, email, cookie }) => {
  const readResponse = await request(app.server)
    .get(`/users/${email}`)
    .set('cookie', cookie);

  return { readResponse };
};

const getAllUsers = async ({ app, cookie }) => {
  const readResponse = await request(app.server)
    .get('/users')
    .set('cookie', cookie);

  return { readResponse };
};

export {
  login, deleteUser, updateUser, getUser, getAllUsers,
};
