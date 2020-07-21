import i18next from 'i18next';
import Models from '../db/models';
import LoginSchema from './validation/LoginSchema';
import validateData from './validation/helpers';
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
  app.get('/session/new', { name: 'getLoginForm' }, async (request, reply) => {
    const formData = new LoginSchema();
    reply.render('session/login', { formData });
    return reply;
  });

  app.route({
    method: 'POST',
    url: '/session',
    name: 'login',
    preValidation: async (request) => {
      await validateData({
        ClassToValidate: LoginSchema,
        objectToValidate: request.body.formData,
        renderData: {
          url: 'session/login',
          flashMessage: i18next.t('flash.session.create.error'),
          data: {
            formData: request.body.formData,
          },
        },
      });
    },
    handler: async (request, reply) => {
      const { formData } = request.body;
      const user = await Models.User.findOne({ where: { email: formData.email } });
      if (!user || !(await user.checkPassword(formData.password))) {
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
    },
  });

  app.delete('/session/logout', { name: 'logout' }, async (request, reply) => {
    request.session.set('userId', null);
    request.session.delete();
    return doRedirect(
      {
        route: 'root', message: 'flash.session.delete.success', app, request, reply,
      },
    );
  });
};
