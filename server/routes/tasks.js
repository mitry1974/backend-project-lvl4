import Models from '../db/models/index';
import { validateBody } from './validation';
import redirect from '../lib/redirect';

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

const formDataFromTask = async (task) => ({
  id: task.id,
  name: task.name,
  description: task.description,
  creatorId: task.creatorId,
  assignedToId: task.assignedToId,
  statusId: task.statusId,
  tagsId: (await task.getTags()).map((v) => v.id),
});

const validateTaskBody = async (app, request, reply) => {
  const data = await getTasksAssociatedData();
  const task = await findTaskById(request.body.formData.id);
  return validateBody(app, request, reply, { ...data, task });
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
      const formData = await formDataFromTask(task);
      reply.render('tasks/edit', { formData, ...data, task });
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
      return reply;
    },
  });

  app.route({
    method: 'POST',
    url: '/tasks',
    name: 'createTask',
    config: {
      flashMessage: 'flash.tasks.create.error',
      template: `${'tasks/create'}`,
      schemaName: 'tasksSchema',
    },
    preValidation: async (request, reply) => validateTaskBody(app, request, reply),
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const { formData } = request.body;
      formData.creatorId = request.currentUser.id;
      const task = Models.Task.build(formData);
      try {
        await task.save();
      } catch (e) {
        request.log.error(`Task create error, ${e}`);
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.tasks.cupdatereate.error' }, url: app.reverse('getAllTasks'),
        });
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.tasks.create.success' }, url: app.reverse('getAllTasks'),
      });
    },
  });

  app.route({
    method: 'PUT',
    url: '/tasks/:id/:email',
    name: 'updateTask',
    config: {
      flashMessage: 'flash.tasks.update.error',
      template: `${'tasks/edit'}`,
      schemaName: 'tasksSchema',
    },
    preValidation: async (request, reply) => validateTaskBody(app, request, reply),
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const { formData } = request.body;

      const task = await findTaskById(request.params.id);
      if (!task) {
        request.log.error(`Error updating task, task with id ${request.params.id} not found`);
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.tasks.update.error' }, url: app.reverse('getAllTasks'),
        });
      }

      try {
        if (!formData.tagsId) {
          formData.tagsId = [];
        }
        await task.update(formData, { include: Models.Tag });
        await task.setTags(formData.tagsId);
      } catch (e) {
        request.log.error(`Task update error, ${e}`);
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.tasks.update.error' }, url: app.reverse('getAllTasks'),
        });
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.tasks.update.success' }, url: app.reverse('getAllTasks'),
      });
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
        request.log.error(`Error deleting task, task with id ${request.params.id} not found`);
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.tasks.delete.error' }, url: app.reverse('getAllTasks'),
        });
      }

      try {
        await task.destroy();
      } catch (e) {
        request.log.error(`Error deleting task: ${e}`);
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.tasks.delete.error' }, url: app.reverse('getAllTasks'),
        });
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.tasks.delete.success' }, url: app.reverse('getAllTasks'),
      });
    },
  });
};
