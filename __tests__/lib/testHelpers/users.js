const createUser = async ({ app, formData }) => {
  const createResponse = await app.inject({
    method: 'post',
    url: app.reverse('registerUser'),
    payload: { formData },
  });

  return { createResponse };
};

const deleteUser = async ({ app, userIdToDelete, cookie }) => {
  const deleteResponse = await app.inject({
    method: 'delete',
    url: app.reverse('deleteUser', { userId: userIdToDelete }),
    cookies: cookie,
  });

  return { deleteResponse };
};

const updateUser = async (
  {
    app, userIdToUpdate, formData, cookie,
  },
) => {
  const updateResponse = await app.inject({
    method: 'put',
    url: app.reverse('updateUser', { userId: userIdToUpdate }),
    cookies: cookie,
    payload: { formData },
  });

  return { updateResponse };
};

const updatePassword = async (
  {
    app, userIdToUpdate, formData, cookie,
  },
) => {
  const updateResponse = await app.inject({
    method: 'put',
    url: app.reverse('updatePassword', { userId: userIdToUpdate }),
    cookies: cookie,
    payload: { formData },
  });

  return { updateResponse };
};

const getUser = async ({ app, cookie, userId }) => {
  const getResponse = await app.inject({
    method: 'get',
    url: app.reverse('getUser', { userId }),
    cookie,
  });

  return { getResponse };
};

const getAllUsers = async ({ app, cookie }) => {
  const getResponse = await app.inject({
    method: 'get',
    url: app.reverse('getAllUsers'),
    cookies: cookie,
  });

  return { getResponse };
};

export {
  createUser, deleteUser, updateUser, getUser, getAllUsers, updatePassword,
};
