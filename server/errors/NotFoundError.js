import StatusCodeError from './StatusCodeError';

export default class NotFoundError extends StatusCodeError {
  constructor() {
    super('flash.users.not_found');
  }
}
