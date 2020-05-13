import path from 'path';

module.exports = {
  db: {
    synchronize: false,
    migrationsRun: true,
    entities: [path.resolve(__dirname, '../server/entity/*.js')],
  },
  SESSION_KEY: process.env.SESSION_KEY,
  ROLLBAR_KEY: process.env.ROLLBAR_KEY,
};
