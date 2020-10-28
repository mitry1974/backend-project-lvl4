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
    url: '/users/:email/edit',
    name: 'getEditUserForm',
    preHandler: app.auth([app.verifyLoggedIn, app.verifyUserSelf], { relation: 'and' }),
    handler: async (request, reply) => {
      const { email } = request.params;
      const formData = await app.db.models.User.findOne({ where: { email } });
      reply.render('users/edit', { formData, email });

      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users/:email/updatePassword',
    name: 'getUpdatePasswordForm',
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf], { relation: 'and' }),
    handler: async (request, reply) => {
      const formData = {
        password: '',
        confirm: '',
        oldPassword: '',
      };
      reply.render('users/updatePassword', { formData, email: request.params.email });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users/:email',
    name: 'getUser',
    preHandler: app.auth([app.verifyLoggedIn, app.verifyUserSelf], { relation: 'and' }),
    handler: async (request, reply) => {
      const user = await app.db.models.User.findOne({ where: { email: request.params.email } });
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
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.register.error' }, url: app.reverse('getRegisterUserForm'),
        });
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.users.register.success' }, url: app.reverse('root'),
      });
    },
  });

  app.route({
    method: 'PUT',
    url: '/users/:email',
    name: 'updateUser',
    config: {
      flashMessage: 'flash.users.update.error',
      template: `${'users/edit'}`,
      schemaName: 'updateUserSchema',
    },
    preValidation: async (request, reply) => validateBody(
      app, request, reply, { email: request.params.email },
    ),
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const user = await app.db.models.User.findOne({ where: { email: request.params.email } });
      try {
        await user.update(request.body.formData);
      } catch (e) {
        request.log.error(`Error updating user: ${e}`);
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.update.error' }, url: app.reverse('getAllUsers'),
        });
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.users.update.success' }, url: app.reverse('getAllUsers'),
      });
    },
  });

  app.route({
    method: 'PUT',
    url: '/users/:email/updatePassword',
    name: 'updatePassword',
    config: {
      flashMessage: 'flash.users.updatePassword.error',
      template: `${'users/updatePassword'}`,
      schemaName: 'updatePasswordSchema',
    },
    preValidation: async (request, reply) => validateBody(app, request, reply),
    preHandler: app.auth([app.verifyLoggedIn, app.verifyUserSelf], { relation: 'and' }),
    handler: async (request, reply) => {
      const user = await app.db.User.findOne({ where: { email: request.params.email } });
      const { formData } = request.body;
      if (!user || !(await user.checkPassword(formData.oldPassword))) {
        const url = app.reverse('getLoginForm');
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.updatePassword.error' }, url,
        });
      }
      try {
        await user.update(request.body.formData);
      } catch (e) {
        request.log.error(`Error updating user password: ${e}`);
        const url = app.reverse('getEditUserForm', { email: request.params.email });
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.updatePassword.error' }, url,
        });
      }

      const url = app.reverse('getEditUserForm', { email: request.params.email });
      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.users.updatePassword.success' }, url,
      });
    },
  });

  app.route({
    method: 'DELETE',
    url: '/users/:email',
    name: 'deleteUser',
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const user = await app.db.User.findOne({ where: { email: request.params.email } });

      try {
        await user.destroy();
      } catch (e) {
        request.log.error(`Error deleting user: ${e}`);
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.users.delete.error' }, url: app.reverse('getAllUsers'),
        });
      }

      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.users.delete.success' }, url: app.reverse('getAllUsers'),
      });
    },
  });
};
