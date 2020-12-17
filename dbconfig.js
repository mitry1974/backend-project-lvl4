const path = require('path');
const dotenv = require('dotenv');
const parse = require('sequelize-parse-url');

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
    url: process.env.DATABASE_URL,
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
const envConfig = config[env];

const postgresConfig = envConfig.url ? parse(envConfig.url) : {};
const dbconfig = { instance: 'db', ...envConfig, ...postgresConfig };

module.exports = dbconfig;
