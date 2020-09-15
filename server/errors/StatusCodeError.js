import i18next from 'i18next';

export default class StatusCodeError extends Error {
  constructor(message, statusCode, redirectPath) {
    super(i18next.t(message));
    this.statusCode = statusCode;
    this.redirectPath = redirectPath;
  }

  proceed(request, reply) {
    request.log.error(`Routes error: ${this.message}`);
    request.flash('error', this.message);
    reply.redirect(302, '/session/new');
    return reply;
  }
}
