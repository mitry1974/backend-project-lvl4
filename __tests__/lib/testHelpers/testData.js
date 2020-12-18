const testLoginData = {
  admin: {
    id: 1,
    email: 'admin@fakedomain.com',
    password: '123456',
  },
  user2: {
    id: 2,
    email: 'user2@fakedomain.com',
    password: '123456',
  },
  user3: {
    id: 3,
    email: 'user3@fakedomain.com',
    password: '123456',
  },
  user4: {
    id: 4,
    email: 'user4@fakedomain.com',
    password: '123456',
  },
  user5: {
    id: 5,
    email: 'user5@fakedomain.com',
    password: '123456',
  },
  user6: {
    id: 6,
    email: 'user6@fakedomain.com',
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
    assignedToId: 1,
  },
  task3: {
    id: 3,
    name: 'Task3',
    description: 'Description of third task',
    statusId: 1,
    creatorId: 1,
    assignedToId: 2,
  },
};

const testTaskStatusData = {
  taskStatus1: {
    id: 1,
    name: 'status1',
  },
  taskStatus2: {
    id: 2,
    name: 'status2',
  },
  taskStatus3: {
    id: 3,
    name: 'status3',
  },
};

const testTagData = {
  tag1: {
    id: 1,
    name: 'tag1',
  },
  tag2: {
    id: 2,
    name: 'tag2',
  },
  tag3: {
    id: 3,
    name: 'tag3',
  },
  missingTag: {
    id: 200,
    name: 'missing',
  },
};

export {
  testLoginData, testTaskData, testTaskStatusData, testTagData,
};
