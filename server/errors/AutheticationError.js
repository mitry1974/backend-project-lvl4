import StatusCodeError from './StatusCodeError';

export default class AuthenticationError extends StatusCodeError {
  constructor() {
    super('flash.auth.error', 401);
  }
}