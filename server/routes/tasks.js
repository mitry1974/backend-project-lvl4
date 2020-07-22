import Models from '../db/models';

export default (app) => {
  app.route({
    method: 'GET',
    url: '/tasks',
    name: 'getAllTasks',
    handler: async (request, reply) => {
      const tasks = await Models.Task.findAll();
      reply.render('/tasks/list', { tasks });
      return reply;
    },
  });
};
