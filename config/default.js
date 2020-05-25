const path = require('path');

const entities = path.resolve(__dirname, '..', 'server/entity/*.{js, ts}');
const migrations = path.resolve(__dirname, '..', 'server/migrations/*.{js, ts}');

module.exports = {
  db: {
    synchronize: false,
    migrationsRun: true,
    entities: [entities],
    migrations: [migrations],
    cli: {
      migrationsDir: 'server/migrations',
    },
  },
  SESSION_KEY: process.env.SESSION_KEY,
  ROLLBAR_KEY: process.env.ROLLBAR_KEY,
};
