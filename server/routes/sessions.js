import i18next from 'i18next';
import Models from '../db/models';

export default (app) => {
  app
    .get('/session/new', { name: 'getLoginForm' }, async (request, reply) => {
      const loginData = {};
      reply.render('session/login', { loginData });
      return reply;
    })
    .post('/session', { name: 'login' }, async (request, reply) => {
      const loginData = request.body.object;
      console.log(`Session:login, login data: ${JSON.stringify(loginData)}`);
      const user = await Models.User.findOne({ where:{ email: loginData.email } });
      if (!user || !(await user.checkPassword(loginData.password))) {
        request.flash('error', i18next.t('flash.session.create.error'));
        reply.render('session/login', { loginData });
        return reply;
      }

      request.session.set('userId', user.id);
      request.flash('info', i18next.t('flash.session.create.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    })
    .get('/session/logout', { name: 'logout' }, async (request, reply) => {
      request.session.set('userId', null);
      request.session.delete();
      request.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));

      return reply;
    });
};
