import StatusCodeError from './StatusCodeError';

export default class AuthenticationError extends StatusCodeError {
  constructor() {
    super('flash.authentication.error');
  }
}
