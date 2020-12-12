const login = async ({ app, formData }) => {
  const loginResponse = await app.inject({
    method: 'post',
    url: 'session',
    payload: { formData },
  });

  const [sessionCookie] = loginResponse.cookies;
  const { name, value } = sessionCookie;
  const cookie = { [name]: value };
  return { cookie, status: loginResponse.statusCode };
};

const logout = async ({ app }) => {
  const logoutResponse = await app.inject({
    method: 'delete',
    url: '/session/logout',
  });

  return { status: logoutResponse.statusCode, cookie: logoutResponse.headers['set-cookie'] };
};

export { login, logout };
