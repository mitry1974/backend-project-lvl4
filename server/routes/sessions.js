import i18next from 'i18next';
import Models from '../db/models';
import AuthenticationError from '../errors/AutheticationError';
import { validateBody } from './validation';

export default (app) => {
  app.get('/session/new', { name: 'getLoginForm' }, async (request, reply) => {
    reply.render('session/login', { formData: { email: '', password: '' } });
    return reply;
  });

  app.route({
    method: 'POST',
    url: '/session',
    name: 'login',
    config: {
      flashMessage: 'flash.session.create.error',
      template: `${'session/login'}`,
      schemaName: 'loginSchema',
    },
    preValidation: async (request, reply) => validateBody(app, request, reply),
    handler: async (request, reply) => {
      const { formData } = request.body;
      const user = await Models.User.findOne({ where: { email: formData.email } });
      if (!user || !(await user.checkPassword(formData.password))) {
        request.log.error(`login with email ${formData.email} failed`);
        throw new AuthenticationError({
          message: `POST: /sessions, data: ${JSON.stringify(request.body.formData)}, user not authenticated}`,
        });
      }

      request.session.set('userId', user.id);

      request.flash('info', i18next.t('flash.session.create.success'));
      request.log.info(`login with email ${formData.email} succeeded`);
      reply.redirect(app.reverse('root'));
      return reply;
    },
  });

  app.delete('/session/logout', { name: 'logout' }, async (request, reply) => {
    request.session.set('userId', null);
    request.session.delete();

    request.flash('info', i18next.t('flash.session.delete.success'));
    reply.redirect(app.reverse('root'));
    return reply;
  });
};
