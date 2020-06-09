import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import routesErrorHandler from '../lib/routesErrorHandler';

const routes = [welcome, users, sessions];

export default async (app) => {
  app.setErrorHandler(routesErrorHandler);
  return routes.forEach((f) => f(app));
};
