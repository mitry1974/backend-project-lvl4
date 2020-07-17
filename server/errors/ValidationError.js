export default class ValidationError extends Error {
  constructor(
    {
      message, errors, renderData,
    },
  ) {
    super(message);
    this.validationErrors = errors;
    this.renderData = renderData;
  }

  proceed(request, reply) {
    request.log.info(`Routes error: ${this.message}, errors: ${JSON.stringify(this.validationErrors, null, '\t')}`);
    request.flash('error', this.renderData.flashMessage);

    reply.code(400).render(
      this.renderData.url, { ...this.renderData.data, errors: this.validationErrors },
    );
    return reply;
  }
}
