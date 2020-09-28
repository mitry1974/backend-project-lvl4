import i18next from 'i18next';
import 'reflect-metadata';
import Models from '../db/models';
import NotFoundError from '../errors/NotFoundError';
import AuthenticationError from '../errors/AutheticationError';
import UpdatePasswordSchema from './validation/UpdatePasswordSchema';
import RegisterUserSchema from './validation/RegisterUserSchema';
import UpdateUserSchema from './validation/UpdateUserSchema';
import validate from './validation/validate';

const findUserByEmail = async (email) => {
  const user = await Models.User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError();
  }
  return user;
};

export default (app) => {
  app.route({
    method: 'GET',
    url: '/users/register',
    name: 'getRegisterUserForm',
    handler: async (request, reply) => {
      const formData = Models.User.build();

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
      const formData = await findUserByEmail(email);
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
      const user = await findUserByEmail(request.params.email);
      reply.render('/users/view', { formData: user });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users',
    name: 'getAllUsers',
    handler: async (request, reply) => {
      // request.log.info('GET /users');
      const users = await Models.User.findAll();
      reply.render('/users/list', { users });
      return reply;
    },
  });

  app.route({
    method: 'POST',
    url: '/users',
    name: 'registerUser',
    preValidation: async (request) => {
      const { formData } = request.body;
      await validate({
        ClassToValidate: RegisterUserSchema,
        objectToValidate: formData,
        renderData: {
          url: 'users/register',
          flashMessage: i18next.t('flash.users.register.error'),
          data: {
            formData,
          },
        },
      });
    },
    handler: async (request, reply) => {
      const { formData } = request.body;
      const user = Models.User.build(formData);
      try {
        await user.save();
      } catch (e) {
        request.log.error(`Error register new user: ${e}`);
        throw e;
      }

      request.flash('info', i18next.t('flash.users.create.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    },
  });

  app.route({
    method: 'PUT',
    url: '/users/:email',
    name: 'updateUser',
    preValidation: async (request) => {
      const { formData } = request.body;
      await validate({
        ClassToValidate: UpdateUserSchema,
        objectToValidate: formData,
        renderData: {
          url: 'users/edit',
          flashMessage: i18next.t('flash.users.update.error'),
          data: {
            formData,
            email: request.params.email,
          },
        },
      });
    },
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const user = await findUserByEmail(request.params.email);
      try {
        await user.update(request.body.formData);
      } catch (e) {
        request.log.error(`Error register new user: ${e}`);
        throw e;
      }

      request.flash('info', i18next.t('flash.users.update.success'));
      reply.redirect(app.reverse('getAllUsers'));
      return reply;
    },
  });

  app.route({
    method: 'PUT',
    url: '/users/:email/updatePassword',
    name: 'updatePassword',
    preValidation: async (request) => {
      const { formData } = request.body;
      await validate({
        ClassToValidate: UpdatePasswordSchema,
        objectToValidate: formData,
        renderData: {
          url: 'users/updatePassword',
          flashMessage: i18next.t('flash.users.updatePassword.error'),
          data: {
            email: request.params.email,
            formData,
          },
        },
      });
    },
    preHandler: app.auth([app.verifyLoggedIn, app.verifyUserSelf], { relation: 'and' }),
    handler: async (request, reply) => {
      const user = await findUserByEmail(request.params.email);
      const { formData } = request.body;
      if (!user || !(await user.checkPassword(formData.oldPassword))) {
        throw new AuthenticationError({
          message: `POST: /sessions, data: ${JSON.stringify(request.body.formData)}, user not authenticated}`,
        });
      }
      try {
        await user.update(request.body.formData);
      } catch (e) {
        request.log.error(`Error update user password: ${e}`);
        throw e;
      }

      request.flash('info', i18next.t('flash.users.updatePassword.success'));
      reply.redirect(app.reverse('getEditUserForm', { email: request.params.email }));
      return reply;
    },
  });

  app.route({
    method: 'DELETE',
    url: '/users/:email',
    name: 'deleteUser',
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const user = await findUserByEmail(request.params.email);
      if (!user) {
        throw new NotFoundError();
      }

      try {
        await user.destroy();
      } catch (e) {
        request.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect(app.reverse('getAllUsers'));
      }

      request.flash('info', i18next.t('flash.users.delete.success'));
      reply.redirect(app.reverse('getAllUsers'));
      return reply;
    },
  });
};
