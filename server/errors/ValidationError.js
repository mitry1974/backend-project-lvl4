export default class ValidationError extends Error {
  constructor(
    {
      errors, renderData,
    },
  ) {
    const message = `Validation error: validated ${renderData.formdata}, errors: ${JSON.stringify(errors, null, '\t')}`;
    super(message);
    this.validationErrors = errors;
    this.renderData = renderData;
  }

  proceed(request, reply) {
    request.log.error('this.message');

    request.flash('error', this.renderData.flashMessage);

    reply.code(400).render(
      this.renderData.url, { ...this.renderData.data, errors: this.validationErrors },
    );
    return reply;
  }
}
