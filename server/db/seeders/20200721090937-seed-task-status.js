const Models = require('../models');

module.exports = {
  up: async () => {
    const values = [
      { name: 'new' },
      { name: 'inprocess' },
      { name: 'testing' },
      { name: 'completed' },
    ]
      .map(async (el) => {
        const ts = await Models.TaskStatus.findOne({ where: { name: el.name } });
        if (!ts) {
          await Models.TaskStatus.create(el);
        }
      });

    return Promise.all(values);
  },

  down: () => {
  },
};
