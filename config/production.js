module.exports = {
  db: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
  },
  SESSION_KEY: process.env.SESSION_KEY,
  ROLLBAR_KEY: process.env.ROLLBAR_KEY,
};
