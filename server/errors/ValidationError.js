import Ajv from 'ajv';
import i18next from 'i18next';

export default class ValidationError extends Ajv.ValidationError {
  constructor(
    {
      url, message, formData, errors, flashMessage,
    },
  ) {
    super(message);
    this.url = url;
    this.errors = errors;
    this.formData = formData;
    this.flashMessage = flashMessage;
  }

  proceed(request, reply) {
    request.flash('error', i18next.t(this.flashMessage));
    reply.code(400).render(this.url, { formData: this.formData, errors: this.errors });
    return reply;
  }
}
