import Rollbar from 'rollbar';
import AuthorizationError from '../errors/AuthorizationError';
import ValidationError from '../errors/ValidationError';
import AutheticationError from '../errors/AutheticationError';
import NotFoundError from '../errors/NotFoundError';

export default (app) => {
  const rollbar = new Rollbar(
    {
      accessToken: app.config.get('ROLLBAR_KEY'),
      captureUncaught: true,
      captureUnhandledRejections: true,
    },
  );
  app.setErrorHandler((error, request, reply) => {
    if ((error instanceof AutheticationError)
      || (error instanceof AuthorizationError)
      || (error instanceof ValidationError)
      || (error instanceof NotFoundError)) {
      error.proceed(request, reply);
    } else {
      request.log.error(`Main error handler: ${error}`);
      rollbar.error(error, request);
      reply.status(500);
    }
  });
};
