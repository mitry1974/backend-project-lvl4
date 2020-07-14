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
  app.setErrorHandler(async (error, request, reply) => {
    console.log('MAIN ERROR HANDLER');
    rollbar.error(error, request);

    const type = error.constructor.name;
    request.log.info(`Routes error handler, error class: ${error.constructor.name}`);
    if ((error instanceof AutheticationError)
      || (error instanceof AuthorizationError)
      || (error instanceof ValidationError)
      || (error instanceof NotFoundError)) {
      error.proceed(request, reply);
    } else {
      console.log(`Routes error happens: type: ${type}, error: ${JSON.stringify(error, null, '\t')}`);
      reply.status(500);
      reply.send();
    }
  });
};
