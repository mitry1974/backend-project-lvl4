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
        console.log(`Create taskStatus with data: ${JSON.stringify(el)}`);
        const ts = await Models.TaskStatus.findOne({ where: { name: el.name } });
        console.log(`TaskStatus found: ${JSON.stringify(ts)}`);
        if (!await Models.TaskStatus.findOne({ where: { name: el.name } })) {
          await Models.TaskStatus.create(el);
        }
      });

    return Promise.all(values);
  },

  down: () => {
  },
};
