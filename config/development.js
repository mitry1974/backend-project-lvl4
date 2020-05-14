module.exports = {
  db: {
    synchronize: true,
    type: process.env.DB_TYPE,
    database: process.env.DB_DATABASE,
    logging: process.env.DB_LOGGING,
  },
};
