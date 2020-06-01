module.exports = {
  db: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
  SESSION_KEY: process.env.SESSION_KEY,
  ROLLBAR_KEY: process.env.ROLLBAR_KEY,
};
