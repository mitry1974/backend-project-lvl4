import i18next from 'i18next';
import bcrypt from 'bcrypt';
import User from '../entity/User';

export default (app) => {
  app
    .get('/session/new', { name: 'getLoginForm' }, async (request, reply) => {
      const loginData = {};
      reply.render('session/login', { loginData });
      return reply;
    })
    .post('/session', { name: 'login' }, async (request, reply) => {
      const loginData = request.body.object;
      const user = await User.findOne({ email: loginData.email });
      if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
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
