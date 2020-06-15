import i18next from 'i18next';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import Models from '../db/models';
import LoginCredentialsDto from '../db/models/dto/LoginCredentialsDto';
import ValidationError from '../errors/ValidationError';
import AuthenticationError from '../errors/AutheticationError';

const doRedirect = (
  {
    route, message, app, request, reply,
  },
) => {
  request.flash('info', i18next.t(message));
  reply.redirect(app.reverse(route));
  return reply;
};

export default (app) => {
  app
    .get('/session/new', { name: 'getLoginForm' }, async (request, reply) => {
      const formData = new LoginCredentialsDto();
      reply.render('session/login', { formData });
      return reply;
    })
    .post('/session', { name: 'login' }, async (request, reply) => {
      const loginCredentialsDto = plainToClass(LoginCredentialsDto, request.body.formData);
      const errors = await validate(loginCredentialsDto);
      if (errors.length !== 0) {
        throw new ValidationError({
          url: '/session/login',
          message: `POST: /sessions, data: ${JSON.stringify(request.body.formData)}, validation errors: ${JSON.stringify(errors)}`,
          flashMessage: 'flash.users.create.error',
          formData: request.body.formData,
          errors,
        });
      }
      const user = await Models.User.findOne({ where: { email: loginCredentialsDto.email } });
      if (!user || !(await user.checkPassword(loginCredentialsDto.password))) {
        throw new AuthenticationError({
          message: `POST: /sessions, data: ${JSON.stringify(request.body.formData)}, user not authenticated}`,
        });
      }

      request.session.set('userId', user.id);

      return doRedirect(
        {
          route: 'root', message: 'flash.session.create.success', app, request, reply,
        },
      );
    })
    .get('/session/logout', { name: 'logout' }, async (request, reply) => {
      request.session.set('userId', null);
      request.session.delete();
      return doRedirect(
        {
          route: 'root', message: 'flash.session.delete.success', app, request, reply,
        },
      );
    });
};
