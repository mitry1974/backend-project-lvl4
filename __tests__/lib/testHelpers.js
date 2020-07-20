import request from 'supertest';

const login = async ({ app, formData }) => {
  const loginResponse = await request(app.server)
    .post('/session')
    .send({ formData });

  const cookie = loginResponse.header['set-cookie'];
  return { cookie, status: loginResponse.status };
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

const testLoginData = {
  admin: {
    email: 'admin@fakedomain.com',
    password: '123456',
  },
  user1: {
    email: 'user1@fakedomain.com',
    password: '123456',
  },
  user2: {
    email: 'user2@fakedomain.com',
    password: '123456',
  },
};

export {
  login, deleteUser, updateUser, getUser, getAllUsers, testLoginData,
};
