import StatusCodeError from './StatusCodeError.js';

export default class NotFoundError extends StatusCodeError {
  constructor() {
    super('flash.users.not_found');
  }
}
