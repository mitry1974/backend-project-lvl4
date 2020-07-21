const path = require('path');

const storage = path.join(__dirname, '../db.sqlite');

module.exports = {
  db: {
    dialect: 'sqlite',
    storage,
    logging: (...msg) => console.log(msg),
  },
  SESSION_KEY: process.env.SESSION_KEY,
  ROLLBAR_KEY: process.env.ROLLBAR_KEY,
};
