import { validateBody } from './validation';
import redirect from '../lib/redirect';

export default (app) => {
  app.route({
    method: 'GET',
    url: '/taskStatuses/new',
    name: 'getNewTaskStatusForm',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      reply.render('/taskStatuses/new', { formData: { name: '' } });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/taskStatuses/:id/edit',
    name: 'getEditTaskStatusForm',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const ts = await app.db.models.TaskStatus.findOne({ where: { id: request.params.id } });
      reply.render('/taskStatuses/edit', { formData: ts });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/taskStatuses',
    name: 'getAllTaskStatuses',
    handler: async (request, reply) => {
      const taskStatuses = await app.db.models.TaskStatus.findAll();
      reply.render('/taskStatuses/list', { taskStatuses });
      return reply;
    },
  });

  app.route({
    method: 'POST',
    url: '/taskStatuses',
    name: 'createTaskStatus',
    preHandler: app.auth([app.verifyLoggedIn]),
    config: {
      flashMessage: 'flash.taskStatuses.create.error',
      template: 'taskStatuses/new',
      schemaName: 'taskStatusSchema',
    },
    preValidation: async (request, reply) => validateBody(app, request, reply),
    handler: async (request, reply) => {
      const { formData } = request.body;
      const ts = app.db.models.TaskStatus.build(formData);
      try {
        await ts.save();
      } catch (e) {
        request.log.error(`Create task status error, ${e}`);
        throw e;
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.taskStatuses.create.success' }, url: app.reverse('getAllTaskStatuses'),
      });
    },
  });

  app.route({
    method: 'PUT',
    url: '/taskStatuses/:id',
    name: 'updateTaskStatus',
    config: {
      flashMessage: 'flash.taskStatuses.update.error',
      template: 'taskStatuses/edit',
      schemaName: 'taskStatusSchema',
    },
    preHandler: app.auth([app.verifyLoggedIn]),
    preValidation: async (request, reply) => validateBody(app, request, reply),
    handler: async (request, reply) => {
      const { formData } = request.body;
      const ts = await app.db.models.TaskStatus.findOne({ where: { id: request.params.id } });
      try {
        await ts.update(formData);
      } catch (e) {
        request.log.error(`Update task status error, ${e}`);
        throw e;
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.taskStatuses.update.success' }, url: app.reverse('getAllTaskStatuses'),
      });
    },
  });

  app.route({
    method: 'DELETE',
    url: '/taskStatuses/:id',
    name: 'deleteTaskStatus',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const ts = await app.db.models.TaskStatus.findOne({ where: { id: request.params.id } });
      if (!ts) {
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.taskStatuses.delete.error' }, url: app.reverse('getAllTaskStatuses'),
        });
      }

      try {
        await ts.destroy();
      } catch (e) {
        request.log.error(`Delete task status error, ${e}`);
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.taskStatuses.delete.error' }, url: app.reverse('getAllTaskStatuses'),
        });
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.taskStatuses.delete.success' }, url: app.reverse('getAllTaskStatuses'),
      });
    },
  });
};
