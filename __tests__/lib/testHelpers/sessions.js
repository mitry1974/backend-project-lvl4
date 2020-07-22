import request from 'supertest';

const login = async ({ app, formData }) => {
  const loginResponse = await request(app.server)
    .post('/session')
    .send({ formData });

  const cookie = loginResponse.header['set-cookie'];
  return { cookie, status: loginResponse.status };
};

const logout = async ({ app }) => {
  const logoutResponse = await request(app.server)
    .delete('/session/logout');
  return logoutResponse;
};

export { login, logout };
