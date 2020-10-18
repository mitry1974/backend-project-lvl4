import i18next from 'i18next';
import redirect from './redirect';

export default class TMError extends Error {
  constructor(flashMessage, redirectUrl, message) {
    super(i18next.t(message));
    this.redirectUrl = redirectUrl;
    this.flashMessage = flashMessage;
  }

  proceed(request, reply) {
    return redirect({
      request, reply, flash: { type: 'error', message: this.flashMessage }, url: this.redirectUrl,
    });
  }
}
