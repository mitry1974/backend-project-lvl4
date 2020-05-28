'use strict';

const userData = [
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
];

module.exports = {
  up: async (queryInterface) => queryInterface.bulkInsert('users', userData),

  down: () => {
  },
};
