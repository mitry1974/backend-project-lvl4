import i18next from 'i18next';
import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import Models from '../db/models';
import RegisterUserSchema from './validation/RegisterUserSchema';
import UpdatePasswordSchema from './validation/UpdatePasswordSchema';
import UpdateUserSchema from './validation/UpdateUserSchema';
import EmailSchema from './validation/EmailSchema';
import NotFoundError from '../errors/NotFoundError';
import validateData from './validation/helpers';

const findUserByEmail = async (email) => {
  const user = await Models.User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError();
  }
  return user;
};

export default (app) => {
  app.get('/users/new', { name: 'getRegisterUserForm' }, async (request, reply) => {
    const formData = new RegisterUserSchema();

    reply.render('users/register', { formData });

    return reply;
  });

  app.route({
    method: 'GET',
    url: '/users/:email/edit',
    name: 'getEditUserForm',
    preValidate: async (request) => {
      await validateData({
        ClassToValidate: EmailSchema,
        objectToValidate: request.params,
        url: app.reverse('root'),
        flashMessage: i18next.t('flash.users.create.error'),
      });
    },
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const user = await findUserByEmail(request.params.email);
      reply.render('users/edit', { formData: user });

      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users/:email/change_password',
    name: 'getChangePasswordForm',
    preValidate: async (request) => {
      await validateData({ ClassToValidate: EmailSchema, objectToValidate: request.params, url: app.reverse('root') });
    },
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const formData = {
        password: '',
        confirm: '',
        oldPassword: '',
      };
      console.log(`/users/:email/change_password, email: ${request.params.email}`);
      reply.render('users/changePassword', { formData, email: request.params.email });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users/:email',
    name: 'getUser',
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      request.log.info(`GET /users/${request.params.email}`);
      const emailDto = plainToClass(EmailSchema, request.params);
      await validateData({ ClassToValidate: EmailSchema, objectToValidate: request.params, url: app.reverse('root') });

      const user = await findUserByEmail(emailDto.email);

      reply.render('/users/view', { formData: user });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users',
    name: 'getAllUsers',
    preHandler: app.auth([app.verifyAdmin]),
    handler: async (request, reply) => {
      request.log.info('GET /users');
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
      await validateData({
        ClassToValidate: RegisterUserSchema,
        objectToValidate: request.body.formData,
        url: 'users/register',
        flashMessage: i18next.t('flash.users.create.error'),
      });
    },
    handler: async (request, reply) => {
      console.log(`POST /users/, create user with data: ${JSON.stringify(request.body.formData, null, '\t')}!`);
      const user = Models.User.build(request.body.formData);
      await user.save();

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
      await validateData({ ClassToValidate: EmailSchema, objectToValidate: request.params, url: app.reverse('root') });
      await validateData({ ClassToValidate: UpdateUserSchema, objectToValidate: request.body.formData, url: 'users/edit' });
    },
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      console.log(`PUT /users/:${request.params.email}, update user`);
      const user = await findUserByEmail(request.params.email);
      user.update(request.body.formData);

      request.flash('info', i18next.t('flash.users.update.success'));
      reply.redirect(app.reverse('getAllUsers'));
      return reply;
    },
  });

  app.route({
    method: 'PUT',
    url: '/users/:email/update_password',
    name: 'updatePassword',
    preValidation: async (request) => {
      const backUrl = app.reverse('getChangePasswordForm');
      await validateData({
        ClassToValidate: EmailSchema, objectToValidate: request.params, url: backUrl,
      });
      await validateData({
        ClassToValidate: UpdatePasswordSchema,
        objectToValidate: request.body.formData,
        url: backUrl,
      });
    },
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      console.log(`PUT /users/:${request.params.email}, update user password`);
      const user = await findUserByEmail(request.params.email);
      user.update(request.body.formData);

      request.flash('info', i18next.t('flash.users.update_password.success'));
      reply.redirect(app.reverse('getEditUserFormUsers', { email: request.email }));
      return reply;
    },
  });

  app.route({
    method: 'DELETE',
    url: '/users/:email',
    name: 'deleteUser',
    preValidation: async (request) => {
      await validateData({ ClassToValidate: EmailSchema, objectToValidate: request.params, url: app.reverse('root') });
    },
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const user = await findUserByEmail(request.params.email);
      if (!user) {
        throw new NotFoundError();
      }

      await user.destroy();

      request.flash('info', i18next.t('flash.users.delete.success'));
      reply.redirect(app.reverse('getAllUsers'));
      return reply;
    },
  });
};
