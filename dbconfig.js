const path = require('path');
const dotenv = require('dotenv');

const envpath = path.join(__dirname, '.env');
dotenv.config({ path: envpath });
const env = process.env.NODE_ENV || 'production';
const storage = path.join(__dirname, './db.sqlite');

console.log(`env: ${env}, DATABASE URL: ${process.env.DATABASE_URL}`);

const config = {
  development: {
    dialect: 'sqlite',
    storage,
    logging: console.log,
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
const dbconfig = config[env];
module.exports = dbconfig;
