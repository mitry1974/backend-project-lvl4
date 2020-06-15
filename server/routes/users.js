import i18next from 'i18next';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import Models from '../db/models';
import RegisterUserDto from '../db/models/dto/RegisterUserDto';
import EmailDto from '../db/models/dto/EmailDto';
import ValidationError from '../errors/ValidationError';

export default (app) => {
  app.get('/users/new', { name: 'getRegisterUserForm' }, async (request, reply) => {
    const formData = new RegisterUserDto();
    reply.render('users/register', {
      formData,
      action: app.reverse('registerUser'),
      caption: 'Register user',
    });

    return reply;
  });

  app.get('/users/edit/:email', { name: 'getEditUserForm' }, async (request, reply) => {
    const userId = request.session.get('userId') || request.params.id;
    if (!userId) {
      throw new Error('Edit user with missing user id');
    }
    const user = await Models.User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Edit user with migging user');
    }

    reply.render('users/register', {
      user,
      action: app.reverse('saveUser', { id: userId }),
      caption: 'Save',
    });
    return reply;
  });

  app.route({
    method: 'GET',
    url: '/users/:email',
    name: 'getUser',
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      console.log(`getUser !!!!!!!!!!!!!!!!!!!!!!!!!, email: ${JSON.stringify(request.params)}`);
      const emailDto = plainToClass(EmailDto, request.params);
      if (!emailDto) {
        throw new Error('Register new user, missing user email!');
      }
      const errors = await validate(emailDto);

      if (errors.length !== 0) {
        throw new ValidationError({
          url: app.reverse('root'),
          message: `GET: /users:email, data: ${JSON.stringify(request.params.email)}, validation errors: ${JSON.stringify(errors)}`,
          formData: emailDto,
          errors,
        });
      }
      const user = await Models.User.findOne({ where: { email: emailDto.email } });
      if (!user) {
        request.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      }

      reply.render('/users/view', { formData: user });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/users',
    name: 'getAllUsers',
    prehandler: app.auth([app.verifyAdmin]),
    handler: async (request, reply) => {
      console.log('getAllUsers !!!!!!!!!!!!!!!!!!!!!!!!!!');
      const users = await Models.User.findAll();
      reply.render('/users/list', { users });
      return reply;
    },
  });

  app.route({
    method: 'POST',
    url: '/users',
    name: 'registerUser',
    handler: async (request, reply) => {
      const userDto = plainToClass(RegisterUserDto, request.body.formData);
      if (!userDto) {
        throw new Error('Register new user, missing user data!');
      }
      const errors = await validate(userDto);
      if (errors.length !== 0) {
        throw new ValidationError({
          url: '/users/register',
          message: `POST: /users, data: ${JSON.stringify(request.body.formData)}, validation errors: ${JSON.stringify(errors)}`,
          formData: request.body.formData,
          errors,
        });
      }
      const user = Models.User.build(userDto);
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
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const emailDto = plainToClass(EmailDto, request.params);
      const updateUserDto = plainToClass(RegisterUserDto, request.body.formData);
      request.log.info(`Update user with email: ${JSON.stringify(emailDto)} and data: ${JSON.stringify(updateUserDto)}`);
      if (!emailDto) {
        throw new Error('Register new user, missing user email!');
      }
      const errorsEmail = await validate(emailDto);

      if (!updateUserDto) {
        throw new Error('Register new user, missing user data!');
      }
      const errorsUpdate = await validate(updateUserDto);

      if (errorsEmail.length !== 0 || errorsUpdate.length !== 0) {
        const errors = { ...errorsEmail, ...errorsUpdate };
        throw new ValidationError({
          url: app.reverse('root'),
          message: `PUT: /users, data: ${JSON.stringify(request.body.formData)}, validation errors: ${JSON.stringify(errors)}`,
          formData: request.body.formData,
          errors,
        });
      }
      const { email } = emailDto;
      const user = await Models.User.findOne({ where: { email } });
      if (!user) {
        throw new Error(`PUT:/users, user with email: ${email} didn't found`);
      }
      await Models.User.update(updateUserDto, { where: { email } });

      request.flash('info', i18next.t('flash.users.create.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    },
  });

  app.route({
    method: 'DELETE',
    url: '/users/:email',
    name: 'deleteUser',
    preHandler: app.auth([app.verifyAdmin, app.verifyUserSelf]),
    handler: async (request, reply) => {
      const emailDto = plainToClass(EmailDto, request.params);
      if (!emailDto) {
        throw new Error('Register new user, missing user email!');
      }
      const errors = await validate(emailDto);

      if (errors.length !== 0) {
        throw new ValidationError({
          url: app.reverse('root'),
          message: `PUT: /users, data: ${JSON.stringify(request.body.formData)}, validation errors: ${JSON.stringify(errors)}`,
          formData: emailDto,
          errors,
        });
      }
      const user = await Models.User.findOne({ where: { email: emailDto } });
      if (!user) {
        request.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      }

      await user.destroy({ where: { email: emailDto } });
      request.flash('info', i18next.t('flash.users.create.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    },
  });
};
