import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import errorHandler from './routesErrorHandler';
import registerSchemas from './validation';

const routes = [welcome, users, sessions];

export default async (app) => {
  // app.setErrorHandler(errorHandler);
  registerSchemas(app);

  return routes.forEach((f) => f(app));
}
