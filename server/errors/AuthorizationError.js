import StatusCodeError from './StatusCodeError';

export default class AuthorizationError extends StatusCodeError {
  constructor() {
    super('flash.auth.error', 403);
  }
}
