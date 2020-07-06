import i18next from 'i18next';
import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import Models from '../db/models';
import RegisterUserSchema from './validation/RegisterUserSchema';
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

const redirectRoot = (app, request, reply, flash) => {
  request.flash('info', i18next.t(flash));
  reply.redirect(app.reverse('root'));
  return reply;
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
      reply.render('users/changePassword', { email: request.params.email });
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

      return redirectRoot(app, request, reply, 'flash.users.create.success');
    },
  });

  app.route({
    method: 'PUT',
    url: '/users/:email',
    name: 'updateUser',
    preValidate: async (request) => {
      await validateData({ ClassToValidate: EmailSchema, objectToValidate: request.params, url: app.reverse('root') });
      await validateData({ ClassToValidate: UpdateUserSchema, objectToValidate: request.body.formData, url: '' });
    },
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      console.log(`PUT /users/:${request.params.email}, update user`);
      const user = await findUserByEmail(request.params.email);
      user.update(request.body.formData);

      return redirectRoot(app, request, reply, 'flash.users.update.success');
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

      return redirectRoot(app, request, reply, 'flash.users.delete.success');
    },
  });
};
