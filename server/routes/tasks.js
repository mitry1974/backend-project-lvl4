import i18next from 'i18next';
import Models from '../db/models/index.js';
import NotFoundError from '../errors/NotFoundError.js';
import { validateAndRender } from './validation/index.js';

const findTaskById = (id) => Models.Task.findByPk(id, { include: ['status', 'creator', 'assignedTo', 'tags'] });

const getTasksAssociatedData = async () => {
  const data = {};
  data.statuses = await Models.TaskStatus.findAll();
  data.users = await Models.User.findAll();
  data.tags = await Models.Tag.findAll();

  return data;
};

const getTasksFilter = (request) => {
  const {
    tagId = '', statusId = '', assignedToId = '', selfTasks = '',
  } = request.query;
  const filter = { where: {}, include: ['status', 'creator', 'assignedTo'] };
  if (assignedToId) {
    filter.where.assignedToId = assignedToId;
  }

  if (statusId) {
    filter.where.statusId = statusId;
  }

  if (tagId) {
    filter.include.push({
      model: Models.Tag,
      as: 'tags',
      where: { id: tagId },
    });
  }

  if (selfTasks === 'on') {
    filter.where.creatorId = request.currentUser.id;
  }

  return filter;
};

export default (app) => {
  app.route({
    method: 'GET',
    url: '/tasks/new',
    name: 'getNewTaskForm',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const data = await getTasksAssociatedData();
      reply.render('tasks/new', { ...data });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/tasks/:id/edit',
    name: 'getEditTaskForm',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const data = await getTasksAssociatedData();
      const task = await findTaskById(request.params.id);
      task.tagsId = (await task.getTags()).map((v) => v.id);
      reply.render('tasks/edit', { formData: task, ...data });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/tasks',
    name: 'getAllTasks',
    handler: async (request, reply) => {
      const statuses = await Models.TaskStatus.findAll();
      const users = await Models.User.findAll();
      const tags = await Models.Tag.findAll();

      const filter = getTasksFilter(request);
      const tasks = await Models.Task.findAll(filter);
      reply.render('/tasks/list', {
        data: {
          tasks, statuses, users, tags,
        },
        filter: { ...request.query },
      });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/task/:id',
    name: 'getTask',
    handler: async (request, reply) => {
      const task = await findTaskById(request.params.id);
      reply.render('tasks/view', { formData: task });
    },
  });

  app.route({
    method: 'POST',
    url: '/tasks',
    name: 'createTask',
    preValidation: async (request) => {
      const { formData } = request.body;
      const data = await getTasksAssociatedData();
      await validateAndRender(app, 'taskSchema', i18next.t('flash.tasks.create.error'),
        {
          url: 'tasks/new',
          data: {
            formData,
            ...data,
          },
        });
    },
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const { formData } = request.body;
      formData.creatorId = request.currentUser.id;
      const task = Models.Task.build(formData);
      try {
        await task.save();
      } catch (e) {
        request.log.error(`Task create error, ${e}`);
        throw e;
      }
      request.flash('info', i18next.t('flash.tasks.create.success'));
      reply.redirect(app.reverse('getAllTasks'));
      return reply;
    },
  });

  app.route({
    method: 'PUT',
    url: '/tasks/:id/:email',
    name: 'updateTask',
    preValidation: async (request) => {
      const { formData } = request.body;
      const data = await getTasksAssociatedData();
      await validateAndRender(app, 'taskSchema', i18next.t('flash.tasks.update.error'),
        {
          url: 'tasks/edit',
          data: {
            formData,
            ...data,
          },
        });
    },
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const { formData } = request.body;

      const task = await findTaskById(request.params.id);
      try {
        if (!formData.tagsId) {
          formData.tagsId = [];
        }
        await task.update(formData, { include: Models.Tag });
        await task.setTags(formData.tagsId);

        request.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('getAllTasks'));
        return reply;
      } catch (e) {
        request.log.error(`Task update error, ${e}`);
        throw e;
      }
    },
  });

  app.route({
    method: 'DELETE',
    url: '/task:id/:email',
    name: 'deleteTask',
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const task = await findTaskById(request.params.id);
      if (!task) {
        throw new NotFoundError();
      }

      await task.destroy();

      request.flash('info', i18next.t('flash.tasks.delete.success'));
      reply.redirect(app.reverse('getAllTasks'));
      return reply;
    },
  });
};
