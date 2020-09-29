const path = require('path');

const env = process.env.NODE_ENV || 'production';
const storage = path.join(__dirname, './db.sqlite');

const config = {
  development: {
    dialect: 'sqlite',
    storage,
    logging: console.log,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    operatorsAliases: 1,
    logging: false,
  },
};
const dbconfig = config[env];
module.exports = dbconfig;
