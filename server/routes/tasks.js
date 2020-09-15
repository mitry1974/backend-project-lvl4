import i18next from 'i18next';
import Sequelize from 'sequelize';
import _ from 'lodash';
import Models from '../db/models';
import ValidationError from '../errors/ValidationError';
import NotFoundError from '../errors/NotFoundError';

const findTaskById = (id) => Models.Task.findByPk(id, { include: ['status', 'creator', 'assignedTo', 'tags'] });

const parseErrors = (e) => {
  const errorsData = e.errors.reduce((acc, error) => {
    const { path, message } = error;
    if (!acc[path]) {
      acc[path] = '';
    }
    acc[path] += message;
    return acc;
  }, {});

  return errorsData;
};

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
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const { formData } = request.body;
      formData.creatorId = request.currentUser.id;
      const task = Models.Task.build(formData);
      try {
        await task.save();
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          const errors = parseErrors(e);
          const data = await getTasksAssociatedData();
          request.flash('error', i18next.t('flash.tasks.create.error'));
          reply.code(400).render('tasks/new', { errors, ...data });
          return reply;
        }
        throw e;
      }
      request.flash('info', i18next.t('flash.tasks.create.success'));
      reply.redirect(app.reverse('getAllTasks'));
      return reply;
    },
  });

  app.route({
    method: 'PUT',
    url: '/tasks/:id',
    name: 'updateTask',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const { formData } = request.body;

      const task = await findTaskById(request.params.id);
      try {
        await task.update(formData, { include: Models.Tag });
        await task.setTags(formData.tagsId);

        request.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('getAllTasks'));
        return reply;
      } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
          const errors = parseErrors(e);
          const data = await getTasksAssociatedData();
          request.flash('error', i18next.t('flash.tasks.create.error'));
          reply.code(400).render('tasks/new', { errors, ...data });
          return reply;
        }
        throw e;
      }
    },
  });

  app.route({
    method: 'DELETE',
    url: '/task:id',
    name: 'deleteTask',
    preHandler: app.auth([app.verifyLoggedIn]),
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
