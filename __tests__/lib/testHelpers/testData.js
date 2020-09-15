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
    id: 1,
    name: 'Task1',
    description: 'Description of that task',
    statusId: 1,
    creatorId: 1,
    assignedToId: 2,
  },
  task2: {
    id: 2,
    name: 'Task1',
    description: 'Description of second task',
    statusId: 1,
    creatorId: 1,
    assignedToId: 4,
  },
  task3: {
    id: 3,
    name: 'Task3',
    description: 'Description of third task',
    statusId: 1,
    creatorId: 1,
    assignedToId: 5,
  },
};

export { testLoginData, testTaskData };
