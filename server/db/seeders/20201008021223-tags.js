const Models = require('../models')();

module.exports = {
  up: async () => {
    const values = [
      { name: 'node.js' },
      { name: 'php' },
      { name: 'c++' },
      { name: 'python' },
    ]
      .map(async (el) => {
        const ts = await Models.Tag.findOne({ where: { name: el.name } });
        if (!ts) {
          await Models.Tag.create(el);
        }
      });

    return Promise.all(values);
  },

  down: async () => {
  },
};
