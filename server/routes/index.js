import welcome from './welcome';
import users from './users';
import sessions from './sessions';

const routes = [welcome, users, sessions];

export default (app) => routes.forEach((f) => f(app));
