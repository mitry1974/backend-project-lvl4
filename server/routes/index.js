import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import taskStatuses from './taskStatuses';
import tasks from './tasks';
import tags from './tags';

const routes = [welcome, users, sessions, taskStatuses, tasks, tags];

export default async (app) => routes.forEach((f) => f(app));
