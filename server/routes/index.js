import welcome from './welcome';
import users from './users';
import sessions from './sessions';

const routes = [welcome, users, sessions];

export default async (app) => routes.forEach((f) => f(app));
