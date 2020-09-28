const testLoginData = {
  admin: {
    email: 'admin@fakedomain.com',
    password: '123456',
  },
  user1: {
    email: 'user1@fakedomain.com',
    password: '123456',
  },
  user2: {
    email: 'user2@fakedomain.com',
    password: '123456',
  },
};

const testTaskData = {
  task1: {
    id: 0,
    name: 'Task1',
    description: 'Description of that task',
    statusId: 1,
    creatorId: 1,
    assignedToId: 0,
  },
  task2: {
    id: 1,
    name: 'Task1',
    description: 'Description of second task',
    statusId: 1,
    creatorId: 1,
    assignedToId: 1,
  },
  task3: {
    id: 2,
    name: 'Task3',
    description: 'Description of third task',
    statusId: 1,
    creatorId: 1,
    assignedToId: 2,
  },
};

export { testLoginData, testTaskData };
