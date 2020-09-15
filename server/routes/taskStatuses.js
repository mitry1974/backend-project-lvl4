import i18next from 'i18next';
import validateData from './validation/helpers';
import CreateTaskStatusSchema from './validation/CreateTaskStatusSchema';
import Models from '../db/models';
import NotFoundError from '../errors/NotFoundError';

export default (app) => {
  app.route({
    method: 'GET',
    url: '/taskStatuses/new',
    name: 'getNewTaskStatusForm',
    handler: async (request, reply) => {
      const formData = { name: '' };
      reply.render('/taskStatuses/new', { formData });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/taskStatuses/:id/edit',
    name: 'getEditTaskStatusForm',
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
    preValidation: async (request) => {
      console.log(`-------------------------------------> Create task status, formData: ${JSON.stringify(request.body.formData)}`);
      await validateData({
        ClassToValidate: CreateTaskStatusSchema,
        objectToValidate: request.body.formData,
        renderData: {
          url: '/taskStatuses/list',
          flashMessage: i18next.t('flash.users.create.error'),
          data: {
            formData: request.body.formData,
          },
        },
      });
    },
    handler: async (request, reply) => {
      console.log(`-------------------------------------> Create task status, formData: ${JSON.stringify(request.body.formData)}`);
      const ts = Models.TaskStatus.build(request.body.formData);
      await ts.save();

      request.flash('info', i18next.t('flash.taskStatuses.create.success'));
      reply.redirect(app.reverse('getAllTaskStatuses'));
      return reply;
    },
  });

  app.route({
    method: 'PUT',
    url: '/taskStatuses/:id',
    name: 'updateTaskStatus',
    preValidation: async () => {

    },
    preHandler: async () => {

    },
    handler: async (request, reply) => {
      const ts = await Models.TaskStatus.findOne({ where: { id: request.params.id } });
      if (!ts) {
        throw new NotFoundError();
      }
      ts.update(request.body.formData);

      request.flash('info', i18next.t('flash.taskStatuses.update.success'));
      reply.redirect(app.reverse('getAllTaskStatuses'));
      return reply;
    },
  });

  app.route({
    method: 'DELETE',
    url: '/taskStatuses/:id',
    name: 'deleteTaskStatus',
    preValidation: async () => {

    },
    preHandler: async () => {

    },
    handler: async (request, reply) => {
      const ts = await Models.TaskStatus.findOne({ where: { id: request.params.id } });
      if (!ts) {
        throw new NotFoundError();
      }

      await ts.destroy();

      request.flash('info', i18next.t('flash.taskStatuses.delete.success'));
      reply.redirect(app.reverse('getAllTaskStatuses'));
      return reply;
    },
  });
};
