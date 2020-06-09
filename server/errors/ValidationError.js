import i18next from 'i18next';

export default class ValidationError extends Error {
  constructor(
    {
      url, message, formData, errors, flashMessage,
    },
  ) {
    super(message);
    this.url = url;
    this.validationErrors = errors;
    this.formData = formData;
    this.flashMessage = flashMessage;
  }

  proceed(request, reply) {
    request.log.info(`Routes error: ${this.message}, formData:${JSON.stringify(this.formData, null, '\t')}, errors: ${JSON.stringify(this.validationErrors, null, '\t')}`);
    request.flash('error', i18next.t(this.flashMessage));
    reply.code(400).render(this.url, { formData: this.formData, errors: this.validationErrors });
    return reply;
  }
}
