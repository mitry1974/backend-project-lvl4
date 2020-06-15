import i18next from 'i18next';

export default class StatusCodeError extends Error {
  constructor(message, statusCode) {
    super(i18next.t(message));
    this.statusCode = statusCode;
  }

  proceed(request, reply) {
    request.log.info(`Routes error: ${this.message}`);
    request.flash('error', this.message);
    reply.code(this.statusCode).render('welcome/index');
    return reply;
  }
}
