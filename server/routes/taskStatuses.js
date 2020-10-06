import i18next from 'i18next';
import Models from '../db/models/index.js';
import NotFoundError from '../errors/NotFoundError.js';
import { validateAndRender } from './validation/index.js';

const validateTaskStatus = (app, formData, flashMessage, url) => validateAndRender(app, 'taskStatusSchema',
  {
    url,
    flashMessage,
    data: {
      formData,
    },
  });

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
      const ts = await Models.TaskStatus.findOne({ where: { id: request.params.id } });
      if (!ts) {
        throw new NotFoundError();
      }
      reply.render('/taskStatuses/edit', { formData: ts });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/taskStatuses',
    name: 'getAllTaskStatuses',
    handler: async (request, reply) => {
      const taskStatuses = await Models.TaskStatus.findAll();
      reply.render('/taskStatuses/list', { taskStatuses });
      return reply;
    },
  });

  app.route({
    method: 'POST',
    url: '/taskStatuses',
    name: 'createTaskStatus',
    preHandler: app.auth([app.verifyLoggedIn]),
    preValidation: async (request) => {
      const { formData } = request.body;
      await validateTaskStatus(app, formData, i18next.t('flash.taskStatuses.create.error', 'taskStatuses/new'));
    },
    handler: async (request, reply) => {
      const { formData } = request.body;
      const ts = Models.TaskStatus.build(formData);
      try {
        await ts.save();
      } catch (e) {
        request.log.error(`Create task status error, ${e}`);
        throw e;
      }

      request.flash('info', i18next.t('flash.taskStatuses.create.success'));
      reply.redirect(app.reverse('getAllTaskStatuses'));
      return reply;
    },
  });

  app.route({
    method: 'PUT',
    url: '/taskStatuses/:id',
    name: 'updateTaskStatus',
    preHandler: app.auth([app.verifyLoggedIn]),
    preValidation: async (request) => {
      const { formData } = request.body;
      await validateTaskStatus(app, formData, i18next.t('flash.taskStatuses.update.error', 'taskStatuses/edit'));
    },
    handler: async (request, reply) => {
      const { formData } = request.body;
      const ts = await Models.TaskStatus.findOne({ where: { id: request.params.id } });
      if (!ts) {
        throw new NotFoundError();
      }
      try {
        await ts.update(formData);
      } catch (e) {
        request.log.error(`Update task status error, ${e}`);
        throw e;
      }

      request.flash('info', i18next.t('flash.taskStatuses.update.success'));
      reply.redirect(app.reverse('getAllTaskStatuses'));
      return reply;
    },
  });

  app.route({
    method: 'DELETE',
    url: '/taskStatuses/:id',
    name: 'deleteTaskStatus',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const ts = await Models.TaskStatus.findOne({ where: { id: request.params.id } });
      if (!ts) {
        throw new NotFoundError();
      }

      try {
        await ts.destroy();
      } catch (e) {
        request.log.error(`Delete task status error, ${e}`);
        throw e;
      }

      request.flash('info', i18next.t('flash.taskStatuses.delete.success'));
      reply.redirect(app.reverse('getAllTaskStatuses'));
      return reply;
    },
  });
};
