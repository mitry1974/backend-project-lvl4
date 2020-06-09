import AuthorizationError from '../errors/AuthorizationError';
import ValidationError from '../errors/ValidationError';
import AutheticationError from '../errors/AutheticationError';

export default (error, request, reply) => {
  const type = error.constructor.name;
  request.log.info(`Routes error handler, error class: ${error.constructor.name}`);
  if ((error instanceof AutheticationError)
    || (error instanceof AuthorizationError)
    || (error instanceof ValidationError)) {
    error.proceed(request, reply);
  } else {
    request.log.info(`Routes error happens: type: ${type}, error: ${JSON.stringify(error, null, '\t')}`);
    throw error;
  }
};
