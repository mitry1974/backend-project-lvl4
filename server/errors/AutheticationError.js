import StatusCodeError from './StatusCodeError.js';

export default class AuthenticationError extends StatusCodeError {
  constructor() {
    super('flash.authentication.error');
  }
}
