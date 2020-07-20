const Models = require('../models');

module.exports = {
  up: async () => {
    const users = [
      {
        email: 'admin@fakedomain.com',
        firstname: 'Admin',
        lastname: 'Admin',
        password: '123456',
        role: 'admin',
      },
      {
        email: 'user@fakedomain.com',
        firstname: 'User',
        lastname: 'User',
        password: '123456',
        role: 'user',
      },
    ].map(async (el) => {
      if (!await Models.user.findOne({ where: { email: el.email } })) {
        await Models.user.create(el);
      }
    });

    return Promise.all(users);
  },

  down: () => {
  },
};
