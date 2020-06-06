import Rollbar from 'rollbar';

export default (app) => {
  app.setErrorHandler(async (error, request, reply) => {
    console.log('MAIN ERROR HANDLER');
    const rollbar = new Rollbar(app.config.get('ROLLBAR_KEY'));
    rollbar.error(error, request);
    reply.status(500);
    reply.send();
  });
};
