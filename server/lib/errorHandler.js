import Rollbar from 'rollbar';
import AuthorizationError from '../errors/AuthorizationError.js';
import ValidationError from '../errors/ValidationError.js';
import AutheticationError from '../errors/AutheticationError.js';
import NotFoundError from '../errors/NotFoundError.js';

export default (app) => {
  const rollbar = new Rollbar(
    {
      accessToken: process.env.ROLLBAR_KEY,
      captureUncaught: true,
      captureUnhandledRejections: true,
    },
  );
  app.setErrorHandler((error, request, reply) => {
    if ((error instanceof AutheticationError)
      || (error instanceof AuthorizationError)
      || (error instanceof ValidationError)
      || (error instanceof NotFoundError)) {
      return error.proceed(request, reply);
    }
    const logMessage = `Global error handler error, ${error}`;
    request.log.error(logMessage);
    rollbar.log(logMessage);
    throw error;
  });
};
