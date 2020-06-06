const Sequelize = require('sequelize');

module.exports = {
  db: {
    dialect: 'sqlite',
    storage: ':memory:',
    operatorsAliases: Sequelize.Op,
  },
  SESSION_KEY: process.env.SESSION_KEY,
  ROLLBAR_KEY: process.env.ROLLBAR_KEY,
};
