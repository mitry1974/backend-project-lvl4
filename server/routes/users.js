import 'reflect-metadata';
import { validateBody } from './validation';
import redirect from '../lib/redirect';

export default (app) => {
  app.route({
    method: 'GET',
    url: '/users/register',
    name: 'getRegisterUserForm',
    handler: async (request, reply) => {
      const formData = app.db.models.User.build();

      reply.render('users/register', { errors: {}, formData });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users/:userId/edit',
    name: 'getEditUserForm',
    preHandler: app.auth([app.verifyLoggedIn, app.verifyUserSelf], { relation: 'and' }),
    handler: async (request, reply) => {
      console.log('=======================================================> 1');
      const userId = parseInt(request.params.userId, 10);
      console.log('=======================================================> 2');
      const formData = await app.db.models.User.findByPk(userId);
      console.log('=======================================================> 3');
      reply.render('users/edit', { formData, userId });
      console.log('=======================================================> 4');

      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users/:userId/updatePassword',
    name: 'getUpdatePasswordForm',
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf], { relation: 'and' }),
    handler: async (request, reply) => {
      const formData = {
        password: '',
        confirm: '',
        oldPassword: '',
      };
      reply.render('users/updatePassword', { formData, id: request.params.userId });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users/:userId',
    name: 'getUser',
    preHandler: app.auth([app.verifyLoggedIn, app.verifyUserSelf], { relation: 'and' }),
    handler: async (request, reply) => {
      const user = await app.db.models.User.findByPk(request.params.userId);
      reply.render('/users/view', { formData: user });
    },
  });

  app.route({
    method: 'GET',
    url: '/users',
    name: 'getAllUsers',
    handler: async (request, reply) => {
      const users = await app.db.models.User.findAll();
      reply.render('/users/list', { users });
      return reply;
    },
  });

  app.route({
    method: 'POST',
    url: '/users',
    name: 'registerUser',
    config: {
      flashMessage: 'flash.users.register.error',
      template: `${'users/register'}`,
      schemaName: 'registerUserSchema',
    },
    preValidation: async (request, reply) => validateBody(app, request, reply),
    handler: async (request, reply) => {
      const { formData } = request.body;
      const user = app.db.models.User.build(formData);
      try {
        await user.save();
      } catch (e) {
        request.log.error(`Error register new user: ${e}`);
        redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.register.error' }, url: app.reverse('getRegisterUserForm'),
        });
      }

      redirect({
        request, reply, flash: { type: 'info', message: 'flash.users.register.success' }, url: app.reverse('root'),
      });
    },
  });

  app.route({
    method: 'PUT',
    url: '/users/:userId',
    name: 'updateUser',
    config: {
      flashMessage: 'flash.users.update.error',
      template: `${'users/edit'}`,
      schemaName: 'updateUserSchema',
    },
    preValidation: async (request, reply) => validateBody(
      app, request, reply, { id: request.params.userId },
    ),
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const user = await app.db.models.User.findByPk(request.params.userId);
      try {
        await user.update(request.body.formData);
      } catch (e) {
        request.log.error(`Error updating user: ${e}`);
        redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.update.error' }, url: app.reverse('getAllUsers'),
        });
      }

      redirect({
        request, reply, flash: { type: 'info', message: 'flash.users.update.success' }, url: app.reverse('getAllUsers'),
      });
    },
  });

  app.route({
    method: 'PUT',
    url: '/users/:userId/updatePassword',
    name: 'updatePassword',
    config: {
      flashMessage: 'flash.users.updatePassword.error',
      template: `${'users/updatePassword'}`,
      schemaName: 'updatePasswordSchema',
    },
    preValidation: async (request, reply) => validateBody(app, request, reply),
    preHandler: app.auth([app.verifyLoggedIn, app.verifyUserSelf], { relation: 'and' }),
    handler: async (request, reply) => {
      const user = await app.db.models.User.findByPk(request.params.userId);
      const { formData } = request.body;
      if (!user || !(await user.checkPassword(formData.oldPassword))) {
        const url = app.reverse('getLoginForm');
        redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.updatePassword.error' }, url,
        });
      }
      try {
        await user.update(request.body.formData);
      } catch (e) {
        request.log.error(`Error updating user password: ${e}`);
        const url = app.reverse('getEditUserForm', { userId: request.params.userId });
        redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.updatePassword.error' }, url,
        });
      }

      const url = app.reverse('getEditUserForm', { id: request.params.id });
      redirect({
        request, reply, flash: { type: 'info', message: 'flash.users.updatePassword.success' }, url,
      });
    },
  });

  app.route({
    method: 'DELETE',
    url: '/users/:userId',
    name: 'deleteUser',
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      try {
        const user = await app.db.models.User.findByPk(request.params.userId);
        if (!user) {
          request.log.error('Error deleting user, user not found');
          redirect({
            request, reply, flash: { type: 'error', message: 'flash.users.delete.errorUserNotFound' }, url: app.reverse('getAllUsers'),
          });
          return reply;
        }

        const linkedTasks = await app.db.models.Task.findAll({
          where: {
            [app.db.Op.or]: [
              { assignedToId: user.id },
              { creatorId: user.id },
            ],
          },
        });

        if (linkedTasks.length !== 0) {
          request.log.error(`Error deleting user, because it has linked tasks: ${linkedTasks.map((task) => task.name).join(',')}`);
          redirect({
            request, reply, flash: { type: 'error', message: 'flash.users.delete.errorLinkedTask' }, url: app.reverse('getAllUsers'),
          });
          return reply;
        }

        await user.destroy();
      } catch (e) {
        request.log.error(`Error deleting user: ${e}`);
        redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.delete.error' }, url: app.reverse('getAllUsers'),
        });
        return reply;
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.users.delete.success' }, url: app.reverse('getAllUsers'),
      });
    },
  });
};
