const Models = require('../models');

module.exports = {
  up: async () => {
    const tasks = [
      {
        id: 1,
        name: 'Task1',
        description: 'Description of that task',
        statusId: 1,
        creatorId: 1,
        assignedToId: 2,
      },
      {
        id: 2,
        name: 'Task1',
        description: 'Description of second task',
        statusId: 1,
        creatorId: 1,
        assignedToId: 4,
      },
      {
        id: 3,
        name: 'Task3',
        description: 'Description of third task',
        statusId: 1,
        creatorId: 1,
        assignedToId: 5,
      },
    ].map(async (el) => {
      if (!await Models.Task.findOne({ where: { id: el.id } })) {
        await Models.Task.create(el);
      }
    });

    return Promise.all(tasks);
  },

  down: async () => {
  },
};
