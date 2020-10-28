import { validateBody } from './validation';
import redirect from '../lib/redirect';

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
      const user = await app.db.models.User.findOne({ where: { email: formData.email } });
      if (!user || !(await user.checkPassword(formData.password))) {
        request.log.error(`login with email ${formData.email} failed`);
        return redirect({
          request, reply, flash: { type: 'error', message: 'flash.session.create.error' }, url: '/session/new',
        });
      }

      request.session.set('userId', user.id);
      return redirect({
        request, reply, flash: { type: 'info', message: 'flash.session.create.success' }, url: app.reverse('root'),
      });
    },
  });

  app.delete('/session/logout', { name: 'logout' }, async (request, reply) => {
    request.session.set('userId', null);
    request.session.delete();

    return redirect({
      request, reply, flash: { type: 'info', message: 'flash.session.delete.success' }, url: app.reverse('root'),
    });
  });
};
