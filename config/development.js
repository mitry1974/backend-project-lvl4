const path = require('path');

module.exports = {
  db: {
    synchronize: false,
    logging: 'all',
    migrationsRun: true,
    type: 'sqlite',
    database: path.resolve(__dirname, '../', 'database.sqlite'),
  },
};
