const createTaskStatus = async ({ app, formData, cookies }) => {
  const createResponse = await app.inject({
    method: 'post',
    url: app.reverse('createTaskStatus'),
    cookies,
    payload: { formData },
  });

  return { createResponse };
};

const getAllTaskStatuses = async ({ app }) => {
  const getAllResponse = await app.inject({
    method: 'get',
    url: app.reverse('getAllTaskStatuses'),
  });
  return { getAllResponse };
};

const updateTaskStatus = async ({
  app, id, formData, cookie,
}) => {
  const updateResponse = await app.inject({
    method: 'put',
    url: app.reverse('updateTaskStatus', { id }),
    cookies: cookie,
    payload: { formData },
  });

  return { updateResponse };
};

const deleteTaskStatus = async ({ app, id, cookie }) => {
  const deleteResponse = await app.inject({
    method: 'delete',
    url: app.reverse('deleteTaskStatus', { id }),
    cookies: cookie,
  });

  return { deleteResponse };
};

export {
  createTaskStatus, getAllTaskStatuses, updateTaskStatus, deleteTaskStatus,
};
