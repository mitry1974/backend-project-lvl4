import Rollbar from 'rollbar';
import TMError from './TMError';

export default (app) => {
  const rollbar = new Rollbar(
    {
      accessToken: process.env.ROLLBAR_KEY,
      captureUncaught: true,
      captureUnhandledRejections: true,
    },
  );
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof TMError) {
      return error.proceed(request, reply);
    }
    const logMessage = `Global error handler error, ${error}`;
    request.log.error(logMessage);
    rollbar.log(logMessage);

    reply.render('error/error', { error });
    return reply;
  });
};
