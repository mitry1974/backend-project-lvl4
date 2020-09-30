import StatusCodeError from './StatusCodeError.js';

export default class AuthorizationError extends StatusCodeError {
  constructor() {
    super('flash.auth.error');
  }
}
