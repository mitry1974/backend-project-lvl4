import welcome from './welcome.js';
import users from './users.js';
import sessions from './sessions.js';
import taskStatuses from './taskStatuses.js';
import tasks from './tasks.js';
import tags from './tags.js';

const routes = [welcome, users, sessions, taskStatuses, tasks, tags];

export default async (app) => routes.forEach((f) => f(app));
