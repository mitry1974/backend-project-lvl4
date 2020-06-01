'use strict';
const Models = require('../models');

module.exports = {
  up: async () => {
    const users = [
      {
        email: 'pittbull@fakedomain.com',
        firstname: 'Pitt',
        lastname: 'Bull',
        password: '123456',
        role: 'user',
      },
      {
        email: 'coronavirus@2020.ru',
        firstname: 'Corona',
        lastname: 'Virus',
        password: '123456',
        role: 'admin',
      },
      {
        email: 'dinozavr@fakedomain.com',
        firstname: 'Dino',
        lastname: 'Zavr',
        password: '123456',
        role: 'guest',
      },
    ].map(async (el) => await Models.User.create(el))

    return await Promise.all(users);
  },

  down: () => {
  },
};
