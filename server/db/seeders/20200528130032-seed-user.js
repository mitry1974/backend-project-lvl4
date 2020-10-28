const Models = require('../models')();

module.exports = {
  up: async () => {
    const users = [
      {
        id: 1,
        email: 'admin@fakedomain.com',
        firstname: 'Admin',
        lastname: 'Admin',
        password: '123456',
        role: 'admin',
      },
      {
        id: 2,
        email: 'user2@fakedomain.com',
        firstname: 'User2',
        lastname: 'User2 lastname',
        password: '123456',
        role: 'user',
      },
      {
        id: 3,
        email: 'user3@fakedomain.com',
        firstname: 'User3',
        lastname: 'User lastname',
        password: '123456',
        role: 'user',
      },
      {
        id: 4,
        email: 'user4@fakedomain.com',
        firstname: 'User4',
        lastname: 'User4 lastname',
        password: '123456',
        role: 'user',
      },
      {
        id: 5,
        email: 'user5@fakedomain.com',
        firstname: 'User5',
        lastname: 'User lastname',
        password: '123456',
        role: 'user',
      },
      {
        id: 6,
        email: 'user6@fakedomain.com',
        firstname: 'User6',
        lastname: 'User6 lastname',
        password: '123456',
        role: 'user',
      },
    ].map(async (el) => {
      if (!await Models.User.findOne({ where: { email: el.email } })) {
        await Models.User.create(el);
      }
    });

    return Promise.all(users);
  },

  down: () => {
  },
};
