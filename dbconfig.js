import path from 'path';
import { dirname  } from 'path';
import { fileURLToPath  } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
export default dbconfig;
