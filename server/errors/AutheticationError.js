import i18next from 'i18next';

export default class AuthenticationError extends Error {
  constructor({ message }) {
    super(message);
  }

  proceed(request, reply) {
    request.log.info(`Routes error: ${this.message}`);
    request.flash('error', i18next.t('flash.auth.error'));
    reply.code(401).render('welcome/index');
    return reply;
  }
}
