const path = require('path');
const dotenv = require('dotenv');

const envpath = path.join(__dirname, '.env');
dotenv.config({ path: envpath });
const env = process.env.NODE_ENV || 'development';
const storage = path.join(__dirname, './db.sqlite');

const config = {
  default: {
    instance: 'db',
  },
  development: {
    dialect: 'sqlite',
    storage,
    logging: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: console.log,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    operatorsAliases: 1,
    logging: false,
  },
};
const dbconfig = { instance: 'db', ...config[env] };

if (dbconfig.use_env_variable) {
  delete dbconfig.use_env_variable;
  dbconfig.DATABASE_URL = process.env.DATABASE_URL;
}
console.log(dbconfig);
module.exports = dbconfig;
